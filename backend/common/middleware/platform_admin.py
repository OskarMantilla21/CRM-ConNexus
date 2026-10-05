"""Keep a platform admin inside the user directory.

A platform admin exists to see who has an account. The companies those people
run store customer records, invoices and payment references, and this role
must not read them. The check lives here, after the token is decoded and
before a view runs, so a new customer endpoint cannot forget it.

The decision is the database flag, not the JWT claim. The claim is only a
hint the web app uses to send this person to their own page.
"""

from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken

# Login and the directory itself. Everything else under /api/ is a company
# record or a setting that describes one, and stays closed.
ALLOWED_PREFIXES = (
    "/api/auth/",
    "/api/platform/",
)


def _platform_admin_id(request):
    """The user id when this request is a platform admin, else None.

    An anonymous request, a customer portal token and a normal member all
    return None so the rest of the stack answers them as it already does.
    """
    header = request.headers.get("Authorization", "")
    parts = header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    if parts[1].startswith("bcrm_pat_"):
        return None
    try:
        token = AccessToken(parts[1])
    except TokenError:
        return None
    user_id = token.get("user_id")
    if not user_id:
        return None
    User = get_user_model()
    if User.objects.filter(id=user_id, is_platform_admin=True).exists():
        return user_id
    return None


class PlatformAdminScope:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/api/") and not request.path.startswith(
            ALLOWED_PREFIXES
        ):
            if _platform_admin_id(request):
                return JsonResponse(
                    {
                        "detail": (
                            "This role can list users and cannot open "
                            "customer or payment records."
                        )
                    },
                    status=403,
                )
        return self.get_response(request)
