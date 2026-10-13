/**
 * The part of a page's loaded data that may be shown to the assistant.
 *
 * Shell badges and anything that looks like a secret stay out. The server
 * repeats this filter; this copy keeps the browser from posting the secret
 * in the first place. `visible` is the text already on the page, added after
 * this walk so a long screen is not cut down to one short line.
 */

const DROP_KEYS = new Set([
  'counts',
  'permissions',
  'is_organization_admin',
  'screenAssistant',
  'lead_attachment',
  'lead_comments',
  'attachments',
  'comments',
  'custom_fields',
  'terminology',
  'savedViews',
  'saved_views'
]);

const PREFER = new Set([
  'title',
  'name',
  'first_name',
  'last_name',
  'company_name',
  'email',
  'phone',
  'status',
  'source',
  'job_title',
  'city',
  'description',
  'priority',
  'due_date',
  'close_date',
  'amount',
  'opportunity_amount',
  'currency',
  'probability',
  'stage',
  'account',
  'assigned_to',
  'owner',
  'rating',
  'industry',
  'queue',
  'summary',
  'parents',
  'leads',
  'tasks',
  'goals'
]);

const SECRET_KEY = /password|api[_-]?key|secret|token|authorization|jwt|cookie|credential|assistant_keys/i;

/**
 * @param {unknown} data
 */
export function screenBrief(data) {
  const cleaned = walk(data, 0);
  return cleaned && typeof cleaned === 'object' && !Array.isArray(cleaned) ? cleaned : {};
}

/**
 * The words on the open page, plus what is written in its fields.
 * Password fields are skipped. Returns '' on the server.
 */
export function visibleScreen() {
  if (typeof document === 'undefined') return '';
  const main = document.querySelector('.v2-main');
  if (!main) return '';
  /** @type {string[]} */
  const parts = [];
  for (const node of main.children) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.matches('form.ask, nav.v2-tabbar')) continue;
    const text = (node.innerText || '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (text) parts.push(text);
    for (const field of node.querySelectorAll('input, textarea, select')) {
      if (!(field instanceof HTMLElement)) continue;
      if (field.closest('form.ask')) continue;
      const type = (field.getAttribute('type') || '').toLowerCase();
      if (type === 'password' || type === 'hidden' || type === 'file') continue;
      let value = '';
      if (field instanceof HTMLSelectElement) {
        const names = [...field.options].map((option) => option.text);
        const heading = field.closest('label')?.querySelector('.v2-label');
        const headingText = (heading?.textContent || '').replace(/\s+/g, ' ').trim();
        const extra = optionLine(headingText, names, text);
        if (extra) parts.push(extra);
        value = (field.selectedOptions[0]?.text || '').trim();
      } else if (
        field instanceof HTMLInputElement &&
        (type === 'checkbox' || type === 'radio')
      ) {
        if (!field.checked) continue;
        value = field.value || 'sí';
      } else if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        value = field.value.trim();
      }
      if (!value || text.includes(value)) continue;
      const labelled = 'labels' in field ? /** @type {HTMLInputElement} */ (field).labels?.[0] : null;
      const label = (labelled?.innerText || field.getAttribute('aria-label') || '')
        .replace(/\s+/g, ' ')
        .trim();
      parts.push(label ? `${label}: ${value}` : value);
    }
  }
  return cleanVisible(parts.join('\n'));
}

/**
 * Names from a list that the page text does not already show.
 *
 * @param {string} label
 * @param {Iterable<string>} names
 * @param {string} pageText
 */
export function optionLine(label, names, pageText) {
  /** @type {string[]} */
  const pending = [];
  for (const name of names) {
    const text = String(name || '').replace(/\s+/g, ' ').trim();
    if (!text || pageText.includes(text)) continue;
    pending.push(text);
    if (pending.length >= 20) break;
  }
  if (!pending.length) return '';
  return label ? `${label}: ${pending.join(', ')}` : pending.join(', ');
}

/**
 * @param {unknown} data
 * @param {unknown} visible
 */
export function withVisible(data, visible) {
  const brief = screenBrief(data);
  const text = cleanVisible(visible);
  if (text) brief.visible = text;
  return brief;
}

/**
 * @param {unknown} visible
 */
export function cleanVisible(visible) {
  if (typeof visible !== 'string') return '';
  const lines = [];
  for (const line of visible.split('\n')) {
    const text = line.replace(/[ \t]+/g, ' ').trim();
    if (!text) continue;
    if (/token=/i.test(text)) continue;
    if (text.length > 40 && text.split('.').length === 3 && !text.includes(' ')) continue;
    lines.push(text.length > 300 ? `${text.slice(0, 299)}…` : text);
    if (lines.join('\n').length >= 4500) break;
  }
  return lines.join('\n').slice(0, 4500);
}

/**
 * @param {unknown} value
 * @param {number} depth
 */
function walk(value, depth) {
  if (depth > 6 || value == null) return undefined;
  if (typeof value === 'string') {
    const text = value.replace(/\s+/g, ' ').trim();
    if (!text) return undefined;
    if (text.length > 80 && !text.includes(' ')) return undefined;
    if (/token=/i.test(text)) return undefined;
    if (text.length > 40 && text.split('.').length === 3 && !text.includes(' ')) return undefined;
    return text.length > 180 ? `${text.slice(0, 179)}…` : text;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    /** @type {unknown[]} */
    const items = [];
    for (const item of value) {
      if (items.length >= 25) break;
      const cleaned = walk(item, depth + 1);
      if (cleaned !== undefined) items.push(cleaned);
    }
    return items;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(([key]) => keepKey(key));
    entries.sort((a, b) => rank(a[0]) - rank(b[0]));
    const limit = depth >= 2 ? 12 : 40;
    /** @type {Record<string, unknown>} */
    const out = {};
    let count = 0;
    for (const [key, item] of entries) {
      if (count >= limit) break;
      const cleaned = walk(item, depth + 1);
      if (cleaned === undefined) continue;
      if (Array.isArray(cleaned) && cleaned.length === 0) continue;
      if (
        typeof cleaned === 'object' &&
        cleaned !== null &&
        !Array.isArray(cleaned) &&
        Object.keys(cleaned).length === 0
      ) {
        continue;
      }
      out[key.slice(0, 40)] = cleaned;
      count += 1;
    }
    return out;
  }
  return undefined;
}

/** @param {string} key */
function keepKey(key) {
  if (DROP_KEYS.has(key) || SECRET_KEY.test(key)) return false;
  if (key === 'id' || key.endsWith('_id')) return false;
  return true;
}

/** @param {string} key */
function rank(key) {
  return PREFER.has(key) ? 0 : 1;
}
