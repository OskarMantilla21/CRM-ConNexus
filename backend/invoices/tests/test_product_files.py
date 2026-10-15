"""A product photo and a catalogue PDF.

The bytes are not a ``/media/`` URL. The list names the file; the download
view streams it, and only to the org that owns the product. A catalogue is
not a line on an invoice.
"""

import json
from decimal import Decimal

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from accounts.models import Account
from invoices.models import Invoice, Product

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 24
JPEG = b"\xff\xd8\xff\xd9"
GIF = b"GIF89a" + b"\x00" * 8
WEBP = b"RIFF" + b"\x00\x00\x00\x00" + b"WEBP"
PDF = b"%PDF-1.4\n1 0 obj\n"


def _file(name, body, content_type):
    return SimpleUploadedFile(name, body, content_type=content_type)


def _png(name="pump.png"):
    return _file(name, PNG, "image/png")


def _pdf(name="range.pdf"):
    return _file(name, PDF, "application/pdf")


@pytest.fixture
def product(org_a):
    return Product.objects.create(
        name="Test Product",
        sku="TP-FILE",
        price=Decimal("1.00"),
        org=org_a,
    )


@pytest.mark.django_db
class TestProductFiles:
    def test_a_product_keeps_a_photo_and_a_pdf(self, admin_client):
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Canaleta",
                "price": "12.00",
                "kind": "product",
                "image": _png(),
                "catalog_file": _pdf("ficha.pdf"),
            },
            format="multipart",
        )
        assert response.status_code == 201
        body = response.json()["product"]
        assert "/media/" not in json.dumps(body)
        assert body["has_image"] is True
        assert body["image_name"].endswith(".png")
        assert body["has_catalog"] is True
        assert body["catalog_name"].endswith(".pdf")
        assert body["kind"] == "product"
        assert "image" not in body
        assert "catalog_file" not in body

    def test_a_blank_sku_is_stored_as_null(self, admin_client, org_a):
        """The form sends "" for an empty SKU. Two of those must not collide."""
        for name in ("First", "Second"):
            response = admin_client.post(
                "/api/invoices/products/",
                {"name": name, "price": "1.00", "sku": ""},
                format="multipart",
            )
            assert response.status_code == 201
        assert Product.objects.get(name="First", org=org_a).sku is None
        assert Product.objects.get(name="Second", org=org_a).sku is None

    def test_a_catalogue_needs_its_pdf(self, admin_client):
        response = admin_client.post(
            "/api/invoices/products/",
            {"name": "Gama piscina", "price": "0", "kind": "catalog"},
            format="multipart",
        )
        assert response.status_code == 400
        assert "PDF" in json.dumps(response.json())

    def test_a_catalogue_stores_the_cover_and_the_pdf(self, admin_client, org_a):
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Gama piscina",
                "price": "0",
                "kind": "catalog",
                "image": _png("cover.png"),
                "catalog_file": _pdf(),
            },
            format="multipart",
        )
        assert response.status_code == 201
        product = Product.objects.get(name="Gama piscina", org=org_a)
        assert product.kind == "catalog"
        assert product.image.name.endswith("image.png")
        assert product.catalog_file.name.endswith("catalog.pdf")
        assert str(org_a.id) in product.image.name

    @pytest.mark.parametrize(
        "name, body, content_type",
        [
            ("photo.jpg", JPEG, "image/jpeg"),
            ("photo.gif", GIF, "image/gif"),
            ("photo.webp", WEBP, "image/webp"),
        ],
    )
    def test_the_other_photo_types_are_accepted(
        self, admin_client, name, body, content_type
    ):
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": name,
                "price": "1.00",
                "image": _file(name, body, content_type),
            },
            format="multipart",
        )
        assert response.status_code == 201

    def test_html_renamed_as_a_photo_is_refused(self, admin_client):
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Nope",
                "price": "1.00",
                "image": _file("photo.png", b"<html></html>", "image/png"),
            },
            format="multipart",
        )
        assert response.status_code == 400
        assert not Product.objects.filter(name="Nope").exists()

    def test_svg_is_refused(self, admin_client):
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Logo",
                "price": "1.00",
                "image": _file("logo.svg", b"<svg></svg>", "image/svg+xml"),
            },
            format="multipart",
        )
        assert response.status_code == 400

    def test_a_pdf_is_not_a_photo(self, admin_client):
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Sheet",
                "price": "1.00",
                "image": _pdf("sheet.pdf"),
            },
            format="multipart",
        )
        assert response.status_code == 400

    def test_a_photo_is_not_the_catalogue(self, admin_client):
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Gama",
                "price": "0",
                "kind": "catalog",
                "catalog_file": _png("range.png"),
            },
            format="multipart",
        )
        assert response.status_code == 400

    def test_a_photo_over_8mb_is_refused(self, admin_client):
        huge = b"\x89PNG\r\n\x1a\n" + b"\x00" * (8 * 1024 * 1024)
        response = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Huge",
                "price": "1.00",
                "image": _file("big.png", huge, "image/png"),
            },
            format="multipart",
        )
        assert response.status_code == 400
        assert not Product.objects.filter(name="Huge").exists()

    def test_the_download_is_named_after_the_product(self, admin_client):
        created = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Blue Moon",
                "price": "4.00",
                "image": _png(),
                "catalog_file": _pdf(),
            },
            format="multipart",
        )
        pid = created.json()["product"]["id"]

        photo = admin_client.get(f"/api/invoices/products/{pid}/file/?which=image")
        assert photo.status_code == 200
        disposition = photo["Content-Disposition"]
        assert "attachment" in disposition
        assert "Blue Moon.png" in disposition
        assert b"".join(photo.streaming_content).startswith(b"\x89PNG")

        catalogue = admin_client.get(
            f"/api/invoices/products/{pid}/file/?which=catalog"
        )
        assert catalogue.status_code == 200
        assert "Blue Moon.pdf" in catalogue["Content-Disposition"]
        assert b"".join(catalogue.streaming_content).startswith(b"%PDF")

    def test_another_org_cannot_download_the_file(self, admin_client, org_b_client):
        created = admin_client.post(
            "/api/invoices/products/",
            {"name": "Private", "price": "1.00", "image": _png()},
            format="multipart",
        )
        pid = created.json()["product"]["id"]
        response = org_b_client.get(f"/api/invoices/products/{pid}/file/?which=image")
        assert response.status_code == 404

    def test_a_member_can_read_the_file_and_cannot_upload_one(
        self, admin_client, user_client
    ):
        created = admin_client.post(
            "/api/invoices/products/",
            {"name": "Shared", "price": "1.00", "image": _png()},
            format="multipart",
        )
        pid = created.json()["product"]["id"]
        assert (
            user_client.get(f"/api/invoices/products/{pid}/file/?which=image").status_code
            == 200
        )
        refused = user_client.post(
            "/api/invoices/products/",
            {"name": "Sneaky", "price": "1.00", "image": _png("x.png")},
            format="multipart",
        )
        assert refused.status_code == 403
        assert not Product.objects.filter(name="Sneaky").exists()

    def test_an_unknown_slot_is_refused(self, admin_client, product):
        response = admin_client.get(
            f"/api/invoices/products/{product.id}/file/?which=other"
        )
        assert response.status_code == 400

    def test_a_missing_file_is_a_404(self, admin_client, product):
        response = admin_client.get(
            f"/api/invoices/products/{product.id}/file/?which=image"
        )
        assert response.status_code == 404

    def test_replacing_the_photo_keeps_the_pdf(self, admin_client):
        created = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Pump",
                "price": "9.00",
                "image": _png("old.png"),
                "catalog_file": _pdf(),
            },
            format="multipart",
        )
        pid = created.json()["product"]["id"]
        updated = admin_client.put(
            f"/api/invoices/products/{pid}/",
            {"image": _file("new.jpg", JPEG, "image/jpeg")},
            format="multipart",
        )
        assert updated.status_code == 200
        body = updated.json()["product"]
        assert body["image_name"].endswith(".jpg")
        assert body["has_catalog"] is True

    def test_a_save_without_a_file_leaves_the_photo(self, admin_client):
        created = admin_client.post(
            "/api/invoices/products/",
            {"name": "Pump", "price": "9.00", "image": _png()},
            format="multipart",
        )
        pid = created.json()["product"]["id"]
        updated = admin_client.put(
            f"/api/invoices/products/{pid}/",
            {"price": "10.00"},
            format="json",
        )
        assert updated.status_code == 200
        assert updated.json()["product"]["has_image"] is True

    def test_a_catalogue_is_not_a_line(self, admin_client, org_a):
        account = Account.objects.create(name="Buyer", org=org_a)
        invoice = Invoice.objects.create(
            invoice_title="Bill", account=account, currency="USD", org=org_a
        )
        created = admin_client.post(
            "/api/invoices/products/",
            {
                "name": "Gama",
                "price": "0",
                "kind": "catalog",
                "catalog_file": _pdf(),
            },
            format="multipart",
        )
        pid = created.json()["product"]["id"]
        response = admin_client.post(
            f"/api/invoices/{invoice.id}/line-items/",
            {
                "name": "Gama",
                "quantity": "1",
                "unit_price": "0",
                "product": pid,
            },
            format="json",
        )
        assert response.status_code == 400
        assert "catalogue" in json.dumps(response.json()).lower()

    def test_the_list_does_not_hand_out_a_media_url(self, admin_client):
        admin_client.post(
            "/api/invoices/products/",
            {"name": "Listed", "price": "2.00", "image": _png()},
            format="multipart",
        )
        response = admin_client.get("/api/invoices/products/")
        assert response.status_code == 200
        assert "/media/" not in response.content.decode()
