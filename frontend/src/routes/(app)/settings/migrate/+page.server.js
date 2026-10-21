import { fail } from '@sveltejs/kit';
import { listMigrationTargets, migrateOrg } from '$lib/server/v2/org-migration.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/migrate.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, parent }) {
  const parentData = await parent();
  if (parentData.role !== 'CEO') {
    return { forbidden: true, current: null, organizations: [] };
  }
  try {
    const data = await listMigrationTargets(cookies);
    return { forbidden: false, current: data.current, organizations: data.organizations ?? [] };
  } catch {
    return { forbidden: true, current: null, organizations: [] };
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  move: async ({ cookies, request }) => {
    const form = await request.formData();
    const direction = form.get('direction')?.toString() || '';
    const orgId = form.get('org_id')?.toString() || '';
    const confirmName = form.get('confirm_name')?.toString().trim() || '';
    if (direction !== 'import' && direction !== 'export') {
      return fail(400, { error: tx('Choose a different company.') });
    }
    if (!orgId || !confirmName) {
      return fail(400, { error: tx("Type the other company's name to confirm.") });
    }
    try {
      const report = await migrateOrg(cookies, {
        direction,
        org_id: orgId,
        confirm_name: confirmName
      });
      const moved = Array.isArray(report.moved) ? report.moved : [];
      return {
        moved: true,
        direction,
        total: moved.reduce((sum, row) => sum + (row.count || 0), 0),
        details: moved,
        renamed: report.renamed || 0,
        reassigned: report.reassigned || 0,
        unassigned: report.unassigned || 0
      };
    } catch (/** @type {any} */ err) {
      const code = err?.body?.error;
      if (code === 'confirm_name') {
        return fail(400, { error: tx("Type the other company's name to confirm.") });
      }
      if (code === 'not_ceo' || err?.status === 403) {
        return fail(403, { error: tx('Only a CEO of both companies can move their records.') });
      }
      if (code === 'same_org') {
        return fail(400, { error: tx('Choose a different company.') });
      }
      if (code === 'conflict') {
        return fail(400, { error: tx('Some records could not move because a value is already used.') });
      }
      return fail(400, { error: tx('The records could not be moved.') });
    }
  }
};
