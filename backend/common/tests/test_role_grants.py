"""CEO, administrador grants, and empleado.

A legacy ADMIN (no grant list) stays a full admin, which is what every
existing row and test already is. A CEO is a full admin too. An
administrador with a saved list has only those areas. An empleado can
record the day's work and nothing else.
"""

import pytest
from django.test import RequestFactory

from common.middleware.role_access import RoleAccessMiddleware
from common.models import Profile, User
from common.permissions import (
    api_path_allowed,
    effective_permissions,
    is_org_admin,
    is_restricted,
)


def _profile(role, grants=None, superuser=False):
    user = User(email="x@test.com", is_superuser=superuser)
    return Profile(user=user, role=role, granted_permissions=grants)


def test_legacy_admin_is_still_a_full_admin():
    profile = _profile("ADMIN", None)
    assert is_org_admin(profile) is True
    assert is_restricted(profile) is False
    assert effective_permissions(profile) == {
        "sell",
        "serve",
        "bill",
        "daily_work",
        "settings",
        "team",
    }


def test_ceo_has_every_permission():
    profile = _profile("CEO")
    assert is_org_admin(profile) is True
    assert "team" in effective_permissions(profile)
    assert is_restricted(profile) is False


def test_administrador_has_only_the_granted_list():
    profile = _profile("ADMIN", ["sell", "daily_work"])
    assert is_org_admin(profile) is False
    assert is_restricted(profile) is True
    assert effective_permissions(profile) == {"sell", "daily_work"}


def test_settings_grant_passes_admin_gates_but_stays_restricted():
    profile = _profile("ADMIN", ["settings"])
    assert is_org_admin(profile) is True
    assert is_restricted(profile) is True
    assert effective_permissions(profile) == {"settings"}


def test_empleado_can_only_record_daily_work():
    profile = _profile("EMPLOYEE")
    assert is_org_admin(profile) is False
    assert is_restricted(profile) is True
    assert effective_permissions(profile) == {"daily_work"}
    assert api_path_allowed("/api/time-entries/log/", effective_permissions(profile))
    assert not api_path_allowed("/api/leads/", effective_permissions(profile))
    assert not api_path_allowed(
        "/api/time-entries/report/", effective_permissions(profile)
    )
    assert api_path_allowed("/api/auth/me/", effective_permissions(profile))
    assert api_path_allowed("/api/profile/", effective_permissions(profile))


def test_member_is_not_restricted():
    profile = _profile("USER")
    assert is_org_admin(profile) is False
    assert is_restricted(profile) is False
    assert "team" not in effective_permissions(profile)
    assert "settings" in effective_permissions(profile)


def test_middleware_refuses_an_empleado_the_sales_api():
    profile = _profile("EMPLOYEE")
    request = RequestFactory().get("/api/leads/")
    request.profile = profile
    response = RoleAccessMiddleware(lambda req: None)(request)
    assert response.status_code == 403


def test_middleware_lets_an_empleado_log_work():
    profile = _profile("EMPLOYEE")
    request = RequestFactory().post("/api/time-entries/log/")
    request.profile = profile
    seen = {}

    def _ok(req):
        seen["path"] = req.path
        return None

    assert RoleAccessMiddleware(_ok)(request) is None
    assert seen["path"] == "/api/time-entries/log/"


@pytest.mark.django_db
def test_saving_an_empleado_does_not_make_them_an_admin(org_a, regular_user):
    profile = Profile.objects.create(
        user=regular_user, org=org_a, role="EMPLOYEE", is_active=True
    )
    profile.refresh_from_db()
    assert profile.role == "EMPLOYEE"
    assert profile.is_organization_admin is False
    assert profile.granted_permissions is None


@pytest.mark.django_db
def test_saving_a_ceo_marks_the_admin_column(org_a):
    user = User.objects.create_user(email="ceo@test.com", password="testpass123")
    profile = Profile.objects.create(user=user, org=org_a, role="CEO", is_active=True)
    profile.refresh_from_db()
    assert profile.is_organization_admin is True


@pytest.mark.django_db
def test_a_grant_list_survives_save_only_for_an_administrador(org_a):
    user = User.objects.create_user(email="boss@test.com", password="testpass123")
    profile = Profile.objects.create(
        user=user,
        org=org_a,
        role="ADMIN",
        granted_permissions=["sell", "serve"],
        is_active=True,
    )
    profile.refresh_from_db()
    assert profile.granted_permissions == ["sell", "serve"]
    assert profile.is_organization_admin is False
    profile.role = "CEO"
    profile.save()
    profile.refresh_from_db()
    assert profile.granted_permissions is None
    assert profile.is_organization_admin is True
