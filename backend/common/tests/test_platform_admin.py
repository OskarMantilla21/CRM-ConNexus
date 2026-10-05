"""A platform admin can list logins and cannot open a company's records."""

import pytest
from rest_framework.test import APIClient

from common.serializer import OrgAwareRefreshToken
from leads.models import Lead


@pytest.fixture
def platform_user(db):
    from common.models import User

    return User.objects.create_user(
        email="platform@test.com",
        password="testpass123",
        is_platform_admin=True,
    )


@pytest.fixture
def platform_client(platform_user):
    client = APIClient()
    token = OrgAwareRefreshToken.for_user_and_org(platform_user, None, None)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.access_token}")
    return client


@pytest.mark.django_db
def test_platform_admin_lists_users_without_customer_secrets(
    platform_client, admin_user, org_a, admin_profile
):
    Lead.objects.create(
        org=org_a,
        title="Tarjeta cliente 4111",
        description="SECRETO-TARJETA-4111",
        created_by=admin_user,
    )
    response = platform_client.get("/api/platform/users/")
    assert response.status_code == 200
    body = response.content.decode()
    emails = {row["email"] for row in response.json()["users"]}
    assert "platform@test.com" in emails
    assert "admin@test.com" in emails
    assert "SECRETO-TARJETA-4111" not in body
    assert "4111" not in body
    org_names = [
        org["name"]
        for row in response.json()["users"]
        if row["email"] == "admin@test.com"
        for org in row["organizations"]
    ]
    assert org_names == ["Test Organization A"]


@pytest.mark.django_db
def test_platform_admin_is_refused_customer_and_payment_routes(
    platform_client, org_a
):
    for path in ("/api/leads/", "/api/accounts/", "/api/contacts/", "/api/invoices/"):
        response = platform_client.get(path)
        assert response.status_code == 403, path
        assert "cannot open" in response.json()["detail"]


@pytest.mark.django_db
def test_org_admin_cannot_list_every_user(admin_client):
    response = admin_client.get("/api/platform/users/")
    assert response.status_code == 403


@pytest.mark.django_db
def test_org_admin_still_reads_own_leads(admin_client, admin_user, org_a, admin_profile):
    Lead.objects.create(org=org_a, title="Lead propio", created_by=admin_user)
    response = admin_client.get("/api/leads/")
    assert response.status_code == 200
    assert "Lead propio" in response.content.decode()
