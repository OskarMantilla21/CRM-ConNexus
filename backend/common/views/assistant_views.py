"""The CEO connects an assistant and asks it about the Today queue.

The key is stored on the org and is never returned. The prompt is the same
queue the CEO already sees, built by ApiTodayView, so another company's rows
are not in it.
"""

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.views import APIView

from common.assistants import (
    AssistantRefused,
    AssistantUnreachable,
    brief,
    complete,
    drop_key,
    key_for,
    known,
    public_list,
    store_key,
)
from common.permissions import HasOrgContext
from common.request_meta import client_ip
from common.screen_assistant import ScreenNotConnected, ask, connected
from common.throttles import FirstRefusalThrottleMixin
from common.views.dashboard_views import ApiTodayView


class ScreenAskUserThrottle(SimpleRateThrottle):
    """Per person. Each question can spend a paid model call."""

    scope = "screen_ask_user"

    def get_cache_key(self, request, view):
        profile = getattr(request, "profile", None)
        ident = getattr(profile, "id", None) or client_ip(request) or "unknown"
        return self.cache_format % {"scope": self.scope, "ident": str(ident)}


class ScreenAskOrgThrottle(SimpleRateThrottle):
    """Per organization, so one company cannot drain the assistant on its own."""

    scope = "screen_ask_org"

    def get_cache_key(self, request, view):
        profile = getattr(request, "profile", None)
        org = getattr(profile, "org", None)
        return self.cache_format % {
            "scope": self.scope,
            "ident": str(getattr(org, "id", None) or "unknown"),
        }


def _ceo_refused(request):
    profile = getattr(request, "profile", None)
    if profile is None or getattr(profile, "role", None) != "CEO":
        return Response({"error": "ceo_only"}, status=403)
    return None


def _clean_key(value):
    if not isinstance(value, str):
        return None
    key = value.strip()
    if len(key) < 8 or len(key) > 512 or any(ord(ch) < 32 for ch in key):
        return None
    return key


class AssistantListView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    def get(self, request):
        refused = _ceo_refused(request)
        if refused:
            return refused
        return Response(public_list(request.profile.org))


class AssistantConnectView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    def post(self, request, provider):
        refused = _ceo_refused(request)
        if refused:
            return refused
        if not known(provider):
            return Response({"error": "unknown"}, status=404)
        api_key = _clean_key((request.data or {}).get("api_key"))
        if api_key is None:
            return Response({"error": "key_refused"}, status=400)
        try:
            complete(provider, api_key, "Reply with the single word OK.")
        except AssistantRefused:
            return Response({"error": "key_refused"}, status=400)
        except AssistantUnreachable:
            return Response({"error": "unreachable"}, status=502)
        store_key(request.profile.org, provider, api_key)
        return Response({"connected": True, "provider": provider})


class AssistantDisconnectView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    def post(self, request, provider):
        refused = _ceo_refused(request)
        if refused:
            return refused
        if not known(provider):
            return Response({"error": "unknown"}, status=404)
        drop_key(request.profile.org, provider)
        return Response(public_list(request.profile.org))


class AssistantAskView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    def post(self, request, provider):
        refused = _ceo_refused(request)
        if refused:
            return refused
        if not known(provider):
            return Response({"error": "unknown"}, status=404)
        api_key = key_for(request.profile.org, provider)
        if not api_key:
            return Response({"error": "not_connected"}, status=400)
        question = (request.data or {}).get("question")
        if not isinstance(question, str):
            question = ""
        question = " ".join(question.split())
        if not question:
            question = "Qué tengo pendiente"
        question = question[:400]
        today = ApiTodayView().get(request).data
        text = brief(today.get("queue") or [], question)
        try:
            answer = complete(provider, api_key, text)
        except AssistantRefused:
            return Response({"error": "key_refused"}, status=400)
        except AssistantUnreachable:
            return Response({"error": "unreachable"}, status=502)
        return Response({"provider": provider, "answer": answer})


class AssistantScreenView(FirstRefusalThrottleMixin, APIView):
    """Ask about the screen already open. Any signed-in member, not only the CEO.

    The list, connect and Today-ask routes stay CEO-only. This one does not
    read CRM records; it comments on the payload, which is the page the caller
    already loaded. GET is the bar's label and is not throttled.
    """

    permission_classes = (IsAuthenticated, HasOrgContext)
    throttle_classes = [ScreenAskUserThrottle, ScreenAskOrgThrottle]

    def get_throttles(self):
        if self.request.method == "GET":
            return []
        return super().get_throttles()

    def get(self, request):
        return Response(connected(request.profile.org))

    def post(self, request):
        payload = request.data if isinstance(request.data, dict) else {}
        question = payload.get("question")
        if not isinstance(question, str) or not question.strip():
            return Response({"error": "empty"}, status=400)
        try:
            provider, answer = ask(
                request.profile.org,
                payload.get("path"),
                question,
                payload.get("screen"),
                request.profile,
            )
        except ScreenNotConnected:
            return Response({"error": "not_connected"}, status=400)
        except AssistantRefused:
            return Response({"error": "key_refused"}, status=400)
        except AssistantUnreachable:
            return Response({"error": "unreachable"}, status=502)
        return Response({"provider": provider, "answer": answer})
