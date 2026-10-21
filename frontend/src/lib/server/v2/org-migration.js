import { apiRequest } from '$lib/api-helpers.js';

/**
 * Companies the signed-in CEO also runs, besides the one in the session.
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export function listMigrationTargets(cookies) {
  return apiRequest('/org/migrate/', {}, { cookies });
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {{ direction: string, org_id: string, confirm_name: string }} body
 */
export function migrateOrg(cookies, body) {
  return apiRequest('/org/migrate/', { method: 'POST', body }, { cookies });
}
