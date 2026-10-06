import { messages } from './catalog.js';
import { getLocale } from './locale.js';

/** @type {Record<string, string>} */
const es = {};
/** @type {Record<string, string>} */
const pt = {};

for (const [source, row] of Object.entries(messages)) {
  es[source] = row.es;
  pt[source] = row.pt;
}

/**
 * Page copy discovered while wrapping screens. Merged into the same tables
 * so a screen can add a sentence without editing `catalog.js`.
 *
 * @param {Record<string, { es: string, pt: string }>} more
 */
export function addMessages(more) {
  for (const [source, row] of Object.entries(more)) {
    es[source] = row.es;
    pt[source] = row.pt;
  }
}

/**
 * Translate an English source string into the active language.
 *
 * English returns the source, after placeholders are filled. Any other
 * language uses the catalog and falls back to that same English sentence
 * when the line has not been translated yet.
 *
 * @param {string} source
 * @param {Record<string, string | number | null | undefined>} [params]
 */
export function tx(source, params) {
  const text = String(source ?? '');
  const locale = getLocale();
  const table = locale === 'pt-BR' ? pt : locale === 'es' ? es : null;
  let out = (table && table[text]) || text;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      out = out.replaceAll(`{${key}}`, String(value ?? ''));
    }
  }
  return out;
}

/**
 * Label map whose values translate on read. The stored API value is the key
 * and stays English; only the words on screen change.
 *
 * @template {Record<string, string>} T
 * @param {T} labels
 * @returns {T}
 */
export function localize(labels) {
  return /** @type {T} */ (
    new Proxy(labels, {
      get(target, prop, receiver) {
        if (typeof prop !== 'string' || !Object.prototype.hasOwnProperty.call(target, prop)) {
          return Reflect.get(target, prop, receiver);
        }
        return tx(target[prop]);
      }
    })
  );
}

/**
 * A stored choice (`Partially_Paid`, `New`, `High`) shown to a person.
 * Free text, names and comments must not come through here.
 *
 * @param {string | null | undefined} value
 */
export function choiceLabel(value) {
  if (value == null || value === '') return '';
  return tx(String(value).replaceAll('_', ' '));
}
