/**
 * Team and access: the ninth v2 module wired to the real API.
 *
 * Lives under `$lib/server` for the same reason as the eight before it:
 * SvelteKit refuses to bundle this directory into client code, and the access
 * token is an httpOnly cookie the browser must never see. Org is a JWT claim,
 * never a parameter.
 *
 * WHY THIS MODULE
 * This is the access-control page: who is an admin, who has been deactivated,
 * and whose API tokens still authenticate after their login was pulled. Wiring
 * it meant driving `/api/users/` and `/api/user/<id>/` for real, and those are
 * the endpoints where a plain member could PATCH their own profile to
 * role="ADMIN" and become an org admin. The page's own header comment claimed
 * "the server refuses to let anyone change their own role"; it did not. Fixing
 * that (in common/views/user_views.py + CreateProfileSerializer) is the point
 * of this migration; the wiring is what proved it end to end.
 *
 * WHAT THE MOCK ASSUMED THAT THE API DID NOT
 * - **Names.** The fixture split every person into `first_name`/`last_name`.
 *   `User` has a single `name`; the real `user_details` carries `name` (and
 *   `email`, `last_login`), so that is what the page shows, falling back to the
 *   email when someone was invited and has no name yet.
 * - **Per-member teams.** `ProfileSerializer` does not list a person's teams.
 *   They are derived here from `/api/teams/`, whose serializer nests each
 *   team's members, one source of truth, not a second field that could drift.
 * - **Token counts.** The one genuinely urgent thing this page surfaces. A
 *   live token on a deactivated account. Needs a real count, so the users list
 *   now returns `active_token_count` per profile (computed once server-side,
 *   not on the shared serializer). No count is invented.
 *
 * WHAT STAYED FIXTURES, ON PURPOSE
 * The People/access half is wired: list, invite, role change, activate and
 * deactivate. Team CRUD (create/edit membership) is a separate write surface
 * with its own picker UI and is left for later, exactly as estimates were left
 * beside invoices. The teams list still renders, read-only, because the
 * people rows need it to show who is on what.
 */
import { apiRequest } from '$lib/api-helpers.js';
import { ALL_PERMISSIONS, permissionsFromClaims } from '$lib/access.js';

/**
 * Profile.role. CEO has every permission. ADMIN has the grant list the CEO
 * saves. USER is a member. EMPLOYEE can record the day's work and nothing else.
 */
export const ROLES = ['CEO', 'ADMIN', 'USER', 'EMPLOYEE'];

/**
 * The signed-in user's id, read from the `user_id` claim of the access token.
 *
 * Used only to mark ", you" on a row and to withhold the controls a person
 * must not use on themselves. It is a display hint, never an authorization
 * decision: the server re-derives identity from the same token and is the
 * thing that actually refuses a self-role-change. Decoded, not verified.
 * Verifying our own freshly-read cookie would buy nothing.
 *
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @returns {string | null}
 */
function viewerClaims(cookies) {
  const token = cookies.get('jwt_access');
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * What this signed-in person may do on the team page.
 *
 * A display hint. The API refuses a role they are not allowed to hand out.
 * A CEO (or anyone who already has every permission) creates administrators.
 * An administrator creates employees.
 *
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export function actorFromCookies(cookies) {
  const claims = viewerClaims(cookies) ?? {};
  const role = typeof claims.role === 'string' ? claims.role : 'USER';
  const permissions = permissionsFromClaims(claims);
  const hasEvery = ALL_PERMISSIONS.every((key) => permissions.includes(key));
  const canManageAdministrators =
    role === 'CEO' || (claims.is_organization_admin === true && hasEvery && role !== 'EMPLOYEE');
  return {
    role,
    can_manage_administrators: canManageAdministrators,
    can_manage_employees: canManageAdministrators || role === 'ADMIN'
  };
}

/**
 * One person as the page reads it, from a `ProfileSerializer` row.
 *
 * `id` is the profile id; `user_id` is the User id, which is the pk every
 * `/api/user/<id>/` verb takes. Keeping both here means the template never has
 * to remember which one an action needs.
 *
 * @param {any} p
 * @param {Record<string, string[]>} teamsByProfile
 * @param {string | null} viewerId
 */
function toMember(p, teamsByProfile, viewerId) {
  const details = p.user_details ?? {};
  return {
    id: p.id,
    user_id: details.id,
    name: details.name || details.email || 'Unnamed',
    email: details.email,
    role: p.role,
    granted_permissions: Array.isArray(p.granted_permissions) ? p.granted_permissions : null,
    // Null when this viewer must not learn whether the account is active.
    // That is the CEO's row, read by an administrator.
    is_active: p.activity_visible === false ? null : p.is_active,
    activity_visible: p.activity_visible !== false,
    teams: teamsByProfile[p.id] ?? [],
    last_login: details.last_login ?? null,
    active_token_count: p.active_token_count ?? 0,
    is_you: !!viewerId && details.id === viewerId
  };
}

/**
 * The team-and-access page.
 *
 * `/api/users/` and `/api/teams/` are both admin-only. A non-admin who reaches
 * this page (the nav shows it to everyone) gets a clean "admins only" state
 * rather than an error: `forbidden` is the API's 403 turned into a fact the
 * page can render, not a crash.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 */
export async function listTeam({ cookies }) {
  let usersResp;
  try {
    usersResp = await apiRequest('/users/', {}, { cookies });
  } catch (/** @type {any} */ err) {
    if (err?.status === 403) return { forbidden: true };
    throw err;
  }

  // Teams are a separate admin surface. An administrator who can create
  // employees still sees people when the teams list is refused.
  let teamRows = [];
  let teamsForbidden = false;
  try {
    const teamsResp = await apiRequest('/teams/', {}, { cookies });
    teamRows = teamsResp?.teams ?? [];
  } catch (/** @type {any} */ err) {
    if (err?.status !== 403) throw err;
    teamsForbidden = true;
  }

  const claims = viewerClaims(cookies);
  const viewerId = claims?.user_id ?? null;

  // profile id -> the names of the teams it belongs to, from the teams payload.
  /** @type {Record<string, string[]>} */
  const teamsByProfile = {};
  for (const t of teamRows) {
    for (const u of t.users ?? []) {
      (teamsByProfile[u.id] ??= []).push(t.name);
    }
  }

  const active = (usersResp?.active_users?.active_users ?? []).map((/** @type {any} */ p) =>
    toMember(p, teamsByProfile, viewerId)
  );
  const inactive = (usersResp?.inactive_users?.inactive_users ?? []).map((/** @type {any} */ p) =>
    toMember(p, teamsByProfile, viewerId)
  );
  // The CEO, when an administrator is reading. The row is real. Its active
  // or inactive state is not.
  const concealed = (usersResp?.people_without_activity?.people_without_activity ?? []).map(
    (/** @type {any} */ p) => toMember(p, teamsByProfile, viewerId)
  );

  const teams = teamRows.map((/** @type {any} */ t) => ({
    id: t.id,
    name: t.name,
    description: t.description || '',
    member_count: (t.users ?? []).length
  }));

  const admins = [...active, ...concealed].filter(
    (/** @type {any} */ m) => m.role === 'ADMIN' || m.role === 'CEO'
  );
  const fullAdmins = active.filter(
    (/** @type {any} */ m) =>
      m.role === 'CEO' || (m.role === 'ADMIN' && m.granted_permissions == null)
  );

  return {
    forbidden: false,
    active,
    inactive,
    concealed,
    teams,
    teamsForbidden,
    roles: ROLES,
    actor: actorFromCookies(cookies),
    totals: {
      count: active.length,
      people: active.length + inactive.length + concealed.length,
      admins: admins.length,
      never_signed_in: active.filter((/** @type {any} */ m) => !m.last_login).length,
      deactivated: inactive.length,
      // A live token outliving the account that owns it, the number worth acting on.
      tokens_on_deactivated: inactive.reduce(
        (/** @type {number} */ a, /** @type {any} */ m) => a + m.active_token_count,
        0
      )
    },
    // Whether the org would have a second admin left if one were removed. The
    // page mirrors "keep at least one admin" as a hint; the server enforces it.
    last_admin_id: fullAdmins.length === 1 ? fullAdmins[0].user_id : null
  };
}

/**
 * Invite someone: `POST /api/users/`. Admin-only server-side. Role is chosen
 * at invite time. That is legitimate on this path (an admin choosing a new
 * member's role), unlike a member setting their own.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {{ email: string, role: string, granted_permissions?: string[] }} body
 */
export function inviteUser({ cookies }, body) {
  return apiRequest('/users/', { method: 'POST', body }, { cookies });
}

/**
 * Change a person's role: `PATCH /api/user/<userId>/`. The server allows this
 * only for an admin acting on someone other than themselves, so the page never
 * offers it on your own row or when it would strip the last admin.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} userId  the User id, not the profile id
 * @param {string} role
 * @param {string[] | null} [granted]
 *   Sent for an administrador or an empleado. Null leaves a legacy full
 *   admin untouched.
 */
export function setRole({ cookies }, userId, role, granted = null) {
  /** @type {Record<string, unknown>} */
  const body = { role };
  if ((role === 'ADMIN' || role === 'EMPLOYEE') && Array.isArray(granted)) {
    body.granted_permissions = granted;
  }
  return apiRequest(`/user/${userId}/`, { method: 'PATCH', body }, { cookies });
}

/**
 * Activate or deactivate: `POST /api/user/<userId>/status/`. The server refuses
 * to deactivate the last active admin.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} userId
 * @param {'Active' | 'Inactive'} status
 */
export function setStatus({ cookies }, userId, status) {
  return apiRequest(`/user/${userId}/status/`, { method: 'POST', body: { status } }, { cookies });
}
