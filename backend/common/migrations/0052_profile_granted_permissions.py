from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0051_user_is_platform_admin"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="granted_permissions",
            field=models.JSONField(blank=True, default=None, null=True),
        ),
    ]
