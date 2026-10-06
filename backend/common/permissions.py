"""
Custom Permission Classes for Multi-Tenancy Security

These permission classes enforce organization context and access control
across all API endpoints.
"""

from rest_framework import permissions

# What a CEO can hand to an administrador. The codes are stable; the UI
# translates the labels. Order is the order the team page shows them.
ALL_PERMISSIONS = (
    "sell",
    "serve",
    "bill",
    "daily_work",
    "settings",
    "team",
)

# What a member (USER) can open. The same surface the product already gave
# every non-admin: the work, and the settings hub, but not the team page.
MEMBER_PERMISSIONS = (
    "sell",
    "serve",
    "bill",
    "daily_work",
    "settings",
)

# An empleado records the day's work and nothing else.
EMPLOYEE_PERMISSIONS = ("daily_work",)


def _is_superuser(profile):
    """Literally ``True`` only. A Mock answering some other truthy value is not."""
    user = getattr(profile, "user", None)
    return getattr(user, "is_superuser", False) is True


def has_unrestricted_admin_access(profile):
    """CEO, a legacy administrator, or a superuser: every permission.

    A legacy administrator is ``role="ADMIN"`` whose ``granted_permissions``
    is still ``None``. Rows created before grants existed stay full admins.
    An administrador the CEO has given a list — even a list of every key —
    is not in this group; the list is what they have.
    """
    if profile is None:
        return False
    if _is_superuser(profile):
        return True
    role = getattr(profile, "role", None)
    if role == "CEO":
        return True
    if role == "ADMIN" and getattr(profile, "granted_permissions", None) is None:
        return True
    return False


def column_is_organization_admin(profile):
    """Value ``Profile.save`` stores. Superuser is deliberately not part of it.

    The column mirrors the role, not ``user.is_superuser``. A superuser holding
    USER stays ``False`` here; ``is_org_admin`` still answers ``True`` for them.
    An administrador granted settings or team is stored ``True`` so the column
    and the API agree. The role middleware, not this flag, keeps that person
    inside the areas the CEO actually granted.
    """
    if profile is None:
        return False
    role = getattr(profile, "role", None)
    grants = getattr(profile, "granted_permissions", None)
    if role == "CEO":
        return True
    if role == "ADMIN" and grants is None:
        return True
    return _restricted_admin_is_admin(profile)


def _restricted_admin_is_admin(profile):
    """An administrador with settings or team passes the existing admin gates.

    Those gates are ``is_org_admin``. The role middleware has already refused
    every API prefix the CEO did not grant, so passing the gate does not open
    the rest of the product. Without this, granting "settings" would still
    403 on every settings view, which all ask ``is_org_admin``.
    """
    if getattr(profile, "role", None) != "ADMIN":
        return False
    grants = getattr(profile, "granted_permissions", None)
    if not isinstance(grants, list):
        return False
    return "settings" in grants or "team" in grants


def is_org_admin(profile):
    """Whether ``profile`` administers its org.

    True for a CEO, a legacy administrator (``ADMIN`` with no grant list),
    an administrador the CEO granted settings or team, or a Django superuser.

    Superusers are org admins everywhere (owner decision, 1.11.0). Before that,
    this read ``role`` only while dozens of call sites added ``or
    request.user.is_superuser`` by hand and the rest did not, so a superuser
    holding the USER role could change a settings page at one endpoint and was
    refused at the next, and both clients showed it read-only. One rule, here.

    Membership is still required. This takes a ``Profile``, which is one
    user's membership of one org, and every request's profile is resolved by
    the middleware from an active ``Profile`` row for the org in the signed
    token. A superuser with no profile in an org gets no profile there, so
    this function is never asked about that org. ``is_superuser`` itself is
    not writable through any API serializer; it is granted with
    ``createsuperuser`` or the Django admin.

    A plain function and not only the ``IsOrgAdmin`` class below, because most
    callers are views that read wide and write narrow: the same endpoint is
    open to every member on GET and admin-only on POST, so the check has to
    happen inside the method rather than in ``permission_classes``.

    **This deliberately does not consult ``is_organization_admin``.** That
    column mirrors the role (``Profile.save`` derives it) and is not an input
    anywhere; it used to be, and an admin could ``PATCH`` a colleague to
    ``{"is_organization_admin": true, "role": "USER"}`` and grant an admin the
    UI could neither show nor revoke. The API field of the same name is
    computed from this function (see ``common.serializer``), not read from the
    column.

    ``is_superuser`` must be literally ``True``. A test double or a partially
    loaded object answering some other truthy value is not an admin.

    ``None`` is not an admin. A view with no org context has no profile, and
    answering ``False`` gives it a clean 403 instead of a 500.
    """
    if profile is None:
        return False
    if _is_superuser(profile):
        return True
    if has_unrestricted_admin_access(profile):
        return True
    return _restricted_admin_is_admin(profile)


def effective_permissions(profile):
    """The set of area keys this profile may open.

    CEO, legacy administrator and superuser get every key. An empleado gets
    daily work only. An administrador gets the list the CEO saved. A member
    gets the areas the product already showed them.
    """
    if profile is None:
        return frozenset()
    if has_unrestricted_admin_access(profile):
        return frozenset(ALL_PERMISSIONS)
    role = getattr(profile, "role", None)
    if role == "EMPLOYEE":
        return frozenset(EMPLOYEE_PERMISSIONS)
    if role == "ADMIN":
        grants = getattr(profile, "granted_permissions", None)
        if isinstance(grants, list):
            return frozenset(key for key in grants if key in ALL_PERMISSIONS)
        return frozenset()
    return frozenset(MEMBER_PERMISSIONS)


def is_restricted(profile):
    """Whether the role middleware should refuse areas they were not granted.

    Members and legacy administrators are not restricted: their access is the
    access the product already had. An empleado always is. An administrador
    with a saved grant list is, including a list that names every area.
    A superuser is never restricted.
    """
    if profile is None or _is_superuser(profile):
        return False
    role = getattr(profile, "role", None)
    if role == "EMPLOYEE":
        return True
    if role == "ADMIN" and getattr(profile, "granted_permissions", None) is not None:
        return True
    return False


def api_path_allowed(path, permissions):
    """Whether a restricted profile may call ``path``.

    Anything that is not an ``/api/`` route is left alone (Django admin,
    static files). Unknown API routes are refused. ``/api/auth/`` and
    ``/api/profile/`` stay open so they can sign in, refresh and edit their
    own name and phone.
    """
    if not path.startswith("/api/"):
        return True
    if path.startswith("/api/auth/") or path.startswith("/api/profile/"):
        return True
    if path.startswith("/api/time-entries/report") or path.startswith(
        "/api/time-entries/unbilled"
    ):
        return "bill" in permissions
    if path.startswith("/api/time-entries/"):
        return "daily_work" in permissions

    prefixes = []
    if "sell" in permissions:
        prefixes += [
            "/api/leads/",
            "/api/contacts/",
            "/api/accounts/",
            "/api/opportunities/",
            "/api/dashboard/",
        ]
    if "serve" in permissions:
        prefixes += [
            "/api/cases/",
            "/api/tasks/",
            "/api/boards/",
            "/api/documents/",
            "/api/attachments/",
            "/api/activities/",
        ]
    if "bill" in permissions:
        prefixes += ["/api/invoices/"]
    if "settings" in permissions:
        prefixes += [
            "/api/org/",
            "/api/business-hours/",
            "/api/macros/",
            "/api/webforms/",
            "/api/webhooks/",
            "/api/api-settings/",
        ]
    if "team" in permissions:
        prefixes += ["/api/users/", "/api/user/", "/api/teams/"]
    if any(key in permissions for key in ("sell", "serve", "bill", "settings")):
        prefixes += ["/api/tags/", "/api/search/"]
    return any(path.startswith(prefix) for prefix in prefixes)


def other_unrestricted_admin_exists(profile):
    """Another active member of this org who still has every permission."""
    from django.db.models import Q

    from common.models import Profile

    return (
        Profile.objects.filter(org_id=profile.org_id, is_active=True)
        .exclude(pk=profile.pk)
        .filter(
            Q(user__is_superuser=True)
            | Q(role="CEO")
            | Q(role="ADMIN", granted_permissions__isnull=True)
        )
        .exists()
    )


def dropping_last_unrestricted_admin(profile, new_role, new_grants):
    """Would this change leave the org with nobody who has every permission?"""
    from types import SimpleNamespace

    future = SimpleNamespace(
        role=new_role, granted_permissions=new_grants, user=profile.user
    )
    if not has_unrestricted_admin_access(profile):
        return False
    if has_unrestricted_admin_access(future):
        return False
    return not other_unrestricted_admin_exists(profile)


def can_mass_import(profile):
    """Whether ``profile`` may bulk-create records through a CSV import.

    Org admins (``is_org_admin``, so Django superusers too) and members
    granted ``has_sales_access``.
    Everyone else can still create records one at a time; the import is the
    mass-create surface, so it is gated more narrowly. One rule for the
    contact, ticket and lead importers, which used to carry three copies of
    it, none of which admitted a superuser.
    """
    if profile is None:
        return False
    if is_org_admin(profile):
        return True
    return bool(profile.has_sales_access)


class HasOrgContext(permissions.BasePermission):
    """
    Permission class that requires valid organization context.

    This should be used on all endpoints that require org-scoped data access.
    It verifies that:
    1. User is authenticated
    2. request.profile is set (from middleware)
    3. request.org is set (from JWT or API key)

    Usage:
        class MyView(APIView):
            permission_classes = [IsAuthenticated, HasOrgContext]
    """

    message = "Organization context is required. Please login again."

    def has_permission(self, request, view):
        # Must have profile set by middleware
        if not hasattr(request, "profile") or request.profile is None:
            return False

        # Must have org set
        if not hasattr(request, "org") or request.org is None:
            return False

        # Profile must be active
        if not request.profile.is_active:
            return False

        return True


class IsOrgAdmin(permissions.BasePermission):
    """
    Permission class that requires an org admin, as ``is_org_admin`` defines it
    (ADMIN role, or a superuser's profile in this org).

    Usage:
        class AdminOnlyView(APIView):
            permission_classes = [IsAuthenticated, HasOrgContext, IsOrgAdmin]
    """

    message = "You must be an organization administrator to perform this action."

    def has_permission(self, request, view):
        return is_org_admin(getattr(request, "profile", None))


class IsSuperAdmin(permissions.BasePermission):
    """
    Permission class for platform-level super admins.

    Super admin is an explicit, deliberately granted flag on the user record
    (``User.is_superuser``), never inferred from the email address. Deriving it
    from an email domain would hand platform-wide access: every org, every
    user. To anyone who can obtain an account at that domain, turning an
    ordinary signup into vertical privilege escalation.

    Grant it with ``manage.py createsuperuser``, the Django admin, or another
    audited path, not by handing out an email address.
    """

    message = "Super admin access required."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        return bool(user.is_active and user.is_superuser)
