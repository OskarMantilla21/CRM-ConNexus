from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = (
        "Mark an account as platform admin. The account can list users and "
        "cannot open customer or payment records."
    )

    def add_arguments(self, parser):
        parser.add_argument("email")

    def handle(self, *args, **options):
        email = options["email"].strip()
        if not email:
            raise CommandError("An email is required.")
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"is_active": True, "is_platform_admin": True},
        )
        if not user.is_platform_admin:
            user.is_platform_admin = True
            user.save(update_fields=["is_platform_admin"])
        verb = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{verb} platform admin {user.email}"))
