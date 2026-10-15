import { tx, choiceLabel } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/sell.js';
import { fail, redirect } from '@sveltejs/kit';
import { EDITABLE_FIELDS, createDeal, getDealFormOptions } from '$lib/server/v2/deals.js';
import { getOrgSettings, saveDepositAccount } from '$lib/server/v2/organization.js';
import { readableError } from '$lib/server/v2/form-errors.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  // The currency hint under the amount comes from the shell (`data.org.currency`
  // via `(app)/+layout.server.js`). It is the currency this deal will be created
  // in: the form has no currency field, so the serializer stamps the org default
  // (`OpportunityCreateSerializer.create`).
  const [options, settings] = await Promise.all([
    getDealFormOptions(event),
    getOrgSettings(event).catch(() => ({ org: {}, can_edit: false }))
  ]);
  return {
    ...options,
    deposit: {
      bank_name: settings.org?.bank_name ?? '',
      bank_account_number: settings.org?.bank_account_number ?? '',
      can_edit: Boolean(settings.can_edit)
    }
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  async create(event) {
    const form = await event.request.formData();

    /** @type {Record<string, any>} */
    const values = {};
    for (const field of [...EDITABLE_FIELDS, 'assigned_to']) {
      if (form.has(field)) values[field] = form.get(field)?.toString().trim() ?? '';
    }
    // Kept on the rejected form so a typed account number is not wiped when
    // the deal itself is refused. Absent when the inputs were disabled.
    if (form.has('bank_account_number')) {
      values.bank_name = form.get('bank_name')?.toString().trim() ?? '';
      values.bank_account_number = form.get('bank_account_number')?.toString().trim() ?? '';
    }

    /** @type {any} */
    let created;
    try {
      // The deposit account belongs to the organisation. Save it before the
      // deal so a refused number never leaves a deal behind, and a refused
      // deal still keeps the number the person just typed.
      await saveDepositAccount(event, form);
      created = await createDeal(event, values);
    } catch (/** @type {any} */ err) {
      // `values` goes back so a rejected form is not a blank form. Retyping
      // eight fields because the ninth collided is how people learn to
      // distrust a create page.
      return fail(400, {
        values,
        error: readableError(err, tx('Could not create the deal.'))
      });
    }

    // Straight to the deal, not back to the list: the next thing anyone does
    // after creating one is look at it.
    redirect(303, created?.id ? `/pipeline/${created.id}` : '/pipeline');
  }
};
