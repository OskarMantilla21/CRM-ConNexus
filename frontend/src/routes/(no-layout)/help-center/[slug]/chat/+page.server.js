/**
 * The public sales and support chat for one help center.
 *
 * Anonymous, like the article pages. The page load only checks that this
 * center is published and reads its name. The reply is produced by the API,
 * which keeps the instructions and the connected key on the server.
 */

import { fail } from '@sveltejs/kit';
import { canonicalSlug, getHelpCenter, postHelpChat } from '$lib/server/help-center.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/public.js';

/** @param {string} raw */
function cleanHistory(raw) {
  /** @type {{ role: string, content: string }[]} */
  let parsed = [];
  try {
    const value = JSON.parse(raw);
    if (Array.isArray(value)) parsed = value;
  } catch {
    parsed = [];
  }
  /** @type {{ role: string, content: string }[]} */
  const turns = [];
  for (const item of parsed) {
    if (!item || (item.role !== 'user' && item.role !== 'assistant')) continue;
    const content = String(item.content || '')
      .trim()
      .slice(0, 500);
    if (content) turns.push({ role: item.role, content });
  }
  return turns.slice(-8);
}

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const slug = canonicalSlug(event.params.slug, event.url);
  const data = await getHelpCenter(event, slug);
  return {
    slug,
    name: data.name,
    canonical: `${event.url.origin}/help-center/${slug}/chat`
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const slug = canonicalSlug(event.params.slug, event.url);
    const form = await event.request.formData();
    const message = String(form.get('message') || '').trim();
    const history = cleanHistory(String(form.get('history') || '[]'));
    if (!message) {
      return fail(400, {
        error: tx('Write a message.'),
        messages: history,
        message: ''
      });
    }
    try {
      const data = await postHelpChat(event, slug, {
        message: message.slice(0, 500),
        history
      });
      if (!data.reply) {
        return fail(502, {
          error: tx('The assistant did not answer. Try again shortly.'),
          messages: history,
          message
        });
      }
      return {
        messages: [
          ...history,
          { role: 'user', content: message.slice(0, 500) },
          { role: 'assistant', content: data.reply }
        ].slice(-8),
        transferred: data.transferred,
        message: ''
      };
    } catch (err) {
      const status = /** @type {{ status?: number }} */ (err).status;
      if (status === 404) throw err;
      const text =
        status === 429
          ? tx('Too many requests. Try again shortly.')
          : tx('The assistant did not answer. Try again shortly.');
      return fail(status === 429 ? 429 : 502, {
        error: text,
        messages: history,
        message
      });
    }
  }
};
