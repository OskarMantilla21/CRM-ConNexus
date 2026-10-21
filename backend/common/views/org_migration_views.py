"""Move every business record between two companies the caller runs.

Both directions are the same operation. Import reads another company into
the one in the session. Export writes the session company into another one.
The caller has to be an active CEO of each, and has to type the other
company's name so a mis-click cannot empty it.
"""

from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.models import Org, Profile
from common.org_migration import OrgMigrationError, migrate_org_data
from common.permissions import HasOrgContext


def _ceo_orgs(user, current_id):
    return (
        Org.objects.filter(
            is_active=True,
            profiles__user=user,
            profiles__role="CEO",
            profiles__is_active=True,
        )
        .exclude(pk=current_id)
        .distinct()
        .order_by("name")
    )


class OrgMigrationSerializer(serializers.Serializer):
    direction = serializers.ChoiceField(choices=["import", "export"])
    org_id = serializers.UUIDField()
    confirm_name = serializers.CharField(allow_blank=False, trim_whitespace=True)


class OrgMigrationView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    def _ceo_here(self, request):
        profile = request.profile
        return profile.role == "CEO" and profile.is_active

    @extend_schema(tags=["organization"], operation_id="org_migration_targets")
    def get(self, request):
        if not self._ceo_here(request):
            return Response(
                {"error": "not_ceo"},
                status=status.HTTP_403_FORBIDDEN,
            )
        orgs = [
            {"id": str(org.pk), "name": org.name or ""}
            for org in _ceo_orgs(request.user, request.org.pk)
        ]
        return Response(
            {
                "current": {"id": str(request.org.pk), "name": request.org.name or ""},
                "organizations": orgs,
            }
        )

    @extend_schema(tags=["organization"], operation_id="org_migration_run")
    def post(self, request):
        if not self._ceo_here(request):
            return Response(
                {"error": "not_ceo"},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = OrgMigrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        other = Org.objects.filter(pk=serializer.validated_data["org_id"]).first()
        if other is None or not other.is_active:
            return Response({"error": "not_ceo"}, status=status.HTTP_403_FORBIDDEN)
        if other.pk == request.org.pk:
            return Response({"error": "same_org"}, status=status.HTTP_400_BAD_REQUEST)
        is_ceo_there = Profile.objects.filter(
            user=request.user, org=other, role="CEO", is_active=True
        ).exists()
        if not is_ceo_there:
            return Response({"error": "not_ceo"}, status=status.HTTP_403_FORBIDDEN)
        if (other.name or "").strip() != serializer.validated_data["confirm_name"]:
            return Response({"error": "confirm_name"}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.validated_data["direction"] == "import":
            source, destination = other, request.org
        else:
            source, destination = request.org, other

        try:
            report = migrate_org_data(
                user=request.user,
                source=source,
                destination=destination,
                request=request,
            )
        except OrgMigrationError as exc:
            code = status.HTTP_403_FORBIDDEN if exc.code == "not_ceo" else status.HTTP_400_BAD_REQUEST
            return Response(
                {"error": exc.code, "message": str(exc)},
                status=code,
            )
        report["direction"] = serializer.validated_data["direction"]
        return Response(report)
