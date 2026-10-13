import { fail } from '@sveltejs/kit';
import { getToday } from '$lib/server/v2/today.js';
import { getCurrentGoals } from '$lib/server/v2/goals.js';
import {
  askAssistant,
  connectAssistant,
  disconnectAssistant,
  getAssistants
} from '$lib/server/v2/assistants.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/sell.js';

/**
 * Today, plus the goals running today.
 *
 * Two requests in parallel rather than one: `/dashboard/today/` builds the
 * queue and `/opportunities/goals/` the strip, and neither waits on the other.
 * `getCurrentGoals` swallows its own failure, so a goals outage costs the strip
 * and not the page.
 *
 * A CEO also gets the assistant list. A failure there leaves the queue up.
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load(event) {
  const assistantsPromise =
    event.locals.profile?.role === 'CEO'
      ? getAssistants(event).catch(() => ({ assistants: [], unavailable: true }))
      : Promise.resolve(null);
  const [today, goals, assistants] = await Promise.all([
    getToday(event),
    getCurrentGoals(event),
    assistantsPromise
  ]);
  return { ...today, goals, assistants };
}

const PROVIDERS = new Set(['gemini', 'grok']);

/** @param {any} err */
function assistantError(err) {
  const code = err?.body?.error;
  if (code === 'ceo_only') return tx('Only the CEO connects assistants.');
  if (code === 'key_refused') return tx('The key was refused. Check it and try again.');
  if (code === 'not_connected') return tx('Connect that assistant first.');
  return tx('The assistant did not answer. Try again.');
}

/** @type {import('./$types').Actions} */
export const actions = {
  connect: async ({ cookies, request, locals }) => {
    if (locals.profile?.role !== 'CEO') {
      return fail(403, { action: 'connect', error: tx('Only the CEO connects assistants.') });
    }
    const form = await request.formData();
    const provider = form.get('provider')?.toString() || '';
    const apiKey = form.get('api_key')?.toString().trim() || '';
    if (!PROVIDERS.has(provider) || apiKey.length < 8) {
      return fail(400, {
        action: 'connect',
        provider,
        error: tx('The key was refused. Check it and try again.')
      });
    }
    try {
      await connectAssistant({ cookies }, provider, apiKey);
    } catch (err) {
      return fail(err?.status === 403 ? 403 : 400, {
        action: 'connect',
        provider,
        error: assistantError(err)
      });
    }
    return { action: 'connect', provider, connected: true };
  },

  disconnect: async ({ cookies, request, locals }) => {
    if (locals.profile?.role !== 'CEO') {
      return fail(403, { action: 'disconnect', error: tx('Only the CEO connects assistants.') });
    }
    const form = await request.formData();
    const provider = form.get('provider')?.toString() || '';
    if (!PROVIDERS.has(provider)) {
      return fail(400, { action: 'disconnect', error: tx('The assistant did not answer. Try again.') });
    }
    try {
      await disconnectAssistant({ cookies }, provider);
    } catch (err) {
      return fail(400, { action: 'disconnect', provider, error: assistantError(err) });
    }
    return { action: 'disconnect', provider };
  },

  ask: async ({ cookies, request, locals }) => {
    if (locals.profile?.role !== 'CEO') {
      return fail(403, { action: 'ask', error: tx('Only the CEO connects assistants.') });
    }
    const form = await request.formData();
    const provider = form.get('provider')?.toString() || '';
    let question = form.get('question')?.toString().trim() || '';
    if (!question) {
      const lang = cookies.get('crm_lang') || 'es';
      question =
        lang === 'en'
          ? 'What needs me today?'
          : lang === 'pt-BR'
            ? 'O que está pendente?'
            : 'Qué tengo pendiente';
    }
    if (!PROVIDERS.has(provider)) {
      return fail(400, { action: 'ask', error: tx('Connect that assistant first.') });
    }
    try {
      const res = await askAssistant({ cookies }, provider, question);
      return { action: 'ask', provider, answer: res?.answer || '', question };
    } catch (err) {
      return fail(err?.status === 403 ? 403 : 400, {
        action: 'ask',
        provider,
        question,
        error: assistantError(err)
      });
    }
  }
};
