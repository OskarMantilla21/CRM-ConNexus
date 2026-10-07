"""Who may create whom.

A CEO creates administrador profiles and chooses their permissions.
An administrador creates empleado profiles and may only hand them the
short list: the day's work, tickets and tasks, or sales.
"""

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from common.models import Profile, User
from common.serializer import OrgAwareRefreshToken


def _client(user, org, profile):
    client = APIClient()
    token = OrgAwareRefreshToken.for_user_and_org(user, org, profile)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.access_token}")
    return client


@pytest.mark.django_db
def test_ceo_creates_an_administrator_and_that_admin_creates_an_employee(org_a):
    ceo_user = User.objects.create_user(
        email="ceo.hierarchy@test.com", password="Ceo-pass-1708", name="CEO"
    )
    ceo = Profile.objects.create(user=ceo_user, org=org_a, role="CEO", is_active=True)
    ceo_client = _client(ceo_user, org_a, ceo)

    created = ceo_client.post(
        "/api/users/",
        {
            "email": "nuevo.admin@test.com",
            "name": "Nuevo Admin",
            "password": "Admin-pass-1708",
            "role": "ADMIN",
            "granted_permissions": ["sell", "daily_work"],
        },
        format="json",
    )
    assert created.status_code == status.HTTP_201_CREATED
    assert created.data["reused"] is False

    admin_user = User.objects.get(email="nuevo.admin@test.com")
    assert admin_user.name == "Nuevo Admin"
    assert admin_user.check_password("Admin-pass-1708")
    admin = Profile.objects.get(user=admin_user, org=org_a)
    assert admin.role == "ADMIN"
    assert admin.granted_permissions == ["sell", "daily_work"]

    signed_in = APIClient().post(
        "/api/auth/password/",
        {"username": "nuevo.admin", "password": "Admin-pass-1708"},
        format="json",
    )
    assert signed_in.status_code == status.HTTP_200_OK

    admin_client = _client(admin_user, org_a, admin)
    assert admin_client.get("/api/users/").status_code == status.HTTP_200_OK
    assert admin_client.get("/api/invoices/").status_code == status.HTTP_403_FORBIDDEN

    refused = admin_client.post(
        "/api/users/",
        {
            "email": "otro.admin@test.com",
            "name": "Otro Admin",
            "password": "Otro-pass-1708",
            "role": "ADMIN",
            "granted_permissions": ["sell"],
        },
        format="json",
    )
    assert refused.status_code == status.HTTP_403_FORBIDDEN

    employee = admin_client.post(
        "/api/users/",
        {
            "email": "ana.empleada@test.com",
            "name": "Ana Empleada",
            "password": "Turno-norte-1708",
            "role": "EMPLOYEE",
            "granted_permissions": ["serve", "daily_work"],
        },
        format="json",
    )
    assert employee.status_code == status.HTTP_201_CREATED
    employee_user = User.objects.get(email="ana.empleada@test.com")
    assert employee_user.check_password("Turno-norte-1708")
    employee_profile = Profile.objects.get(user=employee_user, org=org_a)
    assert employee_profile.role == "EMPLOYEE"
    assert employee_profile.granted_permissions == ["daily_work", "serve"]
    assert employee_profile.is_organization_admin is False

    staff = _client(employee_user, org_a, employee_profile)
    assert staff.get("/api/cases/").status_code != status.HTTP_403_FORBIDDEN
    assert staff.get("/api/leads/").status_code == status.HTTP_403_FORBIDDEN
    assert staff.get("/api/invoices/").status_code == status.HTTP_403_FORBIDDEN
    assert staff.get("/api/users/").status_code == status.HTTP_403_FORBIDDEN

    billing = admin_client.post(
        "/api/users/",
        {
            "email": "luis.empleado@test.com",
            "name": "Luis",
            "password": "Cobro-ajeno-1708",
            "role": "EMPLOYEE",
            "granted_permissions": ["daily_work", "bill"],
        },
        format="json",
    )
    assert billing.status_code == status.HTTP_400_BAD_REQUEST

    promoted = admin_client.patch(
        f"/api/user/{ceo_user.id}/",
        {"role": "USER"},
        format="json",
    )
    assert promoted.status_code == status.HTTP_403_FORBIDDEN
    ceo.refresh_from_db()
    assert ceo.role == "CEO"

    narrowed = admin_client.patch(
        f"/api/user/{employee_user.id}/",
        {"role": "EMPLOYEE", "granted_permissions": ["daily_work"]},
        format="json",
    )
    assert narrowed.status_code == status.HTTP_200_OK
    employee_profile.refresh_from_db()
    assert employee_profile.granted_permissions == ["daily_work"]

    deactivated = admin_client.post(
        f"/api/user/{employee_user.id}/status/",
        {"status": "Inactive"},
        format="json",
    )
    assert deactivated.status_code == status.HTTP_200_OK
    employee_profile.refresh_from_db()
    assert employee_profile.is_active is False


@pytest.mark.django_db
def test_reused_account_keeps_its_password(org_a, org_b):
    existing = User.objects.create_user(
        email="veteran.hierarchy@test.com", password="Original-1708", name="Veteran"
    )
    Profile.objects.create(user=existing, org=org_b, role="USER", is_active=True)

    ceo_user = User.objects.create_user(
        email="ceo.reuse@test.com", password="Ceo-pass-1708", name="CEO"
    )
    ceo = Profile.objects.create(user=ceo_user, org=org_a, role="CEO", is_active=True)
    response = _client(ceo_user, org_a, ceo).post(
        "/api/users/",
        {
            "email": "veteran.hierarchy@test.com",
            "name": "Renamed",
            "password": "Replacement-1708",
            "role": "EMPLOYEE",
            "granted_permissions": ["daily_work"],
        },
        format="json",
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["reused"] is True
    existing.refresh_from_db()
    assert existing.name == "Veteran"
    assert existing.check_password("Original-1708")
    assert not existing.check_password("Replacement-1708")
    profile = Profile.objects.get(user=existing, org=org_a)
    assert profile.role == "EMPLOYEE"
    assert profile.granted_permissions == ["daily_work"]


def _emails(rows):
    return [row["user_details"]["email"] for row in rows]


@pytest.mark.django_db
def test_administrator_sees_activity_for_everyone_except_the_ceo(org_a):
    ceo_user = User.objects.create_user(
        email="ceo.activity@test.com", password="Ceo-pass-1708", name="CEO"
    )
    Profile.objects.create(user=ceo_user, org=org_a, role="CEO", is_active=False)
    admin_user = User.objects.create_user(
        email="admin.activity@test.com", password="Admin-pass-1708", name="Admin"
    )
    admin = Profile.objects.create(user=admin_user, org=org_a, role="ADMIN", is_active=True)
    staff_user = User.objects.create_user(
        email="ana.activity@test.com", password="Turno-norte-1708", name="Ana"
    )
    Profile.objects.create(
        user=staff_user, org=org_a, role="EMPLOYEE", is_active=True
    )

    listing = _client(admin_user, org_a, admin).get("/api/users/")
    assert listing.status_code == status.HTTP_200_OK
    active = listing.data["active_users"]["active_users"]
    inactive = listing.data["inactive_users"]["inactive_users"]
    concealed = listing.data["people_without_activity"]["people_without_activity"]
    assert "ceo.activity@test.com" not in _emails(active)
    assert "ceo.activity@test.com" not in _emails(inactive)
    assert _emails(concealed) == ["ceo.activity@test.com"]
    assert "is_active" not in concealed[0]
    assert concealed[0]["activity_visible"] is False
    assert "last_login" not in concealed[0]["user_details"]
    assert "is_active" not in concealed[0]["user_details"]
    assert any(
        row["user_details"]["email"] == "ana.activity@test.com" and row["is_active"] is True
        for row in active
    )
    assert any(
        row["user_details"]["email"] == "admin.activity@test.com" and row["is_active"] is True
        for row in active
    )

    # Filtering by status must not put the CEO back into a list that answers it.
    filtered = _client(admin_user, org_a, admin).get("/api/users/?status=False")
    filtered_active = filtered.data["active_users"]["active_users"]
    filtered_inactive = filtered.data["inactive_users"]["inactive_users"]
    assert "ceo.activity@test.com" not in _emails(filtered_active)
    assert "ceo.activity@test.com" not in _emails(filtered_inactive)
    assert "is_active" not in filtered.data["people_without_activity"]["people_without_activity"][0]

    # A deactivated CEO cannot open the list. Another CEO, still active, can,
    # and that list says the first CEO is inactive.
    other_user = User.objects.create_user(
        email="ceo.other.activity@test.com", password="Ceo-pass-1708", name="Other CEO"
    )
    other = Profile.objects.create(user=other_user, org=org_a, role="CEO", is_active=True)
    ceo_listing = _client(other_user, org_a, other).get("/api/users/")
    assert ceo_listing.status_code == status.HTTP_200_OK
    ceo_inactive = ceo_listing.data["inactive_users"]["inactive_users"]
    assert ceo_listing.data["people_without_activity"]["people_without_activity"] == []
    assert any(
        row["user_details"]["email"] == "ceo.activity@test.com" and row["is_active"] is False
        for row in ceo_inactive
    )

    staff = Profile.objects.get(user=staff_user, org=org_a)
    changed = _client(admin_user, org_a, admin).post(
        f"/api/user/{staff_user.id}/status/",
        {"status": "Inactive"},
        format="json",
    )
    assert changed.status_code == status.HTTP_200_OK
    leaked = changed.data["active_profiles"] + changed.data["inactive_profiles"]
    assert "ceo.activity@test.com" not in _emails(leaked)
    assert "ceo.other.activity@test.com" not in _emails(leaked)
    concealed_status = changed.data["people_without_activity"]
    assert set(_emails(concealed_status)) == {
        "ceo.activity@test.com",
        "ceo.other.activity@test.com",
    }
    assert all("is_active" not in row for row in concealed_status)
    staff.refresh_from_db()
    assert staff.is_active is False

    # This administrator has no grant list, so they hold every other
    # permission. The CEO account is still closed: no role change, no
    # reactivation, no reading the account back.
    ceo_profile = Profile.objects.get(user=ceo_user, org=org_a)
    admin_api = _client(admin_user, org_a, admin)
    assert admin.granted_permissions is None
    changed_role = admin_api.patch(
        f"/api/user/{ceo_user.id}/",
        {"role": "ADMIN", "granted_permissions": ["settings", "team"]},
        format="json",
    )
    assert changed_role.status_code == status.HTTP_403_FORBIDDEN
    ceo_profile.refresh_from_db()
    assert ceo_profile.role == "CEO"
    reactivated = admin_api.post(
        f"/api/user/{ceo_user.id}/status/",
        {"status": "Active"},
        format="json",
    )
    assert reactivated.status_code == status.HTTP_403_FORBIDDEN
    ceo_profile.refresh_from_db()
    assert ceo_profile.is_active is False
    assert admin_api.get(f"/api/user/{ceo_user.id}/").status_code == status.HTTP_403_FORBIDDEN
