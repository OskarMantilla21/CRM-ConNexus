import { tx, choiceLabel } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/sell.js';
import { fail } from '@sveltejs/kit';
import { EDITABLE_FIELDS, getDealForEdit, updateDeal } from '$lib/server/v2/deals.js';
import { getOrgSettings, saveDepositAccount } from '$lib/server/v2/organization.js';
import { readableError } from '$lib/server/v2/form-errors.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const [deal, settings] = await Promise.all([
    getDealForEdit(event, event.params.id),
    getOrgSettings(event).catch(() => ({ org: {}, can_edit: false }))
  ]);
  return {
    ...deal,
    deposit: {
      bank_name: settings.org?.bank_name ?? '',
      bank_account_number: settings.org?.bank_account_number ?? '',
      can_edit: Boolean(settings.can_edit)
    }
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  async save(event) {
    const form = await event.request.formData();

    /**
     * Only fields the form actually submitted. A disabled input sends nothing,
     * and PATCH reads absent as "leave this alone", which is exactly right
     * for the amount on a deal whose line items own it.
     * @type {Record<string, any>}
     */
    const values = {};
    for (const field of EDITABLE_FIELDS) {
      if (form.has(field)) values[field] = form.get(field)?.toString().trim() ?? '';
    }

    /*
     * The owner is only sent when somebody actually changed it.
     *
     * `assigned_to` is many-to-many and this form offers a single select, so
     * sending it unconditionally rewrites the whole list from one value,
     * a deal with two people on it silently loses one every time anybody
     * edits the description. Caught by saving a real two-assignee deal and
     * counting the assignees afterwards.
     *
     * Comparing against the value the form was rendered with keeps "nobody
     * touched this" distinguishable from "somebody chose this", which is the
     * distinction PATCH is built on.
     */
    const owner = form.get('assigned_to')?.toString().trim() ?? '';
    const ownerWas = form.get('assigned_to_original')?.toString().trim() ?? '';
    if (owner !== ownerWas) values.assigned_to = owner;
    if (form.has('bank_account_number')) {
      values.bank_name = form.get('bank_name')?.toString().trim() ?? '';
      values.bank_account_number = form.get('bank_account_number')?.toString().trim() ?? '';
    }

    try {
      await saveDepositAccount(event, form);
      await updateDeal(event, event.params.id, values);
    } catch (/** @type {any} */ err) {
      // The API's field errors are the ones that count: this form's own
      // checks are a UX hint and the serializer is the rule.
      return fail(400, {
        values,
        error: readableError(err, tx('Could not save the deal.'))
      });
    }

    return { saved: true };
  }
};
