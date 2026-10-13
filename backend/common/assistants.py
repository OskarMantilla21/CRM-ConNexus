"""Calls the assistants a CEO connects. The key never leaves this module's request.

Model choice and the output-token cap live beside the key, under ``_config``,
and are the only part of that JSON a response is allowed to describe.
"""

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
    {
        "id": "openai",
        "name": "OpenAI",
        "summary": "OpenAI's assistant. It summarises what needs you today.",
    },
)

_IDS = {item["id"] for item in ASSISTANTS}
_CONFIG = "_config"

# Ids the provider will accept. Anything else is refused before it is stored,
# because the Gemini id is placed in a URL path.
MODEL_CHOICES = {
    "gemini": ("gemini-3.8-flash",),
    "grok": ("grok-4.7",),
    "openai": ("gpt-4.1-mini", "gpt-4o"),
}

TOKEN_MIN = 128
TOKEN_MAX = 4096
TOKEN_DEFAULT = 1024

_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
_GROK_URL = "https://api.x.ai/v1/responses"
_OPENAI_URL = "https://api.openai.com/v1/chat/completions"
_TIMEOUT = 40


class AssistantRefused(Exception):
    """The provider rejected the key or the request."""


class AssistantUnreachable(Exception):
    """The provider did not answer."""


def known(provider):
    return provider in _IDS


def _bag(org):
    raw = getattr(org, "assistant_keys", None)
    return dict(raw) if isinstance(raw, dict) else {}


def _persist(org, saved):
    kept = {}
    for provider in _IDS:
        value = saved.get(provider)
        if isinstance(value, str) and value:
            kept[provider] = value
    config = saved.get(_CONFIG)
    if isinstance(config, dict) and config:
        kept[_CONFIG] = config
    org.assistant_keys = kept or None
    org.save(update_fields=["assistant_keys"])


def read_config(org):
    raw = _bag(org).get(_CONFIG)
    return dict(raw) if isinstance(raw, dict) else {}


def connected_ids(org):
    saved = _bag(org)
    return {key for key in _IDS if isinstance(saved.get(key), str) and saved.get(key)}


def clean_limit(value):
    """An int inside the cap, or None when the caller sent something else."""
    try:
        number = int(value)
    except (TypeError, ValueError):
        return None
    if number < TOKEN_MIN or number > TOKEN_MAX:
        return None
    return number


def provider_runtime(org, provider):
    """The model and token cap this org stored, or the provider default."""
    config = read_config(org)
    models = config.get("models") if isinstance(config.get("models"), dict) else {}
    limits = config.get("limits") if isinstance(config.get("limits"), dict) else {}
    model = models.get(provider)
    if model not in MODEL_CHOICES.get(provider, ()):
        model = MODEL_CHOICES[provider][0]
    limit = clean_limit(limits.get(provider))
    return model, TOKEN_DEFAULT if limit is None else limit


def preferred(org):
    """The connected provider calls should use. The saved default wins."""
    default = read_config(org).get("default_provider")
    if isinstance(default, str) and default in connected_ids(org):
        return default
    for item in ASSISTANTS:
        if item["id"] in connected_ids(org):
            return item["id"]
    return None


def public_list(org):
    """What the settings screen may render. Never a key."""
    connected = connected_ids(org)
    saved_default = read_config(org).get("default_provider")
    if saved_default not in _IDS:
        saved_default = ""
    assistants = []
    for item in ASSISTANTS:
        model, limit = provider_runtime(org, item["id"])
        assistants.append(
            {
                "id": item["id"],
                "name": item["name"],
                "summary": item["summary"],
                "connected": item["id"] in connected,
                "model": model,
                "models": list(MODEL_CHOICES[item["id"]]),
                "max_output_tokens": limit,
            }
        )
    return {
        "default_provider": saved_default,
        "token_limit_min": TOKEN_MIN,
        "token_limit_max": TOKEN_MAX,
        "assistants": assistants,
    }


def store_key(org, provider, api_key):
    saved = _bag(org)
    saved[provider] = api_key
    _persist(org, saved)


def drop_key(org, provider):
    saved = _bag(org)
    saved.pop(provider, None)
    config = saved.get(_CONFIG)
    if isinstance(config, dict) and config.get("default_provider") == provider:
        config = dict(config)
        config.pop("default_provider", None)
        if config:
            saved[_CONFIG] = config
        else:
            saved.pop(_CONFIG, None)
    _persist(org, saved)


def update_provider_settings(org, provider, model=None, limit=None):
    saved = _bag(org)
    config = dict(saved.get(_CONFIG) or {}) if isinstance(saved.get(_CONFIG), dict) else {}
    models = dict(config.get("models") or {}) if isinstance(config.get("models"), dict) else {}
    limits = dict(config.get("limits") or {}) if isinstance(config.get("limits"), dict) else {}
    if model is not None:
        models[provider] = model
    if limit is not None:
        limits[provider] = limit
    config["models"] = models
    config["limits"] = limits
    saved[_CONFIG] = config
    _persist(org, saved)


def set_default_provider(org, provider):
    saved = _bag(org)
    config = dict(saved.get(_CONFIG) or {}) if isinstance(saved.get(_CONFIG), dict) else {}
    if provider:
        config["default_provider"] = provider
    else:
        config.pop("default_provider", None)
    saved[_CONFIG] = config
    _persist(org, saved)


def key_for(org, provider):
    saved = _bag(org)
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


def _model(provider, model):
    choices = MODEL_CHOICES.get(provider) or ()
    if model in choices:
        return model
    return choices[0] if choices else None


def complete(provider, api_key, user_text, model=None, max_output_tokens=None):
    """One short completion. Grok is asked not to store the exchange.

    ``model`` and ``max_output_tokens`` are optional. Callers that omit them
    keep the provider default, which is what the original Today brief used.
    """
    chosen = _model(provider, model)
    if provider == "gemini":
        body = {
            "system_instruction": {"parts": [{"text": _SYSTEM}]},
            "contents": [{"parts": [{"text": user_text}]}],
        }
        if max_output_tokens is not None:
            body["generationConfig"] = {"maxOutputTokens": int(max_output_tokens)}
        payload = _post(
            _GEMINI_URL.format(model=chosen),
            {"x-goog-api-key": api_key, "Content-Type": "application/json"},
            body,
        )
        return _gemini_text(payload)[:4000]
    if provider == "grok":
        body = {
            "model": chosen,
            "store": False,
            "input": [
                {"role": "system", "content": _SYSTEM},
                {"role": "user", "content": user_text},
            ],
        }
        if max_output_tokens is not None:
            body["max_output_tokens"] = int(max_output_tokens)
        payload = _post(
            _GROK_URL,
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            body,
        )
        return _grok_text(payload)[:4000]
    if provider == "openai":
        body = {
            "model": chosen,
            "messages": [
                {"role": "system", "content": _SYSTEM},
                {"role": "user", "content": user_text},
            ],
        }
        if max_output_tokens is not None:
            body["max_tokens"] = int(max_output_tokens)
        payload = _post(
            _OPENAI_URL,
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            body,
        )
        return _openai_text(payload)[:4000]
    raise AssistantRefused()


def converse(provider, api_key, system, turns, model=None, max_output_tokens=None):
    """A short multi-turn reply. `system` stays in this request.

    Used by the public help-center chat. `complete` keeps the CEO's Today
    brief and is not a conversation. Grok is asked not to store the exchange.
    No search tool is attached: the reply may only use the text we send.
    """
    chosen = _model(provider, model)
    if provider == "gemini":
        body = {
            "system_instruction": {"parts": [{"text": system}]},
            "contents": [
                {
                    "role": "user" if turn["role"] == "user" else "model",
                    "parts": [{"text": turn["content"]}],
                }
                for turn in turns
            ],
        }
        if max_output_tokens is not None:
            body["generationConfig"] = {"maxOutputTokens": int(max_output_tokens)}
        payload = _post(
            _GEMINI_URL.format(model=chosen),
            {"x-goog-api-key": api_key, "Content-Type": "application/json"},
            body,
        )
        return _gemini_text(payload)[:4000]
    if provider == "grok":
        body = {
            "model": chosen,
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
        }
        if max_output_tokens is not None:
            body["max_output_tokens"] = int(max_output_tokens)
        payload = _post(
            _GROK_URL,
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            body,
        )
        return _grok_text(payload)[:4000]
    if provider == "openai":
        body = {
            "model": chosen,
            "messages": [
                {"role": "system", "content": system},
                *[
                    {
                        "role": "user" if turn["role"] == "user" else "assistant",
                        "content": turn["content"],
                    }
                    for turn in turns
                ],
            ],
        }
        if max_output_tokens is not None:
            body["max_tokens"] = int(max_output_tokens)
        payload = _post(
            _OPENAI_URL,
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            body,
        )
        return _openai_text(payload)[:4000]
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


def _openai_text(payload):
    try:
        text = payload["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise AssistantUnreachable() from exc
    if not isinstance(text, str) or not text.strip():
        raise AssistantUnreachable()
    return text.strip()
