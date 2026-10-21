"""Calls the assistants a CEO connects. The key never leaves this module's request.

Model choice and the output-token cap live beside the key, under ``_config``,
and are the only part of that JSON a response is allowed to describe.
"""

import ipaddress
import json
import re
import socket
import urllib.error
import urllib.parse
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
    {
        "id": "groq",
        "name": "Groq",
        "summary": "Groq's assistant. Paste the API key from the Groq console.",
    },
    {
        "id": "custom",
        "name": "Other AI",
        "summary": (
            "Any assistant with an OpenAI-compatible chat API. "
            "Paste its https address, the model name and the key."
        ),
    },
    {
        "id": "openrouter",
        "name": "OpenRouter",
        "summary": "OpenRouter. Connected from the account page by its key.",
        "listed": False,
    },
    {
        "id": "deepseek",
        "name": "DeepSeek",
        "summary": "DeepSeek. Connected from the account page by its key.",
        "listed": False,
    },
    {
        "id": "anthropic",
        "name": "Claude",
        "summary": "Anthropic Claude. Connected from the account page by its key.",
        "listed": False,
    },
)

# Prefixes that name the provider. Longer prefixes come first so sk-ant-
# is Claude and not a generic sk- key. A plain sk- key is also how DeepSeek
# marks a key, so that one case is tried twice by providers_for_key.
_KEY_RULES = (
    ("xai-", "grok"),
    ("AIza", "gemini"),
    ("sk-ant-", "anthropic"),
    ("sk-or-", "openrouter"),
    ("gsk_", "groq"),
    ("sk-proj-", "openai"),
    ("sk-svcacct-", "openai"),
    ("sk-admin-", "openai"),
    ("sk-", "openai"),
)
_OPENAI_ONLY = ("sk-proj-", "sk-svcacct-", "sk-admin-")
_FIXED_CHAT = {
    "groq": "https://api.groq.com/openai/v1",
    "openrouter": "https://openrouter.ai/api/v1",
    "deepseek": "https://api.deepseek.com",
}
_DISCOVERED = {"anthropic"}
_ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
_ANTHROPIC_MODELS = "https://api.anthropic.com/v1/models?limit=1"

CUSTOM_ID = "custom"
_MODEL_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.:/-]{0,79}$")
_URL_PATH_RE = re.compile(r"(?:/[A-Za-z0-9._~-]+)+")

_IDS = {item["id"] for item in ASSISTANTS}
_CONFIG = "_config"

# Ids the provider will accept. Anything else is refused before it is stored,
# because the Gemini id is placed in a URL path.
MODEL_CHOICES = {
    "gemini": ("gemini-3.8-flash",),
    "grok": ("grok-4.7",),
    "openai": ("gpt-4.1-mini", "gpt-4o"),
    "groq": ("openai/gpt-oss-120b", "openai/gpt-oss-20b"),
    "openrouter": ("openrouter/auto",),
    "deepseek": ("deepseek-chat",),
    "anthropic": ("claude",),
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


def identify_key(api_key):
    """The provider a key belongs to, or None when the prefix does not say."""
    if not isinstance(api_key, str):
        return None
    key = api_key.strip()
    for prefix, provider in _KEY_RULES:
        if key.startswith(prefix):
            return provider
    return None


def providers_for_key(api_key):
    """Providers to try, in order. A plain sk- key may be OpenAI or DeepSeek."""
    provider = identify_key(api_key)
    if provider is None:
        return []
    key = api_key.strip()
    if provider == "openai" and not key.startswith(_OPENAI_ONLY):
        return ["openai", "deepseek"]
    return [provider]


def clean_model_name(value):
    """A model id safe to send in a JSON body, or None."""
    if not isinstance(value, str) or not _MODEL_RE.fullmatch(value.strip()):
        return None
    return value.strip()


def clean_display_name(value):
    """The name shown for a custom assistant, or None."""
    if not isinstance(value, str):
        return None
    name = " ".join(value.split())
    if not name or len(name) > 40 or any(ord(ch) < 32 for ch in name):
        return None
    return name


def clean_base_url(value):
    """An https chat-API address, or None.

    The host has to be a public name. Addresses, localhost and single-label
    names are refused here so a saved key is never posted at the CRM's own
    network. The call checks again that the name resolves to a public address.
    """
    if not isinstance(value, str):
        return None
    raw = value.strip()
    if not raw or len(raw) > 200 or any(ord(ch) < 32 for ch in raw):
        return None
    try:
        parsed = urllib.parse.urlparse(raw)
        host = (parsed.hostname or "").lower().rstrip(".")
        port = parsed.port
    except ValueError:
        return None
    if (
        parsed.scheme != "https"
        or parsed.username
        or parsed.password
        or parsed.query
        or parsed.fragment
        or not host
        or ".." in host
    ):
        return None
    try:
        ipaddress.ip_address(host)
        return None
    except ValueError:
        pass
    if (
        "." not in host
        or host in {"localhost", "metadata.google.internal"}
        or host.endswith((".local", ".internal", ".localhost"))
    ):
        return None
    path = (parsed.path or "").rstrip("/")
    if path.endswith("/chat/completions"):
        path = path[: -len("/chat/completions")]
    if path and _URL_PATH_RE.fullmatch(path) is None:
        return None
    if port is not None and not 1 <= port <= 65535:
        return None
    netloc = host if port in (None, 443) else f"{host}:{port}"
    return f"https://{netloc}{path}"


def chat_completions_url(base):
    return base.rstrip("/") + "/chat/completions"


def _require_public_host(url):
    """Refuse a host that resolves to a private or local address."""
    host = urllib.parse.urlparse(url).hostname
    if not host:
        raise AssistantRefused()
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror as exc:
        raise AssistantUnreachable() from exc
    if not infos:
        raise AssistantUnreachable()
    for info in infos:
        try:
            ip = ipaddress.ip_address(info[4][0])
        except ValueError as exc:
            raise AssistantRefused() from exc
        if not ip.is_global:
            raise AssistantRefused()


def custom_endpoint(org):
    raw = read_config(org).get("custom")
    if not isinstance(raw, dict):
        return {}
    return {
        "name": raw.get("name") if isinstance(raw.get("name"), str) else "",
        "base_url": raw.get("base_url") if isinstance(raw.get("base_url"), str) else "",
        "model": raw.get("model") if isinstance(raw.get("model"), str) else "",
    }


def display_name(org, provider):
    if provider == CUSTOM_ID:
        label = custom_endpoint(org).get("name") or ""
        if label:
            return label
    for item in ASSISTANTS:
        if item["id"] == provider:
            return item["name"]
    return provider


def base_url_for(org, provider):
    if provider != CUSTOM_ID:
        return None
    return clean_base_url(custom_endpoint(org).get("base_url"))


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
    limit = clean_limit(limits.get(provider))
    limit = TOKEN_DEFAULT if limit is None else limit
    if provider in _DISCOVERED:
        stored = clean_model_name(models.get(provider)) if isinstance(models.get(provider), str) else None
        return stored or MODEL_CHOICES[provider][0], limit
    if provider == CUSTOM_ID:
        model = clean_model_name(custom_endpoint(org).get("model")) or ""
        return model, limit
    model = models.get(provider)
    if model not in MODEL_CHOICES.get(provider, ()):
        model = MODEL_CHOICES[provider][0]
    return model, limit


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
    using = []
    for item in ASSISTANTS:
        if item["id"] in connected:
            using.append({"id": item["id"], "name": display_name(org, item["id"])})
        if item.get("listed", True) is False:
            continue
        model, limit = provider_runtime(org, item["id"])
        row = {
            "id": item["id"],
            "name": display_name(org, item["id"]),
            "summary": item["summary"],
            "connected": item["id"] in connected,
            "model": model,
            "models": list(MODEL_CHOICES.get(item["id"], ())),
            "max_output_tokens": limit,
        }
        if item["id"] == CUSTOM_ID:
            endpoint = custom_endpoint(org)
            row["custom"] = True
            row["label"] = endpoint.get("name") or ""
            row["base_url"] = endpoint.get("base_url") or ""
            if model:
                row["models"] = [model]
        assistants.append(row)
    return {
        "default_provider": saved_default,
        "token_limit_min": TOKEN_MIN,
        "token_limit_max": TOKEN_MAX,
        "assistants": assistants,
        "using": using,
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


def update_provider_settings(
    org, provider, model=None, limit=None, name=None, base_url=None
):
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
    if provider == CUSTOM_ID and (name is not None or base_url is not None or model is not None):
        current = dict(config.get("custom") or {}) if isinstance(config.get("custom"), dict) else {}
        config["custom"] = {
            "name": name if name is not None else current.get("name") or "",
            "base_url": base_url if base_url is not None else current.get("base_url") or "",
            "model": model if model is not None else current.get("model") or "",
        }
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
    if provider == CUSTOM_ID or provider in _DISCOVERED:
        return clean_model_name(model) or (
            None if provider == CUSTOM_ID else MODEL_CHOICES[provider][0]
        )
    choices = MODEL_CHOICES.get(provider) or ()
    if model in choices:
        return model
    return choices[0] if choices else None


def complete(provider, api_key, user_text, model=None, max_output_tokens=None, base_url=None):
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
    if provider == CUSTOM_ID:
        return _custom_chat(
            base_url,
            api_key,
            chosen,
            _SYSTEM,
            [{"role": "user", "content": user_text}],
            max_output_tokens,
        )
    if provider in _FIXED_CHAT:
        return _custom_chat(
            _FIXED_CHAT[provider],
            api_key,
            chosen,
            _SYSTEM,
            [{"role": "user", "content": user_text}],
            max_output_tokens,
        )
    if provider == "anthropic":
        return _anthropic_chat(
            api_key,
            chosen,
            _SYSTEM,
            [{"role": "user", "content": user_text}],
            max_output_tokens,
        )
    raise AssistantRefused()


def converse(
    provider, api_key, system, turns, model=None, max_output_tokens=None, base_url=None
):
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
    messages = [
        {
            "role": "user" if turn["role"] == "user" else "assistant",
            "content": turn["content"],
        }
        for turn in turns
    ]
    if provider == CUSTOM_ID:
        return _custom_chat(base_url, api_key, chosen, system, messages, max_output_tokens)
    if provider in _FIXED_CHAT:
        return _custom_chat(
            _FIXED_CHAT[provider], api_key, chosen, system, messages, max_output_tokens
        )
    if provider == "anthropic":
        return _anthropic_chat(api_key, chosen, system, messages, max_output_tokens)
    raise AssistantRefused()


def _custom_chat(base_url, api_key, model, system, messages, max_output_tokens):
    target = clean_base_url(base_url)
    if not target or not model:
        raise AssistantRefused()
    _require_public_host(target)
    body = {
        "model": model,
        "messages": [{"role": "system", "content": system}, *messages],
    }
    if max_output_tokens is not None:
        body["max_tokens"] = int(max_output_tokens)
    payload = _post(
        chat_completions_url(target),
        {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        body,
    )
    return _openai_text(payload)[:4000]


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    """A redirect would let a public name answer from a private address."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise AssistantRefused()


def _send(request):
    opener = urllib.request.build_opener(_NoRedirect)
    return opener.open(request, timeout=_TIMEOUT)


def _post(url, headers, body):
    request = urllib.request.Request(
        url, data=json.dumps(body).encode(), method="POST"
    )
    for name, value in headers.items():
        request.add_header(name, value)
    try:
        with _send(request) as response:
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


def anthropic_model(api_key):
    """The first model this Claude key can call. The id is not guessed."""
    request = urllib.request.Request(_ANTHROPIC_MODELS, method="GET")
    request.add_header("x-api-key", api_key)
    request.add_header("anthropic-version", "2023-06-01")
    try:
        with _send(request) as response:
            payload = json.loads(response.read().decode())
    except urllib.error.HTTPError as exc:
        raise AssistantRefused() from exc
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise AssistantUnreachable() from exc
    rows = payload.get("data") if isinstance(payload, dict) else None
    model_id = rows[0].get("id") if rows and isinstance(rows[0], dict) else None
    model = clean_model_name(model_id) if isinstance(model_id, str) else None
    if not model:
        raise AssistantRefused()
    return model


def _anthropic_chat(api_key, model, system, messages, max_output_tokens):
    if not model:
        raise AssistantRefused()
    payload = _post(
        _ANTHROPIC_URL,
        {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        {
            "model": model,
            "max_tokens": int(max_output_tokens or TOKEN_DEFAULT),
            "system": system,
            "messages": messages,
        },
    )
    blocks = payload.get("content") if isinstance(payload, dict) else None
    parts = []
    for block in blocks or []:
        if isinstance(block, dict) and block.get("type") == "text" and isinstance(block.get("text"), str):
            parts.append(block["text"].strip())
    text = "\n".join(part for part in parts if part)
    if not text:
        raise AssistantUnreachable()
    return text[:4000]


def _openai_text(payload):
    try:
        message = payload["choices"][0]["message"]
    except (KeyError, IndexError, TypeError) as exc:
        raise AssistantUnreachable() from exc
    if not isinstance(message, dict):
        raise AssistantUnreachable()
    text = message.get("content")
    if not isinstance(text, str) or not text.strip():
        # Groq reasoning models can put the answer beside an empty content.
        text = message.get("reasoning")
    if not isinstance(text, str) or not text.strip():
        raise AssistantUnreachable()
    return text.strip()
