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
    MODEL_CHOICES,
    AssistantRefused,
    AssistantUnreachable,
    brief,
    clean_limit,
    complete,
    drop_key,
    key_for,
    known,
    provider_runtime,
    public_list,
    set_default_provider,
    store_key,
    update_provider_settings,
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


def _optional_runtime(provider, data):
    """Model and token cap when the body names them. ``invalid`` is a bad value."""
    model = None
    if "model" in data and data.get("model") not in (None, ""):
        model = data.get("model")
        if model not in MODEL_CHOICES.get(provider, ()):
            return None, None, True
    limit = None
    if "max_output_tokens" in data and data.get("max_output_tokens") not in (None, ""):
        limit = clean_limit(data.get("max_output_tokens"))
        if limit is None:
            return None, None, True
    return model, limit, False


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
        data = request.data if isinstance(request.data, dict) else {}
        api_key = _clean_key(data.get("api_key"))
        if api_key is None:
            return Response({"error": "key_refused"}, status=400)
        model, limit, invalid = _optional_runtime(provider, data)
        if invalid:
            return Response({"error": "invalid"}, status=400)
        org = request.profile.org
        use_model, use_limit = provider_runtime(org, provider)
        if model is not None:
            use_model = model
        if limit is not None:
            use_limit = limit
        try:
            complete(provider, api_key, "Reply with the single word OK.", use_model, use_limit)
        except AssistantRefused:
            return Response({"error": "key_refused"}, status=400)
        except AssistantUnreachable:
            return Response({"error": "unreachable"}, status=502)
        store_key(org, provider, api_key)
        if model is not None or limit is not None:
            org.refresh_from_db()
            update_provider_settings(org, provider, model=model, limit=limit)
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


class AssistantTestView(APIView):
    """Prove a key against the provider without storing it.

    A pasted key is tested as-is. An empty body retests the key already stored.
    """

    permission_classes = (IsAuthenticated, HasOrgContext)

    def post(self, request, provider):
        refused = _ceo_refused(request)
        if refused:
            return refused
        if not known(provider):
            return Response({"error": "unknown"}, status=404)
        data = request.data if isinstance(request.data, dict) else {}
        org = request.profile.org
        if data.get("api_key"):
            api_key = _clean_key(data.get("api_key"))
            if api_key is None:
                return Response({"error": "key_refused"}, status=400)
        else:
            api_key = key_for(org, provider)
            if not api_key:
                return Response({"error": "not_connected"}, status=400)
        model, limit, invalid = _optional_runtime(provider, data)
        if invalid:
            return Response({"error": "invalid"}, status=400)
        use_model, use_limit = provider_runtime(org, provider)
        if model is not None:
            use_model = model
        if limit is not None:
            use_limit = limit
        try:
            complete(provider, api_key, "Reply with the single word OK.", use_model, use_limit)
        except AssistantRefused:
            return Response({"error": "key_refused"}, status=400)
        except AssistantUnreachable:
            return Response({"error": "unreachable"}, status=502)
        return Response({"ok": True, "provider": provider})


class AssistantSettingsView(APIView):
    """Default provider, model and token cap. Keys are not accepted here."""

    permission_classes = (IsAuthenticated, HasOrgContext)

    def post(self, request):
        refused = _ceo_refused(request)
        if refused:
            return refused
        data = request.data if isinstance(request.data, dict) else {}
        org = request.profile.org
        default_change = None
        if "default_provider" in data:
            default = data.get("default_provider") or ""
            if default and (not known(default) or not key_for(org, default)):
                return Response({"error": "invalid"}, status=400)
            default_change = default
        updates = []
        providers = data.get("providers")
        if providers is not None:
            if not isinstance(providers, dict):
                return Response({"error": "invalid"}, status=400)
            for provider, row in providers.items():
                if not known(provider) or not isinstance(row, dict):
                    return Response({"error": "invalid"}, status=400)
                model, limit, invalid = _optional_runtime(provider, row)
                if invalid:
                    return Response({"error": "invalid"}, status=400)
                if "model" in row or "max_output_tokens" in row:
                    updates.append((provider, model, limit))
        if default_change is not None:
            set_default_provider(org, default_change)
            org.refresh_from_db()
        for provider, model, limit in updates:
            update_provider_settings(org, provider, model=model, limit=limit)
            org.refresh_from_db()
        return Response(public_list(org))


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
        model, limit = provider_runtime(request.profile.org, provider)
        try:
            answer = complete(provider, api_key, text, model, limit)
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
        model = payload.get("model")
        attachment = payload.get("attachment")
        filename = payload.get("filename")
        try:
            provider, answer = ask(
                request.profile.org,
                payload.get("path"),
                question,
                payload.get("screen"),
                request.profile,
                model=model if isinstance(model, str) else None,
                attachment=attachment if isinstance(attachment, str) else None,
                filename=filename if isinstance(filename, str) else None,
            )
        except ScreenNotConnected:
            return Response({"error": "not_connected"}, status=400)
        except AssistantRefused:
            return Response({"error": "key_refused"}, status=400)
        except AssistantUnreachable:
            return Response({"error": "unreachable"}, status=502)
        return Response({"provider": provider, "answer": answer})
