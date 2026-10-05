from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0050_add_zar_currency"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_platform_admin",
            field=models.BooleanField(
                default=False,
                help_text="May list every user. Cannot open customer or payment records.",
                verbose_name="platform admin",
            ),
        ),
    ]
