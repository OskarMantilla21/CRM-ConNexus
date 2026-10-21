"""Move every business record from one company to another.

The two companies stay. People, API keys, personal tokens, saved views and
webhooks stay with the company they already belong to. Everything else that
carries an ``org`` foreign key — customers, leads, deals, tickets, invoices,
pipelines, tags — is deleted from the source and inserted into the destination
under the same primary key.

PostgreSQL row-level security refuses an ``UPDATE`` that changes ``org_id``,
because the new row would no longer match ``app.current_org``. The move
therefore reads as the source, deletes as the source, and inserts as the
destination. Nullable links between those rows are cleared for the write and
put back afterwards, so insert order does not have to satisfy them.
"""

import logging
import threading

from django.apps import apps
from django.db import IntegrityError, connection, models, transaction
from django.db.models import Q

from common.audit_log import audit_log
from common.models import Org, PortalAccessToken, Profile

logger = logging.getLogger(__name__)

# Membership and credentials. Moving them would take people out of a company
# or copy a secret into the company that received the records.
EXCLUDED = {
    "common.Profile",
    "common.Address",
    "common.PersonalAccessToken",
    "common.CalendarFeedToken",
    "common.PortalAccessToken",
    "common.PortalLoginToken",
    "common.APISettings",
    "common.SavedView",
    "common.PackApplication",
    "common.MagicLinkToken",
    "webhooks.WebhookEndpoint",
    "webhooks.WebhookDelivery",
}

# A required profile link that is not the record itself. When that person has
# no account in the destination, the row is removed instead of being pinned
# to the CEO who ran the move.
DROP_UNMAPPED_PROFILE = {
    ("common.Notification", "recipient"),
    ("cases.CaseWatcher", "profile"),
    ("tasks.BoardMember", "profile"),
}

_INSERT_LOCK = threading.Lock()


class OrgMigrationError(Exception):
    def __init__(self, code, message):
        self.code = code
        super().__init__(message)


def migrate_org_data(*, user, source, destination, request=None):
    """Move ``source`` company's records into ``destination``.

    ``user`` must be an active CEO of both. Returns a JSON-ready dict.
    """
    if source is None or destination is None:
        raise OrgMigrationError("unknown_org", "That company does not exist.")
    if source.pk == destination.pk:
        raise OrgMigrationError("same_org", "Choose a different company.")
    if not source.is_active or not destination.is_active:
        raise OrgMigrationError("not_ceo", "Only a CEO of both companies can move their records.")
    if not _is_ceo(user, source) or not _is_ceo(user, destination):
        raise OrgMigrationError("not_ceo", "Only a CEO of both companies can move their records.")

    actor = Profile.objects.filter(
        user=user, org=destination, role="CEO", is_active=True
    ).first()
    previous = _current_org()
    try:
        with transaction.atomic():
            list(
                Org.objects.select_for_update()
                .filter(pk__in=[source.pk, destination.pk])
                .order_by("pk")
            )
            report = _move(source, destination, actor)
    except IntegrityError as exc:
        logger.warning("Org migration conflict: %s", exc)
        raise OrgMigrationError(
            "conflict",
            "Some records could not move because a value is already used in the destination.",
        ) from exc
    finally:
        _set_org(previous)

    audit_log.org_data_migrated(
        user,
        source,
        destination,
        report["moved"],
        request=request,
    )
    return report


def _is_ceo(user, org):
    return Profile.objects.filter(
        user=user, org=org, role="CEO", is_active=True
    ).exists()


def _move(source, destination, actor):
    movable = _ordered(_movable_models())
    movable_set = set(movable)
    profile_map = _profile_map(source, destination)

    _set_org(source.pk)
    snapshots = {}
    for model in movable:
        snapshots[model] = list(model.objects.filter(org_id=source.pk))

    _set_org(destination.pk)
    renamed = _resolve_conflicts(snapshots, destination, source.name or "origen")

    reassigned = 0
    unassigned = 0
    insertable = {}
    for model, rows in snapshots.items():
        kept = []
        for obj in rows:
            outcome = _rewrite_profile_fks(obj, profile_map, actor.pk)
            if outcome == "drop":
                continue
            reassigned += outcome[0]
            unassigned += outcome[1]
            obj.org_id = destination.pk
            kept.append(obj)
        insertable[model] = kept

    nullable = {
        model: _nullable_links(model, movable_set) for model in movable
    }
    stashed = {}
    for model, fields in nullable.items():
        pairs = {field.attname: [] for field in fields}
        for obj in insertable[model]:
            for field in fields:
                value = getattr(obj, field.attname)
                if value is not None:
                    pairs[field.attname].append((obj.pk, value))
                setattr(obj, field.attname, None)
        stashed[model] = pairs

    _set_org(source.pk)
    external_rows = _detach_external(snapshots, movable_set)
    m2m_rows = _take_m2m(snapshots, movable_set)
    for model, fields in nullable.items():
        if not fields or not snapshots[model]:
            continue
        model.objects.filter(org_id=source.pk).update(
            **{field.attname: None for field in fields}
        )
    for model in reversed(movable):
        ids = [obj.pk for obj in snapshots[model]]
        _delete_ids(model, ids)

    _set_org(destination.pk)
    moved = []
    for model in movable:
        rows = insertable[model]
        _bulk_insert(model, rows)
        for attname, pairs in stashed[model].items():
            _restore_column(model, attname, pairs)
        if rows:
            moved.append({"model": model._meta.model_name, "count": len(rows)})

    for holder, rows in external_rows.items():
        for row in rows:
            if getattr(row, "org_id", None) == source.pk:
                row.org_id = destination.pk
        _bulk_insert(holder, rows)

    m2m_reassigned, m2m_dropped = _restore_m2m(m2m_rows, insertable, profile_map)
    reassigned += m2m_reassigned
    unassigned += m2m_dropped

    PortalAccessToken.objects.filter(org_id=source.pk).update(org_id=destination.pk)

    return {
        "source": {"id": str(source.pk), "name": source.name},
        "destination": {"id": str(destination.pk), "name": destination.name},
        "moved": moved,
        "renamed": renamed,
        "reassigned": reassigned,
        "unassigned": unassigned,
    }


def _movable_models():
    found = []
    for model in apps.get_models():
        opts = model._meta
        if opts.proxy or not opts.managed or opts.label in EXCLUDED:
            continue
        if any(not parent._meta.abstract for parent in opts.parents):
            continue
        try:
            field = opts.get_field("org")
        except Exception:
            continue
        if (
            isinstance(field, models.ForeignKey)
            and field.related_model._meta.label == "common.Org"
        ):
            found.append(model)
    return found


def _required_deps(model, movable_set):
    deps = set()
    for field in model._meta.fields:
        if not isinstance(field, models.ForeignKey) or field.name == "org":
            continue
        other = field.related_model
        if other in movable_set and other is not model and not field.null:
            deps.add(other)
    return deps


def _nullable_links(model, movable_set):
    fields = []
    for field in model._meta.fields:
        if not isinstance(field, models.ForeignKey) or field.name == "org":
            continue
        other = field.related_model
        if other in movable_set and (other is model or field.null):
            fields.append(field)
    return fields


def _ordered(models):
    pending = set(models)
    deps = {model: _required_deps(model, pending) for model in pending}
    ordered = []
    while pending:
        ready = sorted(
            (model for model in pending if not (deps[model] & pending)),
            key=lambda model: model._meta.label,
        )
        if not ready:
            labels = ", ".join(sorted(model._meta.label for model in pending))
            raise OrgMigrationError(
                "cycle",
                f"Records could not be ordered for the move ({labels}).",
            )
        for model in ready:
            pending.remove(model)
            ordered.append(model)
    return ordered


def _profile_map(source, destination):
    dest_by_user = {
        profile.user_id: profile.pk
        for profile in Profile.objects.filter(org=destination, is_active=True)
    }
    mapping = {}
    for profile in Profile.objects.filter(org=source):
        dest_id = dest_by_user.get(profile.user_id)
        if dest_id:
            mapping[profile.pk] = dest_id
    return mapping


def _rewrite_profile_fks(obj, mapping, fallback_id):
    """Point profile links at the same person in the destination.

    Returns ``"drop"`` when the row itself should stay behind, or
    ``(reassigned, unassigned)`` counts.
    """
    reassigned = 0
    unassigned = 0
    for field in obj._meta.fields:
        if (
            not isinstance(field, models.ForeignKey)
            or field.related_model._meta.label != "common.Profile"
        ):
            continue
        current = getattr(obj, field.attname)
        if current is None:
            continue
        mapped = mapping.get(current)
        if mapped:
            setattr(obj, field.attname, mapped)
            if mapped != current:
                reassigned += 1
            continue
        key = (obj._meta.label, field.name)
        if key in DROP_UNMAPPED_PROFILE:
            return "drop"
        if field.null:
            setattr(obj, field.attname, None)
            unassigned += 1
            continue
        setattr(obj, field.attname, fallback_id)
        reassigned += 1
    return (reassigned, unassigned)


class _Spec:
    def __init__(self, names, folds, condition, single_default):
        self.names = names
        self.folds = folds
        self.condition = condition
        self.single_default = single_default


def _expression_field(expr):
    if isinstance(expr, str):
        return expr, False
    ident = getattr(expr, "name", None)
    kind = expr.__class__.__name__
    if kind == "F" and ident:
        return ident, False
    children = getattr(expr, "source_expressions", None) or []
    if kind == "Lower" and children:
        inner, _folded = _expression_field(children[0])
        return inner, True
    if children and len(children) == 1:
        return _expression_field(children[0])
    return ident, False


def _specs(model):
    specs = []
    seen = set()

    def add(names, folds, condition, single_default):
        names = [name for name in names if name not in {"org", "org_id"}]
        key = (tuple(names), single_default, str(condition))
        if key in seen:
            return
        seen.add(key)
        if names or single_default:
            specs.append(_Spec(names, folds, condition, single_default))

    for together in model._meta.unique_together:
        fields = list(together)
        if "org" in fields or "org_id" in fields:
            add(fields, set(), None, False)
    for constraint in model._meta.constraints:
        if not isinstance(constraint, models.UniqueConstraint):
            continue
        names = []
        folds = set()
        items = list(constraint.fields) + list(getattr(constraint, "expressions", ()))
        for item in items:
            field_name, fold = _expression_field(item)
            if not field_name or field_name in names or field_name in {"org", "org_id"}:
                continue
            names.append(field_name)
            if fold:
                folds.add(field_name)
        single_default = constraint.condition == Q(is_default=True) and not names
        add(names, folds, constraint.condition, single_default)
    for field in model._meta.concrete_fields:
        if field.unique and not field.primary_key and field.name != "org":
            add([field.name], set(), None, False)
    return specs


def _matches(obj, condition):
    if condition is None:
        return True

    def match(node):
        if isinstance(node, Q):
            results = [match(child) for child in node.children]
            ok = any(results) if node.connector == Q.OR else all(results)
            return (not ok) if node.negated else ok
        lookup, expected = node
        parts = lookup.split("__")
        current = getattr(obj, parts[0])
        op = parts[1] if len(parts) > 1 else "exact"
        if op == "isnull":
            return (current is None) is bool(expected)
        if op == "exact":
            return current == expected
        return True

    return match(condition)


def _key(obj, spec):
    parts = []
    for name in spec.names:
        value = getattr(obj, name)
        if name in spec.folds and isinstance(value, str):
            value = value.casefold()
        parts.append(value)
    return tuple(parts)


def _collapse_defaults(rows, destination_has_default):
    renamed = 0
    kept = destination_has_default
    for obj in rows:
        if not getattr(obj, "is_default", False):
            continue
        if kept:
            obj.is_default = False
            renamed += 1
        else:
            kept = True
    return renamed


def _uniquify(obj, field, source_name, spec, taken):
    original = getattr(obj, field.name) or ""
    if not isinstance(original, str) or original == "":
        return False
    limit = field.max_length or 255
    if isinstance(field, models.EmailField) or field.name == "email":
        local, sep, domain = original.partition("@")
        if not sep:
            return False
        local = local.split("+", 1)[0]
        for number in range(1, 51):
            tag = "migrado" if number == 1 else f"migrado{number}"
            candidate = f"{local}+{tag}@{domain}"
            if len(candidate) > limit:
                return False
            setattr(obj, field.name, candidate)
            if _key(obj, spec) not in taken:
                return True
        return False

    base = f" · {source_name}"
    for number in range(1, 51):
        suffix = base if number == 1 else f"{base} {number}"
        trimmed = original
        if len(trimmed) + len(suffix) > limit:
            trimmed = trimmed[: limit - len(suffix)].rstrip()
        candidate = f"{trimmed}{suffix}" if trimmed else suffix.strip()
        if not candidate or len(candidate) > limit:
            return False
        setattr(obj, field.name, candidate)
        if _key(obj, spec) not in taken:
            return True
    return False


def _resolve_conflicts(snapshots, destination, source_name):
    renamed = 0
    for model, rows in snapshots.items():
        if not rows:
            continue
        specs = _specs(model)
        if any(spec.single_default for spec in specs) and any(
            getattr(obj, "is_default", False) for obj in rows
        ):
            destination_has = model.objects.filter(
                org_id=destination.pk, is_default=True
            ).exists()
            renamed += _collapse_defaults(rows, destination_has)
        for spec in specs:
            if spec.single_default or not spec.names:
                continue
            field = _text_field(model, spec.names)
            taken = set()
            for existing in model.objects.filter(org_id=destination.pk):
                if not _matches(existing, spec.condition):
                    continue
                key = _key(existing, spec)
                if any(part is None for part in key):
                    continue
                taken.add(key)
            for obj in rows:
                if not _matches(obj, spec.condition):
                    continue
                key = _key(obj, spec)
                # SQL unique constraints allow many NULLs. An empty string does
                # not, and still goes through the rename below.
                if any(part is None for part in key):
                    continue
                if key not in taken:
                    taken.add(key)
                    continue
                if field is None or not _uniquify(obj, field, source_name, spec, taken):
                    raise OrgMigrationError(
                        "conflict",
                        f"{model._meta.verbose_name} could not move without duplicating a value.",
                    )
                taken.add(_key(obj, spec))
                renamed += 1
    return renamed


def _text_field(model, names):
    for name in names:
        field = model._meta.get_field(name)
        if isinstance(field, (models.CharField, models.TextField)):
            return field
    return None


def _detach_external(snapshots, movable_set):
    """Break links from rows that are staying, and hold login codes aside.

    A many-to-many from a setting that stays (API keys) is dropped: the tag
    now belongs to the other company. A login code points at a contact and
    cannot be nulled, so the code is removed for the delete and written back
    once the contact exists again.
    """
    saved = {}
    for target, rows in snapshots.items():
        ids = [obj.pk for obj in rows]
        if not ids:
            continue
        for rel in target._meta.related_objects:
            holder = rel.related_model
            if holder in movable_set:
                continue
            if getattr(rel, "many_to_many", False):
                through = rel.through
                if through in movable_set:
                    continue
                fk = _fk_to(through, target)
                if fk is None:
                    continue
                _delete_matching(through, fk.attname, ids)
                continue
            field = getattr(rel, "field", None)
            if not isinstance(field, models.ForeignKey):
                continue
            if field.null:
                _null_matching(holder, field.attname, ids)
                continue
            for chunk in _chunks(ids):
                for row in holder.objects.filter(**{f"{field.attname}__in": chunk}):
                    saved[(holder, row.pk)] = row
    grouped = {}
    for (holder, pk), row in saved.items():
        grouped.setdefault(holder, []).append(row)
        del pk
    for holder, rows in grouped.items():
        _delete_ids(holder, [row.pk for row in rows])
    return grouped


def _fk_to(model, target):
    for field in model._meta.fields:
        if isinstance(field, models.ForeignKey) and field.related_model is target:
            return field
    return None


def _take_m2m(snapshots, movable_set):
    taken = []
    for model, rows in snapshots.items():
        ids = [obj.pk for obj in rows]
        if not ids:
            continue
        for field in model._meta.many_to_many:
            through = field.remote_field.through
            if through in movable_set:
                continue
            parent = field.m2m_field_name()
            target_name = field.m2m_reverse_field_name()
            found = []
            for chunk in _chunks(ids):
                found.extend(
                    through.objects.filter(**{f"{parent}_id__in": chunk})
                )
            if not found:
                continue
            _delete_ids(through, [row.pk for row in found])
            taken.append((through, parent, target_name, field.related_model, found))
    return taken


def _restore_m2m(taken, insertable, profile_map):
    reassigned = 0
    dropped = 0
    parent_ids = {obj.pk for batch in insertable.values() for obj in batch}
    for through, parent, target_name, target_model, rows in taken:
        restored = []
        target_is_profile = target_model._meta.label == "common.Profile"
        for row in rows:
            if getattr(row, f"{parent}_id") not in parent_ids:
                continue
            if target_is_profile:
                current = getattr(row, f"{target_name}_id")
                mapped = profile_map.get(current)
                if not mapped:
                    dropped += 1
                    continue
                if mapped != current:
                    reassigned += 1
                setattr(row, f"{target_name}_id", mapped)
            restored.append(row)
        _bulk_insert(through, restored)
    return reassigned, dropped


def _delete_matching(model, attname, ids):
    for chunk in _chunks(ids):
        (
            model.objects.filter(**{f"{attname}__in": chunk})._raw_delete(
                model.objects.db
            )
        )


def _null_matching(model, attname, ids):
    for chunk in _chunks(ids):
        model.objects.filter(**{f"{attname}__in": chunk}).update(**{attname: None})


def _delete_ids(model, ids):
    for chunk in _chunks(ids):
        model.objects.filter(pk__in=chunk)._raw_delete(model.objects.db)


def _restore_column(model, attname, pairs):
    if not pairs:
        return
    table = connection.ops.quote_name(model._meta.db_table)
    column = connection.ops.quote_name(model._meta.get_field(attname).column)
    pk_column = connection.ops.quote_name(model._meta.pk.column)
    sql = f"UPDATE {table} SET {column} = %s WHERE {pk_column} = %s"
    with connection.cursor() as cursor:
        cursor.executemany(sql, pairs)


def _bulk_insert(model, objects):
    if not objects:
        return
    touched = []
    with _INSERT_LOCK:
        for field in model._meta.concrete_fields:
            auto_now = getattr(field, "auto_now", False)
            auto_now_add = getattr(field, "auto_now_add", False)
            if auto_now or auto_now_add:
                touched.append((field, auto_now, auto_now_add))
                field.auto_now = False
                field.auto_now_add = False
        try:
            model.objects.bulk_create(objects, batch_size=200)
        finally:
            for field, auto_now, auto_now_add in touched:
                field.auto_now = auto_now
                field.auto_now_add = auto_now_add


def _chunks(ids, size=400):
    for start in range(0, len(ids), size):
        yield ids[start : start + size]


def _current_org():
    if connection.vendor != "postgresql":
        return None
    with connection.cursor() as cursor:
        cursor.execute("SELECT current_setting('app.current_org', true)")
        row = cursor.fetchone()
    return row[0] if row and row[0] else ""


def _set_org(org_id):
    if connection.vendor != "postgresql":
        return
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT set_config('app.current_org', %s, false)",
            ["" if org_id is None else str(org_id)],
        )
