"""Username and password sign-in.

The web form posts here instead of asking for an email code. The username is
the account email, the part before ``@``, or the tag after ``+``. A miss never
creates a user and never says whether the name exists.
"""

import pytest
from django.core.cache import cache
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken

from common.audit_log import SecurityAuditLog
from common.models import Profile, User

URL = "/api/auth/password/"


@pytest.fixture(autouse=True)
def _fresh_throttle():
    """Sign-in is throttled per address, and every test here uses the same one."""
    cache.clear()
    yield
    cache.clear()


def _failures():
    return SecurityAuditLog.objects.filter(event_type="LOGIN_FAILURE")


@pytest.mark.django_db
class TestPasswordLogin:
    def test_plus_tag_opens_that_account(
        self, unauthenticated_client, admin_user, admin_profile, org_a
    ):
        tagged = User.objects.create_user(
            email="owner+ceo@example.com", password="Ceo-1708", name="CEO"
        )
        Profile.objects.create(user=tagged, org=org_a, role="CEO", is_active=True)

        response = unauthenticated_client.post(
            URL, {"username": "CEO", "password": "Ceo-1708"}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert "password" not in response.data
        claims = AccessToken(response.data["access_token"])
        assert claims["user_email"] == "owner+ceo@example.com"
        assert claims["user_name"] == "CEO"
        assert claims["org_id"] == str(org_a.id)
        assert claims["role"] == "CEO"
        assert response.data["current_org"]["id"] == str(org_a.id)
        tagged.refresh_from_db()
        assert tagged.last_login is not None
        assert SecurityAuditLog.objects.filter(event_type="LOGIN_SUCCESS").exists()

    def test_email_and_local_part(self, unauthenticated_client, admin_user, admin_profile, org_a):
        response = unauthenticated_client.post(
            URL,
            {"username": "  Admin@Test.com ", "password": "testpass123"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert AccessToken(response.data["access_token"])["user_email"] == admin_user.email

        User.objects.create_user(email="ada@example.com", password="local-part")
        by_local = unauthenticated_client.post(
            URL, {"username": "ada", "password": "local-part"}, format="json"
        )
        assert by_local.status_code == status.HTTP_200_OK
        assert AccessToken(by_local.data["access_token"])["user_email"] == "ada@example.com"

    def test_wrong_password_matches_an_unknown_name(self, unauthenticated_client, admin_user):
        before = User.objects.count()
        wrong = unauthenticated_client.post(
            URL, {"username": admin_user.email, "password": "nope"}, format="json"
        )
        missing = unauthenticated_client.post(
            URL, {"username": "nobody", "password": "nope"}, format="json"
        )

        assert wrong.status_code == status.HTTP_400_BAD_REQUEST
        assert missing.status_code == status.HTTP_400_BAD_REQUEST
        assert wrong.data == missing.data == {"error": "Invalid username or password"}
        assert "access_token" not in wrong.data
        assert User.objects.count() == before
        assert _failures().count() == 2

    def test_a_shared_tag_signs_in_nobody(self, unauthenticated_client):
        User.objects.create_user(email="a+ceo@example.com", password="one")
        User.objects.create_user(email="b+ceo@example.com", password="one")

        response = unauthenticated_client.post(
            URL, {"username": "ceo", "password": "one"}, format="json"
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "access_token" not in response.data
        assert _failures().count() == 1

    def test_disabled_account_with_the_right_password(self, unauthenticated_client):
        user = User.objects.create_user(email="gone@example.com", password="still-right")
        user.is_active = False
        user.save(update_fields=["is_active"])

        response = unauthenticated_client.post(
            URL, {"username": "gone", "password": "still-right"}, format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data == {"error": "User account is disabled"}
        assert "access_token" not in response.data

    def test_a_wrong_password_hides_that_the_account_is_disabled(self, unauthenticated_client):
        user = User.objects.create_user(email="gone@example.com", password="still-right")
        user.is_active = False
        user.save(update_fields=["is_active"])

        response = unauthenticated_client.post(
            URL, {"username": "gone", "password": "wrong"}, format="json"
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {"error": "Invalid username or password"}

    def test_blank_and_non_strings(self, unauthenticated_client):
        blank = unauthenticated_client.post(
            URL, {"username": "  ", "password": ""}, format="json"
        )
        numbers = unauthenticated_client.post(
            URL, {"username": 1, "password": 2}, format="json"
        )
        assert blank.status_code == status.HTTP_400_BAD_REQUEST
        assert numbers.status_code == status.HTTP_400_BAD_REQUEST
        assert _failures().count() == 0

    def test_two_orgs_do_not_pick_one(
        self, unauthenticated_client, admin_user, admin_profile, org_b
    ):
        Profile.objects.create(user=admin_user, org=org_b, role="USER", is_active=True)
        response = unauthenticated_client.post(
            URL,
            {"username": admin_user.email, "password": "testpass123"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert "current_org" not in response.data
        assert "org_id" not in AccessToken(response.data["access_token"])

    def test_the_other_accounts_password_does_not_open_this_one(
        self, unauthenticated_client, admin_user
    ):
        User.objects.create_user(email="owner+empleado1@example.com", password="theirs")
        response = unauthenticated_client.post(
            URL, {"username": "empleado1", "password": "testpass123"}, format="json"
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "access_token" not in response.data
        admin_user.refresh_from_db()
        assert admin_user.last_login is None
