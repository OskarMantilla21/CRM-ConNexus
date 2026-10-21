"""The CEO connects Gemini or Grok and asks about the Today queue.

A key is stored on the org and is never returned. Another role, and another
org, cannot read it.
"""

import json

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from common.assistants import AssistantRefused, AssistantUnreachable, complete
from common.models import Profile, User
from common.serializer import OrgAwareRefreshToken


def _client(user, org, profile):
    client = APIClient()
    token = OrgAwareRefreshToken.for_user_and_org(user, org, profile)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.access_token}")
    return client


def _person(org, email, role):
    user = User.objects.create_user(email=email, password="Ceo-pass-1708", name=role)
    profile = Profile.objects.create(user=user, org=org, role=role, is_active=True)
    return _client(user, org, profile)


@pytest.mark.django_db
def test_only_the_ceo_sees_the_list(org_a):
    ceo = _person(org_a, "ceo.assist@test.com", "CEO")
    admin = _person(org_a, "admin.assist@test.com", "ADMIN")

    listed = ceo.get("/api/assistants/")
    assert listed.status_code == status.HTTP_200_OK
    ids = [item["id"] for item in listed.data["assistants"]]
    assert ids == ["gemini", "grok", "openai", "groq", "custom"]
    assert all(item["connected"] is False for item in listed.data["assistants"])
    assert "assistant_keys" not in listed.data
    assert "api_key" not in json.dumps(listed.data)

    assert admin.get("/api/assistants/").status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_connect_stores_the_key_and_does_not_return_it(org_a, org_b, monkeypatch):
    monkeypatch.setattr("common.views.assistant_views.complete", lambda *args: "OK")
    ceo = _person(org_a, "ceo.connect@test.com", "CEO")
    other = _person(org_b, "ceo.other@test.com", "CEO")
    secret = "gemini-secret-key"

    connected = ceo.post(
        "/api/assistants/gemini/connect/",
        {"api_key": secret},
        format="json",
    )
    assert connected.status_code == status.HTTP_200_OK
    assert secret not in json.dumps(connected.data)

    listed = ceo.get("/api/assistants/")
    gemini = next(item for item in listed.data["assistants"] if item["id"] == "gemini")
    assert gemini["connected"] is True
    assert secret not in json.dumps(listed.data)

    org_a.refresh_from_db()
    assert org_a.assistant_keys["gemini"] == secret

    settings = ceo.get("/api/org/settings/")
    assert secret not in json.dumps(settings.data)
    assert "assistant_keys" not in settings.data

    other_list = other.get("/api/assistants/")
    assert all(item["connected"] is False for item in other_list.data["assistants"])
    org_b.refresh_from_db()
    assert not org_b.assistant_keys


@pytest.mark.django_db
def test_a_refused_key_is_not_stored(org_a, monkeypatch):
    def _refuse(*args):
        raise AssistantRefused()

    monkeypatch.setattr("common.views.assistant_views.complete", _refuse)
    ceo = _person(org_a, "ceo.refuse@test.com", "CEO")
    refused = ceo.post(
        "/api/assistants/grok/connect/",
        {"api_key": "not-a-real-key"},
        format="json",
    )
    assert refused.status_code == status.HTTP_400_BAD_REQUEST
    assert refused.data["error"] == "key_refused"
    org_a.refresh_from_db()
    assert not org_a.assistant_keys


@pytest.mark.django_db
def test_ask_sends_the_today_list_and_not_the_key(org_a, monkeypatch):
    seen = {}

    def _capture(provider, api_key, user_text, model=None, max_output_tokens=None):
        seen["provider"] = provider
        seen["api_key"] = api_key
        seen["user_text"] = user_text
        return "Nada pendiente."

    monkeypatch.setattr("common.views.assistant_views.complete", _capture)
    ceo = _person(org_a, "ceo.ask@test.com", "CEO")
    org_a.assistant_keys = {"grok": "grok-secret-key"}
    org_a.save(update_fields=["assistant_keys"])

    empty = ceo.post(
        "/api/assistants/gemini/ask/",
        {"question": "Qué tengo pendiente"},
        format="json",
    )
    assert empty.status_code == status.HTTP_400_BAD_REQUEST
    assert empty.data["error"] == "not_connected"

    answer = ceo.post(
        "/api/assistants/grok/ask/",
        {"question": "Qué tengo pendiente"},
        format="json",
    )
    assert answer.status_code == status.HTTP_200_OK
    assert answer.data["answer"] == "Nada pendiente."
    assert "grok-secret-key" not in json.dumps(answer.data)
    assert seen["provider"] == "grok"
    assert seen["api_key"] == "grok-secret-key"
    assert "Qué tengo pendiente" in seen["user_text"]
    assert "grok-secret-key" not in seen["user_text"]


def test_grok_request_does_not_store_the_exchange(monkeypatch):
    captured = {}

    class _Body:
        def read(self):
            return json.dumps(
                {"output": [{"content": [{"type": "output_text", "text": "OK"}]}]}
            ).encode()

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    def _open(request, timeout=0):
        captured["url"] = request.full_url
        captured["auth"] = request.get_header("Authorization")
        captured["body"] = json.loads(request.data.decode())
        return _Body()

    monkeypatch.setattr("common.assistants._send", _open)
    text = complete("grok", "grok-secret-key", "Reply with the single word OK.")
    assert text == "OK"
    assert captured["url"] == "https://api.x.ai/v1/responses"
    assert captured["auth"] == "Bearer grok-secret-key"
    assert captured["body"]["store"] is False
    assert captured["body"]["model"] == "grok-4.7"


@pytest.mark.django_db
def test_settings_and_a_connection_test_never_return_the_key(org_a, monkeypatch):
    monkeypatch.setattr("common.views.assistant_views.complete", lambda *args, **kwargs: "OK")
    ceo = _person(org_a, "ceo.settings@test.com", "CEO")
    secret = "openai-secret-key"

    tested = ceo.post(
        "/api/assistants/openai/test/",
        {"api_key": secret, "model": "gpt-4o", "max_output_tokens": 256},
        format="json",
    )
    assert tested.status_code == status.HTTP_200_OK
    assert tested.data["ok"] is True
    assert secret not in json.dumps(tested.data)
    org_a.refresh_from_db()
    assert not org_a.assistant_keys

    connected = ceo.post(
        "/api/assistants/openai/connect/",
        {"api_key": secret, "model": "gpt-4o", "max_output_tokens": 256},
        format="json",
    )
    assert connected.status_code == status.HTTP_200_OK
    assert secret not in json.dumps(connected.data)

    saved = ceo.post(
        "/api/assistants/settings/",
        {"default_provider": "openai", "providers": {"openai": {"model": "gpt-4.1-mini"}}},
        format="json",
    )
    assert saved.status_code == status.HTTP_200_OK
    assert saved.data["default_provider"] == "openai"
    openai = next(item for item in saved.data["assistants"] if item["id"] == "openai")
    assert openai["model"] == "gpt-4.1-mini"
    assert openai["max_output_tokens"] == 256
    assert secret not in json.dumps(saved.data)
    assert "assistant_keys" not in saved.data

    refused = ceo.post(
        "/api/assistants/settings/",
        {"providers": {"openai": {"model": "not-a-model"}}},
        format="json",
    )
    assert refused.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.parametrize(
    "raw",
    [
        "http://api.example.com/v1",
        "https://localhost/v1",
        "https://127.0.0.1/v1",
        "https://10.1.2.3/v1",
        "https://db/v1",
        "https://user:pass@api.example.com/v1",
        "https://api.example.com/v1?token=1",
        "file:///etc/passwd",
    ],
)
def test_a_custom_address_must_be_public_https(raw):
    from common.assistants import clean_base_url

    assert clean_base_url(raw) is None


def test_a_custom_address_keeps_the_api_base():
    from common.assistants import clean_base_url

    assert (
        clean_base_url("https://api.example.com/v1/chat/completions")
        == "https://api.example.com/v1"
    )
    assert clean_base_url("https://api.deepseek.com") == "https://api.deepseek.com"


def test_custom_call_posts_chat_completions(monkeypatch):
    import socket

    captured = {}

    class _Body:
        def read(self):
            return json.dumps(
                {"choices": [{"message": {"content": "OK"}}]}
            ).encode()

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    def _lookup(host, port, *args, **kwargs):
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("8.8.8.8", 0))]

    def _open(request, timeout=0):
        captured["url"] = request.full_url
        captured["auth"] = request.get_header("Authorization")
        captured["body"] = json.loads(request.data.decode())
        return _Body()

    monkeypatch.setattr("common.assistants.socket.getaddrinfo", _lookup)
    monkeypatch.setattr("common.assistants._send", _open)
    text = complete(
        "custom",
        "custom-secret-key",
        "Reply with the single word OK.",
        model="deepseek-chat",
        base_url="https://api.example.com/v1",
    )
    assert text == "OK"
    assert captured["url"] == "https://api.example.com/v1/chat/completions"
    assert captured["auth"] == "Bearer custom-secret-key"
    assert captured["body"]["model"] == "deepseek-chat"
    assert "custom-secret-key" not in captured["body"]["messages"][1]["content"]


def test_custom_call_refuses_a_host_that_resolves_privately(monkeypatch):
    import socket

    def _lookup(host, port, *args, **kwargs):
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("10.0.0.1", 0))]

    monkeypatch.setattr("common.assistants.socket.getaddrinfo", _lookup)
    with pytest.raises(AssistantRefused):
        complete(
            "custom",
            "custom-secret-key",
            "Reply with the single word OK.",
            model="deepseek-chat",
            base_url="https://evil.example/v1",
        )


@pytest.mark.django_db
def test_the_ceo_connects_any_openai_compatible_assistant(org_a, org_b, monkeypatch):
    monkeypatch.setattr(
        "common.views.assistant_views.complete", lambda *args, **kwargs: "OK"
    )
    ceo = _person(org_a, "ceo.custom@test.com", "CEO")
    other = _person(org_b, "ceo.custom.other@test.com", "CEO")
    secret = "custom-secret-key"
    body = {
        "api_key": secret,
        "name": "DeepSeek",
        "base_url": "https://api.deepseek.com/v1",
        "model": "deepseek-chat",
        "max_output_tokens": 256,
    }

    refused = ceo.post(
        "/api/assistants/custom/connect/",
        {**body, "base_url": "http://api.deepseek.com/v1"},
        format="json",
    )
    assert refused.status_code == status.HTTP_400_BAD_REQUEST
    assert refused.data["error"] == "address"
    org_a.refresh_from_db()
    assert not org_a.assistant_keys

    connected = ceo.post("/api/assistants/custom/connect/", body, format="json")
    assert connected.status_code == status.HTTP_200_OK
    assert secret not in json.dumps(connected.data)

    listed = ceo.get("/api/assistants/")
    custom = next(item for item in listed.data["assistants"] if item["id"] == "custom")
    assert custom["connected"] is True
    assert custom["name"] == "DeepSeek"
    assert custom["label"] == "DeepSeek"
    assert custom["base_url"] == "https://api.deepseek.com/v1"
    assert custom["model"] == "deepseek-chat"
    assert secret not in json.dumps(listed.data)

    org_a.refresh_from_db()
    assert org_a.assistant_keys["custom"] == secret
    assert org_a.assistant_keys["_config"]["custom"]["name"] == "DeepSeek"

    other_list = other.get("/api/assistants/")
    other_custom = next(
        item for item in other_list.data["assistants"] if item["id"] == "custom"
    )
    assert other_custom["connected"] is False
    org_b.refresh_from_db()
    assert not org_b.assistant_keys


def test_a_key_prefix_names_the_provider():
    from common.assistants import identify_key, providers_for_key

    assert identify_key("xai-abc12345") == "grok"
    assert identify_key("AIzaSyabc123") == "gemini"
    assert identify_key("sk-ant-abc12345") == "anthropic"
    assert identify_key("sk-or-abc12345") == "openrouter"
    assert identify_key("gsk_abc12345") == "groq"
    assert identify_key("sk-proj-abc12345") == "openai"
    assert identify_key("sk-svcacct-abc12") == "openai"
    assert identify_key("sk-admin-abc123") == "openai"
    assert identify_key("sk-abc12345") == "openai"
    assert identify_key("opaque-secret") is None
    assert providers_for_key("sk-abc12345") == ["openai", "deepseek"]
    assert providers_for_key("sk-proj-abc12345") == ["openai"]
    assert providers_for_key("sk-ant-abc12345") == ["anthropic"]
    assert providers_for_key("opaque-secret") == []


def _json_body(payload):
    class _Body:
        def read(self):
            return json.dumps(payload).encode()

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    return _Body()


def test_groq_and_claude_use_their_own_addresses(monkeypatch):
    captured = {}

    def _open(request, timeout=0):
        captured["url"] = request.full_url
        captured["auth"] = request.get_header("Authorization")
        captured["api_key"] = request.get_header("X-api-key")
        captured["body"] = json.loads(request.data.decode())
        return _json_body(
            {
                "choices": [{"message": {"content": "OK"}}],
                "content": [{"type": "text", "text": "OK"}],
            }
        )

    def _lookup(host, port, *args, **kwargs):
        import socket

        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("8.8.8.8", 0))]

    monkeypatch.setattr("common.assistants.socket.getaddrinfo", _lookup)
    monkeypatch.setattr("common.assistants._send", _open)
    assert complete("groq", "gsk_secretkey", "Hi") == "OK"
    assert captured["url"] == "https://api.groq.com/openai/v1/chat/completions"
    assert captured["auth"] == "Bearer gsk_secretkey"
    assert captured["body"]["model"] == "openai/gpt-oss-120b"
    assert "gsk_secretkey" not in json.dumps(captured["body"])

    assert complete("anthropic", "sk-ant-secret", "Hi", model="claude-from-list") == "OK"
    assert captured["url"] == "https://api.anthropic.com/v1/messages"
    assert captured["api_key"] == "sk-ant-secret"
    assert captured["body"]["model"] == "claude-from-list"
    assert "sk-ant-secret" not in json.dumps(captured["body"])


def test_claude_model_comes_from_the_models_list(monkeypatch):
    from common.assistants import anthropic_model

    def _open(request, timeout=0):
        assert request.full_url.startswith("https://api.anthropic.com/v1/models")
        assert request.get_header("X-api-key") == "sk-ant-secret"
        return _json_body({"data": [{"id": "claude-from-list"}]})

    monkeypatch.setattr("common.assistants._send", _open)
    assert anthropic_model("sk-ant-secret") == "claude-from-list"


@pytest.mark.django_db
def test_pasting_a_key_connects_the_assistant_it_names(org_a, org_b, monkeypatch):
    calls = []

    def _complete(provider, api_key, *args, **kwargs):
        calls.append(provider)
        plain = api_key.startswith("sk-") and not api_key.startswith(
            ("sk-proj-", "sk-svcacct-", "sk-admin-", "sk-ant-", "sk-or-")
        )
        if provider == "openai" and plain:
            raise AssistantRefused()
        return "OK"

    monkeypatch.setattr("common.views.assistant_views.complete", _complete)
    monkeypatch.setattr(
        "common.views.assistant_views.anthropic_model",
        lambda api_key: "claude-from-list",
    )
    ceo = _person(org_a, "ceo.fromkey@test.com", "CEO")
    member = _person(org_a, "user.fromkey@test.com", "USER")
    other = _person(org_b, "ceo.fromkey.other@test.com", "CEO")

    denied = member.post(
        "/api/assistants/from-key/",
        {"api_key": "xai-secret-key"},
        format="json",
    )
    assert denied.status_code == status.HTTP_403_FORBIDDEN

    unknown = ceo.post(
        "/api/assistants/from-key/",
        {"api_key": "opaque-secret-key"},
        format="json",
    )
    assert unknown.status_code == status.HTTP_400_BAD_REQUEST
    assert unknown.data == {"error": "unknown_ai"}
    assert calls == []
    org_a.refresh_from_db()
    assert not org_a.assistant_keys

    grok = ceo.post(
        "/api/assistants/from-key/",
        {"api_key": "xai-secret-key"},
        format="json",
    )
    assert grok.status_code == status.HTTP_200_OK
    assert grok.data["provider"] == "grok"
    assert grok.data["name"] == "Grok"
    assert "xai-secret-key" not in json.dumps(grok.data)
    org_a.refresh_from_db()
    assert org_a.assistant_keys["grok"] == "xai-secret-key"
    assert org_a.assistant_keys["_config"]["default_provider"] == "grok"

    gemini = ceo.post(
        "/api/assistants/from-key/",
        {"api_key": "AIzaSy-secret-key"},
        format="json",
    )
    assert gemini.data["provider"] == "gemini"
    openai = ceo.post(
        "/api/assistants/from-key/",
        {"api_key": "sk-proj-secret-key"},
        format="json",
    )
    assert openai.data["provider"] == "openai"
    assert calls[-1] == "openai"

    before = len(calls)
    deepseek = ceo.post(
        "/api/assistants/from-key/",
        {"api_key": "sk-legacy-secret"},
        format="json",
    )
    assert deepseek.data["provider"] == "deepseek"
    assert calls[before:] == ["openai", "deepseek"]
    org_a.refresh_from_db()
    assert org_a.assistant_keys["deepseek"] == "sk-legacy-secret"
    assert "openai" not in org_a.assistant_keys or org_a.assistant_keys["openai"] == "sk-proj-secret-key"

    claude = ceo.post(
        "/api/assistants/from-key/",
        {"api_key": "sk-ant-secret-key"},
        format="json",
    )
    assert claude.status_code == status.HTTP_200_OK
    assert claude.data["provider"] == "anthropic"
    assert claude.data["name"] == "Claude"
    assert "sk-ant-secret-key" not in json.dumps(claude.data)
    assert calls[-1] == "anthropic"
    org_a.refresh_from_db()
    assert org_a.assistant_keys["anthropic"] == "sk-ant-secret-key"
    assert org_a.assistant_keys["_config"]["models"]["anthropic"] == "claude-from-list"
    assert org_a.assistant_keys["_config"]["default_provider"] == "anthropic"

    listed = ceo.get("/api/assistants/")
    ids = [item["id"] for item in listed.data["assistants"]]
    assert ids == ["gemini", "grok", "openai", "groq", "custom"]
    using = {item["id"] for item in listed.data["using"]}
    assert {"grok", "gemini", "openai", "deepseek", "anthropic"} <= using
    blob = json.dumps(listed.data)
    for secret in (
        "xai-secret-key",
        "AIzaSy-secret-key",
        "sk-proj-secret-key",
        "sk-legacy-secret",
        "sk-ant-secret-key",
    ):
        assert secret not in blob

    other_list = other.get("/api/assistants/")
    assert other_list.data["using"] == []
    org_b.refresh_from_db()
    assert not org_b.assistant_keys


@pytest.mark.django_db
def test_a_network_failure_does_not_try_another_provider(org_a, monkeypatch):
    calls = []

    def _complete(provider, *args, **kwargs):
        calls.append(provider)
        raise AssistantUnreachable()

    monkeypatch.setattr("common.views.assistant_views.complete", _complete)
    ceo = _person(org_a, "ceo.unreachable@test.com", "CEO")
    response = ceo.post(
        "/api/assistants/from-key/",
        {"api_key": "sk-legacy-secret"},
        format="json",
    )
    assert response.status_code == status.HTTP_502_BAD_GATEWAY
    assert response.data == {"error": "unreachable"}
    assert calls == ["openai"]
    org_a.refresh_from_db()
    assert not org_a.assistant_keys
