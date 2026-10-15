import { fail, redirect, error } from '@sveltejs/kit';
import {
  getProductForEdit,
  updateProduct,
  deleteProduct,
  readProductDraft,
  draftValues,
  productFileProblem
} from '$lib/server/v2/products.js';
import { readableError } from '$lib/server/v2/form-errors.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/bill.js';

/**
 * Editing a catalogue product.
 *
 * Admin-only, and enforced server-side: `getProductForEdit` returns
 * `can_edit: false` for a non-admin without even fetching the row, so the form
 * is never drawn for someone the PUT would refuse; the API refuses it too. The
 * detail fetch is org-scoped, so a foreign or unknown id 404s.
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load(event) {
  try {
    return await getProductForEdit(event, event.params.id);
  } catch (/** @type {any} */ err) {
    if (err?.status === 404) error(404, tx('Product not found'));
    throw err;
  }
}

/** A price is required and must be a number ≥ 0. */
function priceOk(value) {
  if (value === '') return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}

/** @type {import('./$types').Actions} */
export const actions = {
  save: async (event) => {
    const form = await event.request.formData();
    const draft = readProductDraft(form);
    const values = draftValues(draft);
    const storedCatalog = form.get('has_catalog') === '1';

    if (!draft.name) return fail(400, { values, error: tx('Give the product a name.') });
    if (!priceOk(draft.price)) {
      return fail(400, { values, error: tx('Enter a list price of 0 or more.') });
    }
    const fileProblem = productFileProblem(draft, { requireCatalog: !storedCatalog });
    if (fileProblem) return fail(400, { values, error: tx(fileProblem) });

    try {
      await updateProduct(event, event.params.id, draft);
    } catch (/** @type {any} */ err) {
      if (err?.status === 403) {
        return fail(403, { values, error: tx('Only an administrator can change products.') });
      }
      if (err?.status === 404) error(404, tx('Product not found'));
      return fail(400, { values, error: readableError(err, tx('Could not save this product.')) });
    }

    redirect(303, '/invoices/products');
  },

  delete: async (event) => {
    try {
      await deleteProduct(event, event.params.id);
    } catch (/** @type {any} */ err) {
      if (err?.status === 403) {
        return fail(403, { error: tx('Only an administrator can delete products.') });
      }
      // 404 means it is already gone: fall through to the list either way.
      if (err?.status !== 404) {
        return fail(400, { error: readableError(err, tx('Could not delete this product.')) });
      }
    }

    redirect(303, '/invoices/products');
  }
};
