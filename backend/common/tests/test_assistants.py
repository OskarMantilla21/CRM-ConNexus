"""The CEO connects Gemini or Grok and asks about the Today queue.

A key is stored on the org and is never returned. Another role, and another
org, cannot read it.
"""

import json

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from common.assistants import AssistantRefused, complete
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
    assert ids == ["gemini", "grok", "openai"]
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

    monkeypatch.setattr("common.assistants.urllib.request.urlopen", _open)
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
