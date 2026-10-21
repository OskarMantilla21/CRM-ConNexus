"""Moving every business record from one company to another."""

import pytest
from rest_framework.test import APIClient

from accounts.models import Account
from common.audit_log import SecurityAuditLog
from common.models import Org, Profile, Tags, User
from common.serializer import OrgAwareRefreshToken
from common.testing import rls_org
from contacts.models import Contact
from invoices.models import Product
from leads.models import Lead, LeadPipeline

URL = "/api/org/migrate/"


def _client(user, org, profile):
    client = APIClient()
    token = OrgAwareRefreshToken.for_user_and_org(user, org, profile)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.access_token}")
    return client


@pytest.fixture
def companies(org_a, org_b):
    user = User.objects.create_user(email="mover@test.com", password="testpass123")
    ceo_a = Profile.objects.create(user=user, org=org_a, role="CEO", is_active=True)
    Profile.objects.create(user=user, org=org_b, role="CEO", is_active=True)
    return user, ceo_a


def _plant(org):
    """A handful of records that have to survive the move together."""
    account = Account.objects.create(name="Misma", org=org)
    contact = Contact.objects.create(
        first_name="Ana",
        last_name="Luna",
        email="ana@example.com",
        org=org,
    )
    account.contacts.add(contact)
    lead = Lead.objects.create(
        first_name="Ana", last_name="Luna", email="ana@example.com", org=org
    )
    tag = Tags.objects.create(name="vip", org=org)
    account.tags.add(tag)
    pipeline = LeadPipeline.objects.create(name="Entrada", org=org, is_default=True)
    product = Product.objects.create(name="Pan", sku="PAN-1", org=org, price=10)
    return {
        "account": account,
        "contact": contact,
        "lead": lead,
        "tag": tag,
        "pipeline": pipeline,
        "product": product,
    }


def test_import_moves_records_and_keeps_ids(org_a, org_b, companies):
    user, ceo_a = companies
    Account.objects.create(name="Misma", org=org_a)
    Contact.objects.create(
        first_name="Ya", last_name="Aqui", email="ana@example.com", org=org_a
    )
    Tags.objects.create(name="vip", org=org_a)
    LeadPipeline.objects.create(name="Local", org=org_a, is_default=True)
    with rls_org(org_b):
        planted = _plant(org_b)
        worker = User.objects.create_user(email="worker@test.com", password="testpass123")
        there = Profile.objects.create(user=worker, org=org_b, role="USER", is_active=True)
        Profile.objects.create(user=worker, org=org_a, role="USER", is_active=True)
        planted["lead"].assigned_to.add(there)
        outsider = User.objects.create_user(email="out@test.com", password="testpass123")
        only_there = Profile.objects.create(
            user=outsider, org=org_b, role="USER", is_active=True
        )
        planted["account"].assigned_to.add(only_there)

    response = _client(user, org_a, ceo_a).post(
        URL,
        {"direction": "import", "org_id": str(org_b.pk), "confirm_name": org_b.name},
        format="json",
    )

    assert response.status_code == 200, response.content
    body = response.json()
    assert body["destination"]["id"] == str(org_a.pk)
    account = Account.objects.get(pk=planted["account"].pk)
    assert account.org_id == org_a.pk
    assert account.name != "Misma"
    assert org_b.name in account.name
    contact = Contact.objects.get(pk=planted["contact"].pk)
    assert contact.org_id == org_a.pk
    assert contact.email == "ana+migrado@example.com"
    assert list(account.contacts.values_list("pk", flat=True)) == [contact.pk]
    tag = Tags.objects.get(pk=planted["tag"].pk)
    assert tag.org_id == org_a.pk
    assert tag.slug != "vip"
    assert list(account.tags.values_list("pk", flat=True)) == [tag.pk]
    pipeline = LeadPipeline.objects.get(pk=planted["pipeline"].pk)
    assert pipeline.org_id == org_a.pk
    assert pipeline.is_default is False
    product = Product.objects.get(pk=planted["product"].pk)
    assert product.org_id == org_a.pk
    assert product.sku == "PAN-1"
    lead = Lead.objects.get(pk=planted["lead"].pk)
    assert lead.org_id == org_a.pk
    assert list(lead.assigned_to.values_list("org_id", flat=True)) == [org_a.pk]
    assert account.assigned_to.count() == 0
    with rls_org(org_b):
        assert Account.objects.filter(org=org_b).count() == 0
        assert Contact.objects.filter(org=org_b).count() == 0
        assert Lead.objects.filter(org=org_b).count() == 0
    assert SecurityAuditLog.objects.filter(
        event_type="ORG_DATA_MIGRATED", org=org_a
    ).exists()


def test_export_moves_the_current_company(org_a, org_b, companies):
    user, ceo_a = companies
    account = Account.objects.create(name="Solo aqui", org=org_a)

    response = _client(user, org_a, ceo_a).post(
        URL,
        {"direction": "export", "org_id": str(org_b.pk), "confirm_name": org_b.name},
        format="json",
    )

    assert response.status_code == 200, response.content
    account.refresh_from_db()
    assert account.org_id == org_b.pk
    with rls_org(org_b):
        assert Account.objects.filter(pk=account.pk, org=org_b).exists()


def test_wrong_confirmation_moves_nothing(org_a, org_b, companies):
    user, ceo_a = companies
    with rls_org(org_b):
        account = Account.objects.create(name="Quieto", org=org_b)

    response = _client(user, org_a, ceo_a).post(
        URL,
        {"direction": "import", "org_id": str(org_b.pk), "confirm_name": "otro"},
        format="json",
    )

    assert response.status_code == 400
    assert response.json()["error"] == "confirm_name"
    with rls_org(org_b):
        account.refresh_from_db()
        assert account.org_id == org_b.pk


def test_admin_and_single_company_ceo_are_refused(org_a, org_b, admin_user, admin_profile):
    admin = _client(admin_user, org_a, admin_profile)
    assert admin.get(URL).status_code == 403
    assert (
        admin.post(
            URL,
            {"direction": "import", "org_id": str(org_b.pk), "confirm_name": org_b.name},
            format="json",
        ).status_code
        == 403
    )

    user = User.objects.create_user(email="one@test.com", password="testpass123")
    only = Profile.objects.create(user=user, org=org_a, role="CEO", is_active=True)
    response = _client(user, org_a, only).post(
        URL,
        {"direction": "export", "org_id": str(org_b.pk), "confirm_name": org_b.name},
        format="json",
    )
    assert response.status_code == 403
    assert response.json()["error"] == "not_ceo"


def test_targets_are_the_other_companies_the_ceo_runs(org_a, org_b, companies):
    user, ceo_a = companies
    Org.objects.create(name="Ajena")

    response = _client(user, org_a, ceo_a).get(URL)

    assert response.status_code == 200
    body = response.json()
    assert body["current"]["id"] == str(org_a.pk)
    assert [row["id"] for row in body["organizations"]] == [str(org_b.pk)]
