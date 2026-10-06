import { DEFAULT_LOCALE } from '$lib/i18n/locale.js';
import '$lib/i18n/pages/public.js';

/** Every page, including sign-in, reads the language chosen for this browser. */
export function load({ locals }) {
  return { locale: locals.locale || DEFAULT_LOCALE };
}
