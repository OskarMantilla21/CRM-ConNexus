"""Questions about the screen a person already has open.

Any member may ask. The prompt is the payload they sent, with secrets
removed, and never another organization's data or the stored key.
"""

import json

import pytest
from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APIClient

from common.models import Profile, User
from common.permissions import api_path_allowed
from common.serializer import OrgAwareRefreshToken


@pytest.fixture(autouse=True)
def _fresh_throttle():
    cache.clear()
    yield
    cache.clear()


def _client(user, org, profile):
    client = APIClient()
    token = OrgAwareRefreshToken.for_user_and_org(user, org, profile)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.access_token}")
    return client


def _person(org, email, role, grants=None):
    user = User.objects.create_user(email=email, password="Screen-pass-1708", name=role)
    profile = Profile.objects.create(
        user=user, org=org, role=role, is_active=True, granted_permissions=grants
    )
    return _client(user, org, profile)


@pytest.mark.django_db
def test_a_member_can_ask_about_the_open_screen(org_a, monkeypatch):
    seen = {}

    def _capture(provider, api_key, system, turns, model=None, max_output_tokens=None):
        seen["provider"] = provider
        seen["api_key"] = api_key
        seen["system"] = system
        seen["turns"] = turns
        seen["model"] = model
        return "Hay un prospecto: Panadería Luna."

    monkeypatch.setattr("common.screen_assistant.converse", _capture)
    org_a.assistant_keys = {"gemini": "gemini-secret-SHOULD-NOT-LEAK"}
    org_a.save(update_fields=["assistant_keys"])
    employee = _person(org_a, "empleado.screen@test.com", "EMPLOYEE", ["daily_work"])

    listed = employee.get("/api/assistants/screen/")
    assert listed.status_code == status.HTTP_200_OK
    assert listed.data == {
        "connected": True,
        "provider": "gemini",
        "name": "Gemini",
        "model": "gemini-3.8-flash",
        "models": [{"id": "gemini-3.8-flash", "provider": "gemini", "name": "Gemini"}],
    }
    assert "gemini-secret" not in json.dumps(listed.data)

    answer = employee.post(
        "/api/assistants/screen/",
        {
            "path": "/leads",
            "question": "¿A quién tengo que llamar?",
            "screen": {
                "leads": [{"title": "Panadería Luna", "status": "assigned"}],
                "password": "No-debe-salir",
                "api_key": "gemini-secret-SHOULD-NOT-LEAK",
                "counts": {"leads": 99},
            },
        },
        format="json",
    )
    assert answer.status_code == status.HTTP_200_OK
    assert answer.data["provider"] == "gemini"
    assert answer.data["answer"] == "Hay un prospecto: Panadería Luna."
    content = seen["turns"][0]["content"]
    assert "Panadería Luna" in content
    assert "/leads" in content
    assert "No-debe-salir" not in content
    assert "gemini-secret" not in content
    assert "counts" not in content
    assert "gemini-secret" not in json.dumps(answer.data)
    assert "modelo de lenguaje" in seen["system"]


@pytest.mark.django_db
def test_grok_is_used_when_gemini_is_not_connected(org_a, monkeypatch):
    seen = {}

    def _capture(provider, api_key, system, turns, model=None, max_output_tokens=None):
        seen["provider"] = provider
        return "Nada en esta pantalla."

    monkeypatch.setattr("common.screen_assistant.converse", _capture)
    org_a.assistant_keys = {"grok": "grok-secret-key"}
    org_a.save(update_fields=["assistant_keys"])
    ceo = _person(org_a, "ceo.screen@test.com", "CEO")
    response = ceo.post(
        "/api/assistants/screen/",
        {"path": "/invoices", "question": "¿Qué facturas hay?", "screen": {}},
        format="json",
    )
    assert response.status_code == status.HTTP_200_OK
    assert seen["provider"] == "grok"
    assert response.data["provider"] == "grok"
    assert "grok-secret-key" not in json.dumps(response.data)


@pytest.mark.django_db
def test_a_model_is_used_only_when_that_provider_is_connected(org_a, monkeypatch):
    seen = {}

    def _capture(provider, api_key, system, turns, model=None, max_output_tokens=None):
        seen["provider"] = provider
        seen["model"] = model
        seen["turns"] = turns
        return "Listo."

    monkeypatch.setattr("common.screen_assistant.converse", _capture)
    org_a.assistant_keys = {"gemini": "gemini-secret-SHOULD-NOT-LEAK"}
    org_a.save(update_fields=["assistant_keys"])
    employee = _person(org_a, "empleado.model@test.com", "EMPLOYEE", ["daily_work"])

    refused = employee.post(
        "/api/assistants/screen/",
        {
            "path": "/leads",
            "question": "Resume",
            "model": "gpt-4o",
            "screen": {},
            "attachment": "token=abc gemini-secret-SHOULD-NOT-LEAK\nNotas del cliente",
            "filename": "../notas.md",
        },
        format="json",
    )
    assert refused.status_code == status.HTTP_200_OK
    assert seen["provider"] == "gemini"
    assert seen["model"] == "gemini-3.8-flash"
    content = seen["turns"][0]["content"]
    assert "Notas del cliente" in content
    assert "token=" not in content
    assert "gemini-secret" not in content
    assert "../" not in content

    chosen = employee.post(
        "/api/assistants/screen/",
        {"path": "/leads", "question": "Resume", "model": "gemini-3.8-flash", "screen": {}},
        format="json",
    )
    assert chosen.status_code == status.HTTP_200_OK
    assert seen["model"] == "gemini-3.8-flash"


@pytest.mark.django_db
def test_no_key_does_not_invent_an_answer(org_a, monkeypatch):
    def _refuse(*args, **kwargs):
        raise AssertionError("provider called")

    monkeypatch.setattr("common.screen_assistant.converse", _refuse)
    admin = _person(org_a, "admin.screen@test.com", "ADMIN", ["sell"])
    response = admin.post(
        "/api/assistants/screen/",
        {"path": "/tasks", "question": "¿Qué vence?", "screen": {"tasks": []}},
        format="json",
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {"error": "not_connected"}


@pytest.mark.django_db
def test_an_empty_question_is_refused(org_a):
    org_a.assistant_keys = {"gemini": "gemini-secret-key"}
    org_a.save(update_fields=["assistant_keys"])
    ceo = _person(org_a, "ceo.empty@test.com", "CEO")
    response = ceo.post(
        "/api/assistants/screen/",
        {"question": "   ", "screen": {"leads": [{"title": "Secreto"}]}},
        format="json",
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {"error": "empty"}


def test_the_guide_covers_the_product_and_this_persons_menu():
    from types import SimpleNamespace

    from common.screen_assistant import _GUIDE, _for_person, _prompt

    assert "/tickets/new" in _GUIDE
    assert "/tasks/new" not in _GUIDE
    assert "/invoices" in _GUIDE
    assert "/team" in _GUIDE
    assert "/settings" in _GUIDE
    employee = SimpleNamespace(
        role="EMPLOYEE",
        granted_permissions=["daily_work"],
        user=SimpleNamespace(is_superuser=False),
    )
    menu = _for_person(employee)
    assert "Parte de horas" in menu
    assert "No están en su menú: Vender, Atender, Cobrar, Ajustes, Personas." in menu
    assert "No crea cuentas." in menu
    assert "Nuevo ticket" in _prompt(employee)
    assert "Nueva tarea" not in _prompt(employee)
    ceo = SimpleNamespace(
        role="CEO",
        granted_permissions=None,
        user=SimpleNamespace(is_superuser=False),
    )
    assert "Puede crear administradores y empleados." in _for_person(ceo)
    assert "No están en su menú" not in _for_person(ceo)


def test_howto_questions_use_the_controls_on_the_screen():
    from common.screen_assistant import _SYSTEM

    assert "un clic en un" in _SYSTEM
    assert "modelo de lenguaje" in _SYSTEM


def test_a_long_screen_stays_valid_and_keeps_the_visible_text():
    from common.screen_assistant import _user_text

    leads = []
    for index in range(25):
        leads.append(
            {
                "id": f"id-{index}",
                "title": f"Prospecto {index}",
                "description": "nota " * 80,
                "lead_comments": [{"comment": "comentario interno que no se envía"}],
                "password": "no-sale",
                "assigned_to": "ana@example.com",
            }
        )
    visible = "Panadería Luna está asignada.\nTeléfono 3001112233"
    text = _user_text(
        "/leads",
        "¿A quién llamo?",
        {"leads": leads, "counts": {"leads": 99}, "visible": visible, "terminology": {"x": "y"}},
    )
    blob = text.split("Datos en pantalla:\n", 1)[1].split("\n\nPregunta:", 1)[0]
    parsed = json.loads(blob)
    assert "Prospecto 0" in text
    assert "Panadería Luna está asignada." in text
    assert "3001112233" in text
    assert "comentario interno" not in text
    assert "no-sale" not in text
    assert "counts" not in text
    assert "terminology" not in text
    assert len(blob) <= 6000
    assert isinstance(parsed, dict)


def test_every_restricted_role_may_call_the_screen_route():
    assert api_path_allowed("/api/assistants/screen/", ["daily_work"], role="EMPLOYEE")
    assert not api_path_allowed("/api/assistants/", ["daily_work"], role="EMPLOYEE")
    assert not api_path_allowed(
        "/api/assistants/gemini/ask/", ["daily_work"], role="EMPLOYEE"
    )
