import invoices.models
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("invoices", "0014_add_zar_currency"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="kind",
            field=models.CharField(
                choices=[("product", "Product"), ("catalog", "Catalog")],
                default="product",
                max_length=16,
                verbose_name="Kind",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="image",
            field=models.FileField(
                blank=True,
                max_length=500,
                null=True,
                upload_to=invoices.models.product_image_path,
                verbose_name="Photo",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="catalog_file",
            field=models.FileField(
                blank=True,
                max_length=500,
                null=True,
                upload_to=invoices.models.product_catalog_path,
                verbose_name="Catalogue PDF",
            ),
        ),
    ]
