from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0052_profile_granted_permissions"),
    ]

    operations = [
        migrations.AddField(
            model_name="org",
            name="assistant_keys",
            field=models.JSONField(blank=True, default=None, null=True),
        ),
    ]
