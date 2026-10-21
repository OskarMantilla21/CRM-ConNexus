import { fail, redirect } from '@sveltejs/kit';
// The screen lives on the settings hub. This route only keeps old links.
import { connectAssistant, disconnectAssistant } from '$lib/server/v2/assistants.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/sell.js';

const PROVIDERS = new Set(['gemini', 'grok', 'openai', 'groq']);

/** @param {any} err */
function assistantError(err) {
  const code = err?.body?.error;
  if (code === 'ceo_only') return tx('Only the CEO connects assistants.');
  if (code === 'key_refused') return tx('The key was refused. Check it and try again.');
  if (code === 'not_connected') return tx('Connect that assistant first.');
  return tx('The assistant did not answer. Try again.');
}

/** @type {import('./$types').PageServerLoad} */
export function load() {
  redirect(303, '/settings?area=ia');
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
  }
};
