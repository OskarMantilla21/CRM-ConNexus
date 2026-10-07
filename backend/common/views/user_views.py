from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError, transaction
from django.db.models import Count, ProtectedError, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cases.models import Case
from cases.serializer import CaseSerializer, parent_access_context
from common import swagger_params
from common.models import Comment, PersonalAccessToken, Profile, Teams, User
from common.permissions import (
    HasOrgContext,
    actor_may_assign_role,
    can_manage_administrators,
    can_manage_employees,
    ceo_account_is_closed,
    dropping_last_unrestricted_admin,
    sees_every_activity_status,
    has_unrestricted_admin_access,
    other_unrestricted_admin_exists,
)
from common.serializer import (
    BillingAddressSerializer,
    CommentSerializer,
    CreateProfileSerializer,
    CreateUserSerializer,
    ProfileSerializer,
    TeamsSerializer,
    UserCreateSwaggerSerializer,
    UserUpdateStatusSwaggerSerializer,
)
from common.tasks import send_email_user_delete
from common.utils import COUNTRIES, ROLES
from contacts.models import Contact
from contacts.serializer import ContactSerializer
from opportunity.models import Opportunity
from opportunity.serializer import OpportunitySerializer


def _planned_role_and_grants(profile, validated):
    """The role and grant list a validated profile update would store."""
    new_role = validated.get("role", profile.role)
    if "granted_permissions" in validated:
        new_grants = validated.get("granted_permissions")
    else:
        new_grants = profile.granted_permissions
    if new_role not in ("ADMIN", "EMPLOYEE"):
        new_grants = None
    elif new_role == "EMPLOYEE" and not isinstance(new_grants, list):
        new_grants = ["daily_work"]
    return new_role, new_grants


def _clean_name(raw):
    """A display name for a new account, or an error sentence."""
    if raw is None or raw == "":
        return None, None
    if not isinstance(raw, str):
        return None, "Enter a name."
    name = raw.strip()
    if not name:
        return None, None
    if len(name) > 255:
        return None, "A name can be at most 255 characters."
    return name, None


def _clean_password(raw, email, name):
    """A password for a new account, or an error sentence.

    Empty means the caller did not set one. An account created that way cannot
    sign in with a password until someone sets one. A present password has to
    pass Django's validators.
    """
    if raw is None or raw == "":
        return None, None
    if not isinstance(raw, str):
        return None, "Enter a password."
    if len(raw) > 256:
        return None, "Enter a password of at most 256 characters."
    probe = User(email=email or "", name=name or "")
    try:
        validate_password(raw, probe)
    except DjangoValidationError as exc:
        return None, exc.messages[0]
    return raw, None


def _role_refused():
    return Response(
        {"error": True, "errors": "You can only create employee profiles."},
        status=status.HTTP_403_FORBIDDEN,
    )


def _employee_only_refused():
    return Response(
        {"error": True, "errors": "You can only change employees."},
        status=status.HTTP_403_FORBIDDEN,
    )


def _last_admin_response():
    return Response(
        {
            "error": True,
            "errors": "The organization must keep at least one active admin.",
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


def _valid_token_counts_by_profile(org):
    """{profile_id (str): count of non-revoked, non-expired PATs} for one org.

    One query for the whole roster. A token is "valid" if it has not been
    revoked and has not expired. The same test PersonalAccessToken.is_valid()
    applies per row, expressed as a filter so the count is a single round trip.
    """
    now = timezone.now()
    rows = (
        PersonalAccessToken.objects.filter(org=org, revoked_at__isnull=True)
        .filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))
        .values("profile_id")
        .annotate(n=Count("id"))
    )
    return {str(r["profile_id"]): r["n"] for r in rows}


def _conceal_ceo_row(row):
    """Drop every field that says whether a CEO account is active.

    The row stays in the directory. The profile flag, the user flag and the
    last sign-in all answer the same question, so none of them is returned
    to an administrator.
    """
    row.pop("is_active", None)
    row["activity_visible"] = False
    details = row.get("user_details")
    if isinstance(details, dict):
        details.pop("is_active", None)
        details.pop("last_login", None)
    return row


class GetTeamsAndUsersView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    @extend_schema(
        tags=["users"],
        parameters=swagger_params.organization_params,
        responses={
            200: inline_serializer(
                name="TeamsAndUsersResponse",
                fields={
                    "teams": TeamsSerializer(many=True),
                    "profiles": ProfileSerializer(many=True),
                },
            )
        },
    )
    def get(self, request, *args, **kwargs):
        data = {}
        teams = Teams.objects.filter(org=request.profile.org).order_by("-id")
        teams_data = TeamsSerializer(teams, many=True).data
        profiles = Profile.objects.filter(
            is_active=True, org=request.profile.org
        ).order_by("user__email")
        profiles_data = ProfileSerializer(profiles, many=True).data
        data["teams"] = teams_data
        data["profiles"] = profiles_data
        return Response(data)


class UsersListView(APIView, LimitOffsetPagination):
    permission_classes = (IsAuthenticated, HasOrgContext)

    @extend_schema(
        tags=["users"],
        parameters=swagger_params.organization_params,
        request=UserCreateSwaggerSerializer,
        responses={
            201: inline_serializer(
                name="UserCreateResponse",
                fields={
                    "error": serializers.BooleanField(),
                    "message": serializers.CharField(),
                },
            )
        },
    )
    def post(self, request, format=None):
        # A CEO creates administrador profiles. An administrador creates
        # empleado profiles. A member creates nobody.
        if not can_manage_employees(self.request.profile):
            return Response(
                {"error": True, "errors": "Permission Denied"},
                status=status.HTTP_403_FORBIDDEN,
            )
        params = request.data
        if params:
            user_serializer = CreateUserSerializer(data=params, org=request.profile.org)
            address_serializer = BillingAddressSerializer(data=params)
            # This POST is already gated above, and creating someone inherently
            # means choosing their role, so role is grantable here. The view
            # still refuses a role this actor is not allowed to hand out.
            profile_serializer = CreateProfileSerializer(
                data=params, can_grant_privileges=True
            )
            data = {}
            if not user_serializer.is_valid():
                data["user_errors"] = dict(user_serializer.errors)
            if not profile_serializer.is_valid():
                data["profile_errors"] = profile_serializer.errors
            if not address_serializer.is_valid():
                data["address_errors"] = (address_serializer.errors,)
            if data:
                return Response(
                    {"error": True, "errors": data},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            role = profile_serializer.validated_data["role"]
            if not actor_may_assign_role(request.profile, None, role):
                return _role_refused()
            email = user_serializer.validated_data["email"]
            raw = params if isinstance(params, dict) else {}
            name, name_error = _clean_name(raw.get("name"))
            if name_error:
                return Response(
                    {"error": True, "errors": name_error},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # A password is checked only when this email is new. Reusing an
            # account from another org must not replace the password they
            # already sign in with.
            fresh = not User.objects.filter(email__iexact=email).exists()
            password = None
            if fresh:
                password, password_error = _clean_password(
                    raw.get("password"), email, name
                )
                if password_error:
                    return Response(
                        {"error": True, "errors": password_error},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            # A concurrent invite for the same email can commit between the
            # checks above and the writes below. Keep the account, address and
            # membership in one transaction so a lost race rolls back cleanly
            # instead of stranding a half-built user.
            try:
                with transaction.atomic():
                    # Address is org-scoped and RLS-protected, so it must carry
                    # the org. Only create one when address fields were actually
                    # supplied -- the team page sends name, email, password and role.
                    address_obj = None
                    if any(address_serializer.validated_data.values()):
                        address_obj = address_serializer.save(org=request.profile.org)

                    user = User.objects.filter(email__iexact=email).first()
                    created_account = user is None
                    if created_account:
                        user = user_serializer.save(is_active=True)
                        if name:
                            user.name = name
                        if password:
                            user.set_password(password)
                        if name or password:
                            user.save()
                    # An existing account is reused as-is: the inviting person
                    # gets a profile in their own org and no say over that
                    # person's account or password.

                    grants = profile_serializer.validated_data.get("granted_permissions")
                    if role not in ("ADMIN", "EMPLOYEE"):
                        grants = None
                    Profile.objects.create(
                        user=user,
                        date_of_joining=timezone.localdate(),
                        role=role,
                        granted_permissions=grants,
                        address=address_obj,
                        org=request.profile.org,
                    )
            except IntegrityError:
                return Response(
                    {"error": True, "errors": "User already in organization"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "error": False,
                    "message": "User Created Successfully",
                    "reused": not created_account,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"error": True, "errors": "Invalid request"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @extend_schema(
        tags=["users"],
        parameters=swagger_params.user_list_params,
        responses={
            200: inline_serializer(
                name="UsersListResponse",
                fields={
                    "active_users": serializers.DictField(),
                    "inactive_users": serializers.DictField(),
                    "admin_email": serializers.CharField(),
                    "roles": serializers.ListField(),
                    "status": serializers.ListField(),
                },
            )
        },
    )
    def get(self, request, format=None):
        # Check if profile exists and user has permission
        if not self.request.profile:
            return Response(
                {"error": True, "errors": "Organization context required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not can_manage_employees(self.request.profile):
            return Response(
                {"error": True, "errors": "Permission Denied"},
                status=status.HTTP_403_FORBIDDEN,
            )
        queryset = Profile.objects.filter(org=request.profile.org).order_by("-id")
        params = request.query_params
        if params:
            if params.get("email"):
                queryset = queryset.filter(user__email__icontains=params.get("email"))
            if params.get("role"):
                queryset = queryset.filter(role=params.get("role"))
        # An administrator sees the CEO in the directory and does not learn
        # whether that account is active. The status filter stays on the
        # other rows, so filtering "inactive" cannot answer the question by
        # whether the CEO shows up.
        if sees_every_activity_status(request.profile):
            visible = queryset
            concealed_qs = queryset.none()
        else:
            visible = queryset.exclude(role="CEO")
            concealed_qs = queryset.filter(role="CEO")
        if params and params.get("status"):
            visible = visible.filter(is_active=params.get("status"))

        # A not-yet-revoked, unexpired token on a deactivated account is a
        # dormant liability the team page surfaces: it is rejected at login
        # today (resolve_valid_pat checks profile.is_active: see
        # test_pat_auth.py::test_inactive_profile_raises), but it would
        # authenticate again the moment the account is reactivated, so it is
        # worth revoking as part of offboarding. Count such tokens per profile
        # once, here, rather than on ProfileSerializer (which many endpoints
        # share and would each pay an extra query for a field only this reads).
        token_counts = _valid_token_counts_by_profile(request.profile.org)

        def _with_token_counts(rows):
            for row in rows:
                row["active_token_count"] = token_counts.get(str(row["id"]), 0)
            return rows

        context = {}
        queryset_active_users = visible.filter(is_active=True)
        results_active_users = self.paginate_queryset(
            queryset_active_users.distinct(), self.request, view=self
        )
        active_users = _with_token_counts(
            ProfileSerializer(results_active_users, many=True).data
        )
        for row in active_users:
            row["activity_visible"] = True
        if results_active_users:
            offset = queryset_active_users.filter(
                id__gte=results_active_users[-1].id
            ).count()
            if offset == queryset_active_users.count():
                offset = None
        else:
            offset = 0
        context["active_users"] = {
            "active_users_count": self.count,
            "active_users": active_users,
            "offset": offset,
        }

        queryset_inactive_users = visible.filter(is_active=False)
        results_inactive_users = self.paginate_queryset(
            queryset_inactive_users.distinct(), self.request, view=self
        )
        inactive_users = _with_token_counts(
            ProfileSerializer(results_inactive_users, many=True).data
        )
        for row in inactive_users:
            row["activity_visible"] = True
        if results_inactive_users:
            offset = queryset_inactive_users.filter(
                id__gte=results_inactive_users[-1].id
            ).count()
            if offset == queryset_inactive_users.count():
                offset = None
        else:
            offset = 0
        context["inactive_users"] = {
            "inactive_users_count": self.count,
            "inactive_users": inactive_users,
            "offset": offset,
        }

        concealed_rows = _with_token_counts(
            ProfileSerializer(concealed_qs.distinct(), many=True).data
        )
        for row in concealed_rows:
            _conceal_ceo_row(row)
        context["people_without_activity"] = {
            "people_without_activity_count": len(concealed_rows),
            "people_without_activity": concealed_rows,
        }

        context["admin_email"] = settings.ADMIN_EMAIL
        context["roles"] = ROLES
        context["status"] = [("True", "Active"), ("False", "In Active")]
        return Response(context)


class UserDetailView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    def get_object(self, pk):
        # Security fix: Filter by org to prevent cross-org enumeration
        # Lookup by user ID since frontend sends user.id, not profile.id
        return get_object_or_404(Profile, user__id=pk, org=self.request.profile.org)

    @staticmethod
    def _may_touch(request, target_profile):
        """May this request edit `target_profile` at all?

        A person may edit their own contact details. A CEO may edit anyone
        else. An administrador may edit an empleado and nobody else.
        """
        if ceo_account_is_closed(request.profile, target_profile):
            return False
        if request.profile.id == target_profile.id:
            return True
        if can_manage_administrators(request.profile):
            return True
        return (
            getattr(request.profile, "role", None) == "ADMIN"
            and target_profile.role == "EMPLOYEE"
        )

    @staticmethod
    def _may_grant_privileges(request, target_profile):
        """May this request set role / access flags on `target_profile`?

        Nobody may change their own role, a CEO included, so the org cannot
        be self-locked out of its last admin and a member cannot promote
        themselves. A CEO may set anyone else's role. An administrador may
        set permissions on an empleado only. The view still refuses a new
        role that actor is not allowed to hand out.
        """
        if ceo_account_is_closed(request.profile, target_profile):
            return False
        if request.profile.id == target_profile.id:
            return False
        if can_manage_administrators(request.profile):
            return True
        return (
            getattr(request.profile, "role", None) == "ADMIN"
            and target_profile.role == "EMPLOYEE"
        )

    @extend_schema(
        tags=["users"],
        parameters=swagger_params.organization_params,
        responses={
            200: inline_serializer(
                name="UserDetailResponse",
                fields={
                    "error": serializers.BooleanField(),
                    "data": serializers.DictField(),
                },
            )
        },
    )
    def get(self, request, pk, format=None):
        profile_obj = self.get_object(pk)
        if not self._may_touch(request, profile_obj):
            return Response(
                {"error": True, "errors": "Permission Denied"},
                status=status.HTTP_403_FORBIDDEN,
            )
        # Org check now handled by get_object_or_404 in get_object()
        assigned_data = Profile.objects.filter(
            org=request.profile.org, is_active=True
        ).values("id", "user__email")
        context = {}
        context["profile_obj"] = ProfileSerializer(profile_obj).data
        # Security fix: Add org filter to prevent cross-org data leakage
        opportunity_list = Opportunity.objects.filter(
            assigned_to=profile_obj, org=request.profile.org
        )
        context["opportunity_list"] = OpportunitySerializer(
            opportunity_list, many=True
        ).data
        contacts = Contact.objects.filter(
            assigned_to=profile_obj, org=request.profile.org
        )
        context["contacts"] = ContactSerializer(contacts, many=True).data
        cases = Case.objects.filter(assigned_to=profile_obj, org=request.profile.org)
        context["cases"] = CaseSerializer(
            cases, many=True, context=parent_access_context(request.profile, cases)
        ).data
        context["assigned_data"] = assigned_data
        comments = Comment.objects.filter(
            commented_by=profile_obj, org=request.profile.org
        )
        context["comments"] = CommentSerializer(comments, many=True).data
        context["countries"] = COUNTRIES
        return Response(
            {"error": False, "data": context},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        tags=["users"],
        parameters=swagger_params.organization_params,
        request=UserCreateSwaggerSerializer,
        responses={
            200: inline_serializer(
                name="UserUpdateResponse",
                fields={
                    "error": serializers.BooleanField(),
                    "message": serializers.CharField(),
                },
            )
        },
    )
    def put(self, request, pk, format=None):
        params = request.data
        profile = self.get_object(pk)
        address_obj = profile.address
        if not self._may_touch(request, profile):
            if getattr(request.profile, "role", None) == "ADMIN":
                return _employee_only_refused()
            return Response(
                {"error": True, "errors": "Permission Denied"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if profile.org != request.profile.org:
            return Response(
                {"error": True, "errors": "User company doesnot match with header...."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = CreateUserSerializer(
            data=params,
            instance=profile.user,
            org=request.profile.org,
            editing_self=request.profile.id == profile.id,
        )
        address_serializer = BillingAddressSerializer(data=params, instance=address_obj)
        # Role and the access flags may be set only by an admin editing someone
        # *other* than themselves. A member reaches this path only for their own
        # profile (the guard above lets self through), so this denies them the
        # privileged fields; and an admin cannot flip their own role here either,
        # which keeps them from self-locking the org out of its last admin.
        profile_serializer = CreateProfileSerializer(
            data=params,
            instance=profile,
            can_grant_privileges=self._may_grant_privileges(request, profile),
        )
        data = {}
        if not serializer.is_valid():
            data["contact_errors"] = serializer.errors
        if not address_serializer.is_valid():
            data["address_errors"] = (address_serializer.errors,)
        if not profile_serializer.is_valid():
            data["profile_errors"] = (profile_serializer.errors,)
        if data:
            data["error"] = True
            return Response(
                data,
                status=status.HTTP_400_BAD_REQUEST,
            )
        if profile_serializer.is_valid():
            new_role, new_grants = _planned_role_and_grants(
                profile, profile_serializer.validated_data
            )
            if self._may_grant_privileges(request, profile) and not actor_may_assign_role(
                request.profile, profile, new_role
            ):
                return _employee_only_refused()
            if dropping_last_unrestricted_admin(profile, new_role, new_grants):
                return _last_admin_response()
        if address_serializer.is_valid():
            address_obj = address_serializer.save(org=request.profile.org)
            serializer.save()
        if profile_serializer.is_valid():
            profile = profile_serializer.save()
            return Response(
                {"error": False, "message": "User Updated Successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": True, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @extend_schema(
        tags=["users"],
        parameters=swagger_params.organization_params,
        request=UserCreateSwaggerSerializer,
        description="Partial User Update",
        responses={
            200: inline_serializer(
                name="UserPatchResponse",
                fields={
                    "error": serializers.BooleanField(),
                    "message": serializers.CharField(),
                },
            )
        },
    )
    def patch(self, request, pk, format=None):
        """Handle partial updates to a user."""
        params = request.data
        profile = self.get_object(pk)
        if not self._may_touch(request, profile):
            if getattr(request.profile, "role", None) == "ADMIN":
                return _employee_only_refused()
            return Response(
                {"error": True, "errors": "Permission Denied"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if profile.org != request.profile.org:
            return Response(
                {
                    "error": True,
                    "errors": "User company does not match with header....",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CreateUserSerializer(
            data=params,
            instance=profile.user,
            org=request.profile.org,
            partial=True,
            editing_self=request.profile.id == profile.id,
        )
        profile_serializer = CreateProfileSerializer(
            data=params,
            instance=profile,
            partial=True,
            can_grant_privileges=self._may_grant_privileges(request, profile),
        )
        data = {}
        if not serializer.is_valid():
            data["contact_errors"] = serializer.errors
        if not profile_serializer.is_valid():
            data["profile_errors"] = profile_serializer.errors
        if data:
            data["error"] = True
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if profile_serializer.is_valid():
            new_role, new_grants = _planned_role_and_grants(
                profile, profile_serializer.validated_data
            )
            if self._may_grant_privileges(request, profile) and not actor_may_assign_role(
                request.profile, profile, new_role
            ):
                return _employee_only_refused()
            if dropping_last_unrestricted_admin(profile, new_role, new_grants):
                return _last_admin_response()
        if serializer.is_valid():
            serializer.save()
        if profile_serializer.is_valid():
            profile = profile_serializer.save()
            return Response(
                {"error": False, "message": "User Updated Successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": True, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @extend_schema(
        tags=["users"],
        parameters=swagger_params.organization_params,
        responses={
            200: inline_serializer(
                name="UserDeleteResponse", fields={"status": serializers.CharField()}
            )
        },
    )
    def delete(self, request, pk, format=None):
        if not can_manage_employees(self.request.profile):
            return Response(
                {"error": True, "errors": "Permission Denied"},
                status=status.HTTP_403_FORBIDDEN,
            )
        self.object = self.get_object(pk)
        if self.object.id == request.profile.id:
            return Response(
                {"error": True, "errors": "Permission Denied"},
                status=status.HTTP_403_FORBIDDEN,
            )
        # An administrador removes empleados. Only a CEO removes anyone else.
        if ceo_account_is_closed(request.profile, self.object):
            return _employee_only_refused()
        if (
            not can_manage_administrators(request.profile)
            and self.object.role != "EMPLOYEE"
        ):
            return _employee_only_refused()
        deleted_by = self.request.profile.user.email
        recipient = self.object.user.email
        try:
            self.object.delete()
        except ProtectedError:
            # TimeEntry.profile, Approval.requested_by and Approval.approver all
            # point here with on_delete=PROTECT, so a member who has logged time
            # or touched an approval cannot be removed. Unguarded this was a 500,
            # and the notice below had already gone out by then: the user was
            # told they had been removed from an org they were still in.
            return Response(
                {
                    "error": True,
                    "errors": "This user can't be deleted while they still have "
                    "time entries or approvals linked to them.",
                },
                status=status.HTTP_409_CONFLICT,
            )
        send_email_user_delete.delay(recipient, deleted_by=deleted_by)
        return Response({"status": "success"}, status=status.HTTP_200_OK)


class UserStatusView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    @extend_schema(
        tags=["users"],
        description="User Status View",
        parameters=swagger_params.organization_params,
        request=UserUpdateStatusSwaggerSerializer,
        responses={
            200: inline_serializer(
                name="UserStatusResponse",
                fields={
                    "active_profiles": ProfileSerializer(many=True),
                    "inactive_profiles": ProfileSerializer(many=True),
                },
            )
        },
    )
    def post(self, request, pk, format=None):
        if not can_manage_employees(self.request.profile):
            return Response(
                {
                    "error": True,
                    "errors": "You do not have permission to perform this action",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        params = request.data
        profiles = Profile.objects.filter(org=request.profile.org)
        # Lookup by user ID since frontend sends user.id, not profile.id.
        # get_object_or_404 (a 404), not .get() (a 500), on an unknown id.
        profile = get_object_or_404(profiles, user__id=pk)
        if ceo_account_is_closed(request.profile, profile):
            return Response(
                {
                    "error": True,
                    "errors": "You can only activate or deactivate employees.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if (
            not can_manage_administrators(request.profile)
            and profile.role != "EMPLOYEE"
        ):
            return Response(
                {
                    "error": True,
                    "errors": "You can only activate or deactivate employees.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if params.get("status"):
            user_status = params.get("status")
            if user_status == "Active":
                profile.is_active = True
            elif user_status == "Inactive":
                # Deactivating a profile is one way to strand an org with
                # nobody who has every permission. A CEO counts, and so does
                # a legacy administrator. An administrador limited to a grant
                # list does not: they cannot hand access back.
                if has_unrestricted_admin_access(
                    profile
                ) and not other_unrestricted_admin_exists(profile):
                    return _last_admin_response()
                profile.is_active = False
            else:
                return Response(
                    {"error": True, "errors": "Please enter Valid Status for user"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            profile.save()

        context = {}
        if sees_every_activity_status(request.profile):
            visible_profiles = profiles
            concealed_profiles = profiles.none()
        else:
            visible_profiles = profiles.exclude(role="CEO")
            concealed_profiles = profiles.filter(role="CEO")
        active_profiles = visible_profiles.filter(is_active=True)
        inactive_profiles = visible_profiles.filter(is_active=False)
        context["active_profiles"] = ProfileSerializer(active_profiles, many=True).data
        context["inactive_profiles"] = ProfileSerializer(
            inactive_profiles, many=True
        ).data
        concealed_rows = ProfileSerializer(concealed_profiles, many=True).data
        for row in concealed_rows:
            _conceal_ceo_row(row)
        context["people_without_activity"] = concealed_rows
        return Response(context)
