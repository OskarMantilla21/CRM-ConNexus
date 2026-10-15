from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0054_securityauditlog_file_deleted"),
    ]

    operations = [
        migrations.AddField(
            model_name="org",
            name="bank_name",
            field=models.CharField(
                blank=True,
                help_text="Bank that receives deposits for this organisation.",
                max_length=120,
            ),
        ),
        migrations.AddField(
            model_name="org",
            name="bank_account_number",
            field=models.CharField(
                blank=True,
                help_text="Account number deposits are paid into.",
                max_length=40,
            ),
        ),
    ]
