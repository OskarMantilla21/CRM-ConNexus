"""Refuse API routes a restricted role was not granted.

Sits after ``GetProfileAndOrg``, which is what puts ``request.profile`` on
the request. Members and legacy administrators are not restricted, so this
middleware does not change their requests. An empleado, and an administrador
whose grant list has been saved, are refused everywhere outside that list.
"""

from django.http import JsonResponse

from common.permissions import api_path_allowed, effective_permissions, is_restricted


class RoleAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        profile = getattr(request, "profile", None)
        if is_restricted(profile) and not api_path_allowed(
            request.path, effective_permissions(profile)
        ):
            return JsonResponse(
                {"detail": "You do not have permission to perform this action."},
                status=403,
            )
        return self.get_response(request)
