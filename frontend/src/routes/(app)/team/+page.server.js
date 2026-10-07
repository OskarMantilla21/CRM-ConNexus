import { tx, choiceLabel } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/sell.js';
import { ALL_PERMISSIONS, EMPLOYEE_PERMISSIONS } from '$lib/access.js';
import { fail } from '@sveltejs/kit';
import {
  listTeam,
  inviteUser,
  setRole,
  setStatus,
  ROLES,
  actorFromCookies
} from '$lib/server/v2/team.js';
import { readableError } from '$lib/server/v2/form-errors.js';

/**
 * Team and access.
 *
 * Server load, so the JWT cookie stays server-side. The list, the totals and
 * the per-person token counts all arrive from the real org; a non-admin gets
 * `forbidden` back rather than a broken page, because the underlying endpoints
 * are admin-only.
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ cookies }) {
  return await listTeam({ cookies });
}

/** @type {import('./$types').Actions} */
export const actions = {
  /**
   * Invite a new member: email + role. The server is the boundary. It gates
   * this to admins, rejects a duplicate within the org with a 400, and reuses
   * an account that already exists elsewhere instead of erroring.
   */
  invite: async ({ cookies, request }) => {
    const form = await request.formData();
    const actor = actorFromCookies(cookies);
    const name = form.get('name')?.toString().trim() ?? '';
    const username = form.get('username')?.toString().trim() ?? '';
    const password = form.get('password')?.toString() ?? '';
    // This screen creates an administrator or an employee. A CEO picks which.
    // An administrator only reaches the employee path.
    const role = actor.can_manage_administrators
      ? form.get('role')?.toString() || 'EMPLOYEE'
      : 'EMPLOYEE';
    if (!name) return fail(400, { invite: { error: tx('Enter a name.') } });
    if (!username) return fail(400, { invite: { error: tx('Enter a username.') } });
    if (password.length < 8) {
      return fail(400, { invite: { error: tx('Enter a password of at least 8 characters.') } });
    }
    if (!actor.can_manage_administrators && role !== 'EMPLOYEE') {
      return fail(403, { invite: { error: tx('You can only create employee profiles.') } });
    }
    if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
      return fail(400, { invite: { error: tx('Pick a valid role.') } });
    }
    // The account is still an email. A plain username becomes one the person
    // can type as-is at sign-in, the same way the part before @ already works.
    let email = username;
    if (!username.includes('@')) {
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(username)) {
        return fail(400, { invite: { error: tx('Use letters, numbers, dots or hyphens.') } });
      }
      email = `${username.toLowerCase()}@connexus.local`;
    }

    const catalog = role === 'ADMIN' ? ALL_PERMISSIONS : role === 'EMPLOYEE' ? EMPLOYEE_PERMISSIONS : null;
    /** @type {{ email: string, role: string, name: string, password: string, granted_permissions?: string[] }} */
    const body = { email, role, name, password };
    if (catalog) {
      body.granted_permissions = form
        .getAll('permissions')
        .map((value) => value.toString())
        .filter((key) => catalog.includes(key));
    }

    try {
      const created = await inviteUser({ cookies }, body);
      const signInAs = username.includes('@') ? username : username.toLowerCase();
      return { invited: signInAs, reused: created?.reused === true };
    } catch (/** @type {any} */ err) {
      return fail(err?.status === 403 ? 403 : 400, {
        invite: {
          error: tx(readableError(err, 'Could not create that profile.'))
        }
      });
    }
  },

  /**
   * Change someone's role. The page only shows this control for another
   * person's row and never for the last admin, mirroring the server's rules,
   * but the server is what enforces them: a member cannot promote themselves
   * and nobody can change their own role here.
   */
  setRole: async ({ cookies, request }) => {
    const form = await request.formData();
    const userId = form.get('userId')?.toString();
    const role = form.get('role')?.toString();
    if (!userId || !role || !ROLES.includes(role)) {
      return fail(400, { error: tx('Which person, and to what role?') });
    }
    const actor = actorFromCookies(cookies);
    if (!actor.can_manage_administrators && role !== 'EMPLOYEE') {
      return fail(403, { error: tx('You can only change employees.') });
    }
    const catalog =
      role === 'ADMIN' ? ALL_PERMISSIONS : role === 'EMPLOYEE' ? EMPLOYEE_PERMISSIONS : null;
    const granted = catalog
      ? form
          .getAll('permissions')
          .map((value) => value.toString())
          .filter((key) => catalog.includes(key))
      : null;
    try {
      await setRole({ cookies }, userId, role, granted);
    } catch (/** @type {any} */ err) {
      return fail(err?.status === 403 ? 403 : 400, {
        error: tx(readableError(err, 'Could not change that role.'))
      });
    }
    return { roleChanged: userId };
  },

  /**
   * Activate or deactivate a member. The server refuses to deactivate the last
   * active admin (a 400), so the org can never be stranded without one.
   */
  setStatus: async ({ cookies, request }) => {
    const form = await request.formData();
    const userId = form.get('userId')?.toString();
    const status = form.get('status')?.toString();
    if (!userId || (status !== 'Active' && status !== 'Inactive')) {
      return fail(400, { error: tx('Which person, and active or not?') });
    }
    try {
      await setStatus({ cookies }, userId, status);
    } catch (/** @type {any} */ err) {
      return fail(err?.status === 403 ? 403 : 400, {
        error: tx(readableError(err, 'Could not change that status.'))
      });
    }
    return { statusChanged: userId };
  }
};
