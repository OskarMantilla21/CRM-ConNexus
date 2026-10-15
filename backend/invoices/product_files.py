"""What may be stored on a product, and what name a download uses.

The photo and the catalogue PDF are served through an authenticated view.
The stored path is never a URL the client is given. HTML and SVG are refused
here, not only at preview time: a file that is not the type it claims does
not get saved.
"""

import os

from rest_framework import serializers

IMAGE_EXTS = {"png", "jpg", "jpeg", "gif", "webp"}
IMAGE_MAX_BYTES = 8 * 1024 * 1024
CATALOG_MAX_BYTES = 20 * 1024 * 1024


def _ext(name):
    leaf = os.path.basename(name or "")
    if "." not in leaf:
        return ""
    return leaf.rsplit(".", 1)[-1].lower()


def _head(uploaded, n=16):
    data = uploaded.read(n) or b""
    if hasattr(uploaded, "seek"):
        uploaded.seek(0)
    return data


def _is_png(blob):
    return blob.startswith(b"\x89PNG\r\n\x1a\n")


def _is_jpeg(blob):
    return blob.startswith(b"\xff\xd8\xff")


def _is_gif(blob):
    return blob.startswith(b"GIF87a") or blob.startswith(b"GIF89a")


def _is_webp(blob):
    return len(blob) >= 12 and blob[:4] == b"RIFF" and blob[8:12] == b"WEBP"


def _is_pdf(blob):
    return blob.startswith(b"%PDF")


def _matches(ext, blob):
    if ext == "png":
        return _is_png(blob)
    if ext in {"jpg", "jpeg"}:
        return _is_jpeg(blob)
    if ext == "gif":
        return _is_gif(blob)
    if ext == "webp":
        return _is_webp(blob)
    if ext == "pdf":
        return _is_pdf(blob)
    return False


def clean_product_image(uploaded):
    """A photo the preview can draw, or a validation error."""
    if uploaded is None:
        return None
    size = getattr(uploaded, "size", 0) or 0
    if size <= 0:
        raise serializers.ValidationError("Choose a photo.")
    if size > IMAGE_MAX_BYTES:
        raise serializers.ValidationError("That photo is larger than 8 MB.")
    ext = _ext(getattr(uploaded, "name", ""))
    if ext not in IMAGE_EXTS or not _matches(ext, _head(uploaded)):
        raise serializers.ValidationError(
            "Use a PNG, JPG, GIF or WebP photo."
        )
    return uploaded


def clean_product_catalog(uploaded):
    """A PDF, or a validation error. HTML renamed to ``.pdf`` is refused."""
    if uploaded is None:
        return None
    size = getattr(uploaded, "size", 0) or 0
    if size <= 0:
        raise serializers.ValidationError("Choose a PDF.")
    if size > CATALOG_MAX_BYTES:
        raise serializers.ValidationError("That PDF is larger than 20 MB.")
    ext = _ext(getattr(uploaded, "name", ""))
    if ext != "pdf" or not _is_pdf(_head(uploaded)):
        raise serializers.ValidationError("The catalogue has to be a PDF.")
    return uploaded


def product_download_name(product, field_name):
    """The product title plus the stored extension.

    The path on disk is ``image.png`` or ``catalog.pdf``. The person saving
    the file should see the name they typed, and the preview decides the type
    from this extension, not from the storage path.
    """
    field = getattr(product, field_name, None)
    stored = field.name if field else ""
    leaf = (stored or "").rsplit("/", 1)[-1]
    ext = leaf.rsplit(".", 1)[-1].lower() if "." in leaf else ""
    title = product.name or "file"
    for ch in ("\r", "\n", '"', "/", "\\"):
        title = title.replace(ch, "")
    title = title.strip() or "file"
    if ext and not title.lower().endswith("." + ext):
        return f"{title}.{ext}"
    return title


def is_catalog(product):
    return getattr(product, "kind", "product") == "catalog"
