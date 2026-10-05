"""Directory of logins for a platform admin.

The payload is the person and the organizations they belong to. It does not
include phones, addresses, customers, invoices or payment references.
"""

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from common.models import Profile, User


class PlatformUserListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_platform_admin:
            return Response(
                {"detail": "Only a platform admin can list every user."},
                status=403,
            )
        profiles = Profile.objects.select_related("org", "user").order_by(
            "user__email", "org__name"
        )
        by_user = {}
        for profile in profiles:
            bucket = by_user.setdefault(profile.user_id, [])
            bucket.append(
                {
                    "name": profile.org.name,
                    "role": profile.role,
                    "is_active": profile.is_active,
                }
            )
        users = []
        for user in User.objects.order_by("email"):
            users.append(
                {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "is_active": user.is_active,
                    "is_platform_admin": user.is_platform_admin,
                    "organizations": by_user.get(user.id, []),
                }
            )
        return Response({"users": users})
