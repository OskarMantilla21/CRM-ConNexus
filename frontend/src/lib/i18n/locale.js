/**
 * UI language for the CRM.
 *
 * Spanish is the default. English and Brazilian Portuguese are explicit
 * choices, stored in the `crm_lang` cookie so the server renders the same
 * language the browser asked for. There is no Accept-Language guess: a first
 * visit is Spanish until someone picks otherwise.
 *
 * On the server the active language lives in an AsyncLocalStorage the hook
 * binds, one store per request. On the client it is a module variable set
 * from the root layout before any page renders. Tests pin English in
 * `test/setup-locale.js`, because the suites assert the English copy.
 */

export const LOCALE_COOKIE = 'crm_lang';
export const DEFAULT_LOCALE = 'es';

/** Endonyms. These are not passed through `tx`. */
export const LOCALES = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'pt-BR', label: 'Português (Brasil)' }
];

const KNOWN = new Set(LOCALES.map((item) => item.id));

/**
 * @param {string | null | undefined | FormDataEntryValue} value
 * @returns {'es' | 'en' | 'pt-BR'}
 */
export function normalizeLocale(value) {
  const raw = String(value ?? '')
    .trim()
    .replace(/_/g, '-');
  if (KNOWN.has(raw)) return /** @type {'es' | 'en' | 'pt-BR'} */ (raw);
  const lower = raw.toLowerCase();
  if (lower === 'pt' || lower === 'pt-br') return 'pt-BR';
  if (lower === 'en' || lower.startsWith('en-')) return 'en';
  if (lower === 'es' || lower.startsWith('es-')) return 'es';
  return DEFAULT_LOCALE;
}

/** @param {'es' | 'en' | 'pt-BR' | string} locale */
export function htmlLang(locale) {
  if (locale === 'pt-BR') return 'pt-BR';
  if (locale === 'en') return 'en';
  return 'es';
}

/** Dates keep the en-GB order the English UI already used (`7 Aug`). */
export function dateLocale(locale = getLocale()) {
  if (locale === 'pt-BR') return 'pt-BR';
  if (locale === 'en') return 'en-GB';
  return 'es-419';
}

/** Numbers and money. English stays en-US so `$1,234` does not become `US$1,234`. */
export function numberLocale(locale = getLocale()) {
  if (locale === 'pt-BR') return 'pt-BR';
  if (locale === 'en') return 'en-US';
  return 'es-419';
}

/**
 * Only a same-origin path. A language switch must not be an open redirect.
 *
 * @param {string | null | undefined | FormDataEntryValue} value
 */
export function safeNext(value) {
  const next = String(value ?? '');
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/';
  return next;
}

/** @type {import('node:async_hooks').AsyncLocalStorage<string> | null} */
let storage = null;
/** @type {'es' | 'en' | 'pt-BR'} */
let clientLocale = DEFAULT_LOCALE;

/** @param {import('node:async_hooks').AsyncLocalStorage<string>} als */
export function bindLocaleStorage(als) {
  storage = als;
}

/** @param {string | null | undefined} locale */
export function setClientLocale(locale) {
  clientLocale = normalizeLocale(locale);
}

/** @returns {'es' | 'en' | 'pt-BR'} */
export function getLocale() {
  const fromRequest = storage?.getStore?.();
  if (fromRequest) return normalizeLocale(fromRequest);
  return clientLocale;
}

/** Cookie options for `crm_lang`. Not httpOnly: it is a preference, not a credential. */
export function localeCookieOptions() {
  return {
    path: '/',
    httpOnly: false,
    sameSite: /** @type {'lax'} */ ('lax'),
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365
  };
}
