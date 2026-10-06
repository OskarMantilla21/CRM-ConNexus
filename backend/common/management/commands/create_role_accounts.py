"""Create the four role accounts in an existing organization.

One CEO (every permission), one administrador (sales, support and daily
work, which the CEO can change), and two empleados (daily work only).

Sign-in is the magic link. When the oldest full administrator's address is
at a provider that supports plus-addressing, the new logins are tags on
that same inbox, so the code arrives there. Otherwise the addresses use
example.com, which does not deliver mail.
"""

import secrets

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from django.utils import timezone

from common.models import Org, Profile
from common.rls import get_set_context_sql

User = get_user_model()

# tag, display name, role, grant list (None except for an administrador).
ACCOUNTS = (
    ("ceo", "CEO", "CEO", None),
    ("administrador", "Administrador", "ADMIN", ["sell", "serve", "daily_work"]),
    ("empleado1", "Empleado 1", "EMPLOYEE", None),
    ("empleado2", "Empleado 2", "EMPLOYEE", None),
)

# Providers that deliver local+tag@domain to local@domain.
PLUS_DOMAINS = {
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
}


class Command(BaseCommand):
    help = "Create a CEO, an administrador and two empleados in an organization."

    def add_arguments(self, parser):
        parser.add_argument(
            "--org",
            help="Org name or id. Defaults to the organization with the most people.",
        )

    def handle(self, *args, **options):
        org = self._org(options.get("org"))
        local, domain = self._inbox(org)
        password = secrets.token_urlsafe(9)
        created = []

        self._set_rls(org.id)
        for tag, name, role, grants in ACCOUNTS:
            if local:
                email = f"{local}+{tag}@{domain}"
            else:
                email = f"rol-{tag}@{domain}"
            user = User.objects.filter(email__iexact=email).first()
            fresh = user is None
            if fresh:
                user = User.objects.create_user(
                    email=email, password=password, name=name
                )
            profile = Profile.objects.filter(user=user, org=org).first()
            if profile is None:
                profile = Profile(
                    user=user,
                    org=org,
                    date_of_joining=timezone.localdate(),
                    is_active=True,
                )
            profile.role = role
            profile.granted_permissions = grants
            profile.is_active = True
            profile.save()
            created.append((email, role, fresh))

        self.stdout.write(self.style.SUCCESS(f"Organization: {org.name} ({org.id})"))
        for email, role, fresh in created:
            state = "created" if fresh else "already existed, role updated"
            self.stdout.write(f"  {role:8}  {email}  ({state})")
        fresh_emails = [email for email, _role, fresh in created if fresh]
        if local and fresh_emails:
            self.stdout.write(
                "Sign in with each address. The code arrives in the same inbox as "
                f"{local}@{domain}."
            )
        elif fresh_emails:
            self.stdout.write(self.style.WARNING(f"Password for new accounts: {password}"))
        else:
            self.stdout.write("No new accounts. Existing passwords were left as they are.")

    def _org(self, org_arg):
        if org_arg:
            org = Org.objects.filter(pk=org_arg).first() or Org.objects.filter(
                name__iexact=org_arg
            ).first()
            if org is None:
                raise CommandError(f"No organization named {org_arg!r}.")
            return org
        orgs = list(Org.objects.all())
        if not orgs:
            raise CommandError("No organization exists yet.")
        return max(orgs, key=lambda org: Profile.objects.filter(org=org).count())

    def _inbox(self, org):
        """(local, domain) when plus-addressing can share the admin inbox.

        Otherwise (None, "example.com").
        """
        profile = (
            Profile.objects.filter(
                org=org, role="ADMIN", granted_permissions__isnull=True, is_active=True
            )
            .select_related("user")
            .order_by("created_at")
            .first()
        )
        email = (profile.user.email or "") if profile else ""
        if "@" not in email:
            return None, "example.com"
        local, domain = email.lower().split("@", 1)
        local = local.split("+", 1)[0]
        if domain in PLUS_DOMAINS and local:
            return local, domain
        return None, "example.com"

    def _set_rls(self, org_id):
        with connection.cursor() as cursor:
            cursor.execute(get_set_context_sql(), [str(org_id)])
