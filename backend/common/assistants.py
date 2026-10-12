"""Calls the assistants a CEO connects. The key never leaves this module's request."""

import json
import urllib.error
import urllib.request

ASSISTANTS = (
    {
        "id": "gemini",
        "name": "Gemini",
        "summary": "Google's assistant. It summarises what needs you today.",
    },
    {
        "id": "grok",
        "name": "Grok",
        "summary": "xAI's assistant. It summarises what needs you today.",
    },
)

_IDS = {item["id"] for item in ASSISTANTS}

_GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-3.8-flash:generateContent"
)
_GROK_URL = "https://api.x.ai/v1/responses"
_TIMEOUT = 40


class AssistantRefused(Exception):
    """The provider rejected the key or the request."""


class AssistantUnreachable(Exception):
    """The provider did not answer."""


def known(provider):
    return provider in _IDS


def connected_ids(org):
    saved = org.assistant_keys if isinstance(org.assistant_keys, dict) else {}
    return {key for key in _IDS if saved.get(key)}


def public_list(org):
    connected = connected_ids(org)
    return {
        "assistants": [
            {**item, "connected": item["id"] in connected} for item in ASSISTANTS
        ]
    }


def store_key(org, provider, api_key):
    saved = dict(org.assistant_keys) if isinstance(org.assistant_keys, dict) else {}
    saved[provider] = api_key
    org.assistant_keys = saved
    org.save(update_fields=["assistant_keys"])


def drop_key(org, provider):
    saved = dict(org.assistant_keys) if isinstance(org.assistant_keys, dict) else {}
    saved.pop(provider, None)
    org.assistant_keys = saved or None
    org.save(update_fields=["assistant_keys"])


def key_for(org, provider):
    saved = org.assistant_keys if isinstance(org.assistant_keys, dict) else {}
    value = saved.get(provider)
    return value if isinstance(value, str) and value else None


def brief(items, question):
    """The only CRM text an assistant receives: the caller's own Today rows."""
    lines = []
    for item in items[:8]:
        title = str(item.get("title") or "").replace("\n", " ")[:180]
        detail = str(item.get("detail") or "").replace("\n", " ")[:180]
        href = str(item.get("href") or "")
        if not href.startswith("/"):
            continue
        lines.append(f"- {title} | {detail} | {href}")
    body = "\n".join(lines) if lines else "(none)"
    return (
        "Items:\n"
        f"{body}\n\n"
        "Question:\n"
        f"{question}"
    )


_SYSTEM = (
    "You help the CEO use one company's CRM. Answer in the same language as "
    "the question, in a short paragraph. Use only the items listed. Do not "
    "invent records, names or amounts. If the list says (none), say that "
    "nothing needs them today."
)


def complete(provider, api_key, user_text):
    """One short completion. Grok is asked not to store the exchange."""
    if provider == "gemini":
        payload = _post(
            _GEMINI_URL,
            {"x-goog-api-key": api_key, "Content-Type": "application/json"},
            {
                "system_instruction": {"parts": [{"text": _SYSTEM}]},
                "contents": [{"parts": [{"text": user_text}]}],
            },
        )
        return _gemini_text(payload)[:4000]
    if provider == "grok":
        payload = _post(
            _GROK_URL,
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            {
                "model": "grok-4.7",
                "store": False,
                "input": [
                    {"role": "system", "content": _SYSTEM},
                    {"role": "user", "content": user_text},
                ],
            },
        )
        return _grok_text(payload)[:4000]
    raise AssistantRefused()


def converse(provider, api_key, system, turns):
    """A short multi-turn reply. `system` stays in this request.

    Used by the public help-center chat. `complete` keeps the CEO's Today
    brief and is not a conversation. Grok is asked not to store the exchange.
    No search tool is attached: the reply may only use the text we send.
    """
    if provider == "gemini":
        payload = _post(
            _GEMINI_URL,
            {"x-goog-api-key": api_key, "Content-Type": "application/json"},
            {
                "system_instruction": {"parts": [{"text": system}]},
                "contents": [
                    {
                        "role": "user" if turn["role"] == "user" else "model",
                        "parts": [{"text": turn["content"]}],
                    }
                    for turn in turns
                ],
            },
        )
        return _gemini_text(payload)[:4000]
    if provider == "grok":
        payload = _post(
            _GROK_URL,
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            {
                "model": "grok-4.7",
                "store": False,
                "input": [
                    {"role": "system", "content": system},
                    *[
                        {
                            "role": "user" if turn["role"] == "user" else "assistant",
                            "content": turn["content"],
                        }
                        for turn in turns
                    ],
                ],
            },
        )
        return _grok_text(payload)[:4000]
    raise AssistantRefused()


def _post(url, headers, body):
    request = urllib.request.Request(
        url, data=json.dumps(body).encode(), method="POST"
    )
    for name, value in headers.items():
        request.add_header(name, value)
    try:
        with urllib.request.urlopen(request, timeout=_TIMEOUT) as response:
            raw = response.read().decode()
    except urllib.error.HTTPError as exc:
        raise AssistantRefused() from exc
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise AssistantUnreachable() from exc
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise AssistantUnreachable() from exc


def _gemini_text(payload):
    try:
        parts = payload["candidates"][0]["content"]["parts"]
        text = parts[0]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise AssistantUnreachable() from exc
    if not isinstance(text, str) or not text.strip():
        raise AssistantUnreachable()
    return text.strip()


def _grok_text(payload):
    direct = payload.get("output_text") if isinstance(payload, dict) else None
    if isinstance(direct, str) and direct.strip():
        return direct.strip()
    chunks = []
    for item in (payload or {}).get("output") or []:
        if not isinstance(item, dict):
            continue
        content = item.get("content")
        if isinstance(content, str):
            chunks.append(content)
        elif isinstance(content, list):
            for part in content:
                if isinstance(part, dict) and isinstance(part.get("text"), str):
                    chunks.append(part["text"])
    text = "\n".join(chunk.strip() for chunk in chunks if chunk.strip())
    if not text:
        raise AssistantUnreachable()
    return text
