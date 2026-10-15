import { fail, redirect } from '@sveltejs/kit';
import {
  getNewProductOptions,
  createProduct,
  readProductDraft,
  draftValues,
  productFileProblem
} from '$lib/server/v2/products.js';
import { readableError } from '$lib/server/v2/form-errors.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/bill.js';

/**
 * Adding to the product catalogue.
 *
 * Admin-only: `POST /api/invoices/products/` refuses a non-admin (the catalogue
 * is org-wide config, not a per-rep record), so the page hides the form from a
 * non-admin and the action would 403 anyway. `org` is server-derived and never
 * read from the body; `currency` defaults to the org's when left blank.
 *
 * @type {import('./$types').PageServerLoad}
 */
export function load(event) {
  return getNewProductOptions(event);
}

/** A price is required and must be a number ≥ 0 (the model default is 0). */
function priceOk(value) {
  if (value === '') return false;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}

/** @type {import('./$types').Actions} */
export const actions = {
  create: async (event) => {
    const form = await event.request.formData();
    const draft = readProductDraft(form);
    const values = draftValues(draft);

    // UX-side mirrors of the serializer's rules. The API enforces both again.
    if (!draft.name) return fail(400, { values, error: tx('Give the product a name.') });
    if (!priceOk(draft.price)) {
      return fail(400, { values, error: tx('Enter a list price of 0 or more.') });
    }
    const fileProblem = productFileProblem(draft, { requireCatalog: true });
    if (fileProblem) return fail(400, { values, error: tx(fileProblem) });

    try {
      await createProduct(event, draft);
    } catch (/** @type {any} */ err) {
      if (err?.status === 403) {
        return fail(403, { values, error: tx('Only an administrator can add products.') });
      }
      return fail(400, { values, error: readableError(err, tx('Could not create this product.')) });
    }

    redirect(303, '/invoices/products');
  }
};
