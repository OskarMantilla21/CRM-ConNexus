import { fail } from '@sveltejs/kit';
import { getSettingsHub } from '$lib/server/v2/settings.js';
import {
  getAssistants,
  connectAssistant,
  disconnectAssistant,
  testAssistant,
  saveAssistantSettings
} from '$lib/server/v2/assistants.js';
import { listTimezones, updateOrgSettings, viewerIsAdmin } from '$lib/server/v2/organization.js';
import { listAuditLog } from '$lib/server/v2/audit-log.js';
import { actorFromCookies, inviteUser } from '$lib/server/v2/team.js';
import { readableError } from '$lib/server/v2/form-errors.js';
import { ALL_PERMISSIONS } from '$lib/access.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/sell.js';
import '$lib/i18n/pages/bill.js';

const PROVIDERS = new Set(['gemini', 'grok', 'openai', 'groq', 'custom']);
const KEY_PROVIDERS = new Set([
  ...PROVIDERS,
  'groq',
  'openrouter',
  'deepseek',
  'anthropic'
]);
const LOGO_LIMIT = 2 * 1024 * 1024;

/** @param {any} err */
function assistantError(err) {
  const code = err?.body?.error;
  if (code === 'ceo_only') return tx('Only the CEO connects assistants.');
  if (code === 'key_refused') return tx('The key was refused. Check it and try again.');
  if (code === 'not_connected') return tx('Connect that assistant first.');
  if (code === 'invalid') return tx('Check the model and the token limit.');
  if (code === 'address') return tx('Check the name, the address and the model.');
  if (code === 'unreachable') return tx('The assistant did not answer. Try again.');
  return tx('The assistant did not answer. Try again.');
}

/**
 * @param {FormData} form
 */
function runtimeFromForm(form) {
  const model = form.get('model')?.toString() || '';
  const raw = form.get('max_output_tokens')?.toString().trim() || '';
  /** @type {Record<string, unknown>} */
  const body = {};
  if (model) body.model = model;
  if (raw) {
    const limit = Number(raw);
    if (!Number.isInteger(limit)) return null;
    body.max_output_tokens = limit;
  }
  return body;
}

/**
 * Name and address for the other-AI card. Built-in providers send neither.
 *
 * @param {FormData} form
 * @param {string} provider
 */
function customFromForm(form, provider) {
  if (provider !== 'custom') return { ok: true, fields: {} };
  const name = form.get('label')?.toString().trim() || '';
  const baseUrl = form.get('base_url')?.toString().trim() || '';
  if (!name || !baseUrl) return { ok: false, fields: {} };
  return { ok: true, fields: { name, base_url: baseUrl } };
}

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const parent = await event.parent();
  const area = event.url.searchParams.get('area') || 'general';
  const hub = await getSettingsHub(event);
  const role = parent.role ?? event.locals.profile?.role ?? '';

  /** @type {any} */
  let assistants = null;
  if (role === 'CEO') {
    try {
      assistants = await getAssistants(event);
    } catch {
      assistants = { assistants: [], unavailable: true };
    }
  }

  const timezones =
    area === 'general'
      ? await listTimezones(event.cookies).catch(() => [{ name: 'UTC', label: 'UTC' }])
      : [];

  const audit = area === 'seguridad' ? await listAuditLog(event, {}, 0) : null;

  return {
    ...hub,
    area,
    role,
    can_edit: viewerIsAdmin(event.cookies),
    timezones,
    assistants,
    audit,
    actor: actorFromCookies(event.cookies)
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  test: async ({ cookies, request, locals }) => {
    if (locals.profile?.role !== 'CEO') {
      return fail(403, { action: 'test', error: tx('Only the CEO connects assistants.') });
    }
    const form = await request.formData();
    const provider = form.get('provider')?.toString() || '';
    const runtime = runtimeFromForm(form);
    const custom = customFromForm(form, provider);
    if (!PROVIDERS.has(provider) || !runtime || !custom.ok || (provider === 'custom' && !runtime.model)) {
      return fail(400, {
        action: 'test',
        provider,
        error:
          provider === 'custom'
            ? tx('Check the name, the address and the model.')
            : tx('Check the model and the token limit.')
      });
    }
    const apiKey = form.get('api_key')?.toString().trim() || '';
    /** @type {Record<string, unknown>} */
    const body = { ...runtime, ...custom.fields };
    if (apiKey) body.api_key = apiKey;
    try {
      await testAssistant({ cookies }, provider, body);
    } catch (/** @type {any} */ err) {
      return fail(err?.status === 403 ? 403 : 400, {
        action: 'test',
        provider,
        error: assistantError(err)
      });
    }
    return { action: 'test', provider, ok: true };
  },

  connect: async ({ cookies, request, locals }) => {
    if (locals.profile?.role !== 'CEO') {
      return fail(403, { action: 'connect', error: tx('Only the CEO connects assistants.') });
    }
    const form = await request.formData();
    const provider = form.get('provider')?.toString() || '';
    const apiKey = form.get('api_key')?.toString().trim() || '';
    const runtime = runtimeFromForm(form);
    const custom = customFromForm(form, provider);
    const keyOk = provider === 'custom' ? apiKey.length === 0 || (apiKey.length >= 8 && apiKey.length <= 512) : apiKey.length >= 8;
    if (provider === 'custom' && (!custom.ok || !runtime?.model)) {
      return fail(400, {
        action: 'connect',
        provider,
        error: tx('Check the name, the address and the model.')
      });
    }
    if (!PROVIDERS.has(provider) || !keyOk || !runtime) {
      return fail(400, {
        action: 'connect',
        provider,
        error: tx('The key was refused. Check it and try again.')
      });
    }
    /** @type {Record<string, unknown>} */
    const body = { ...runtime, ...custom.fields };
    if (apiKey) body.api_key = apiKey;
    try {
      await connectAssistant({ cookies }, provider, body);
    } catch (/** @type {any} */ err) {
      return fail(err?.status === 403 ? 403 : 400, {
        action: 'connect',
        provider,
        error: assistantError(err)
      });
    }
    return { action: 'connect', provider, connected: true };
  },

  limits: async ({ cookies, request, locals }) => {
    if (locals.profile?.role !== 'CEO') {
      return fail(403, { action: 'limits', error: tx('Only the CEO connects assistants.') });
    }
    const form = await request.formData();
    const provider = form.get('provider')?.toString() || '';
    const runtime = runtimeFromForm(form);
    const custom = customFromForm(form, provider);
    if (!PROVIDERS.has(provider) || !runtime || !custom.ok || (provider === 'custom' && !runtime.model)) {
      return fail(400, {
        action: 'limits',
        provider,
        error:
          provider === 'custom'
            ? tx('Check the name, the address and the model.')
            : tx('Check the model and the token limit.')
      });
    }
    try {
      await saveAssistantSettings({ cookies }, { providers: { [provider]: { ...runtime, ...custom.fields } } });
    } catch (/** @type {any} */ err) {
      return fail(400, { action: 'limits', provider, error: assistantError(err) });
    }
    return { action: 'limits', provider, saved: true };
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
    } catch (/** @type {any} */ err) {
      return fail(400, { action: 'disconnect', provider, error: assistantError(err) });
    }
    return { action: 'disconnect', provider };
  },

  defaultProvider: async ({ cookies, request, locals }) => {
    if (locals.profile?.role !== 'CEO') {
      return fail(403, { action: 'default', error: tx('Only the CEO connects assistants.') });
    }
    const form = await request.formData();
    const provider = form.get('default_provider')?.toString() || '';
    if (provider && !KEY_PROVIDERS.has(provider)) {
      return fail(400, { action: 'default', error: tx('Check the model and the token limit.') });
    }
    try {
      await saveAssistantSettings({ cookies }, { default_provider: provider });
    } catch (/** @type {any} */ err) {
      return fail(400, { action: 'default', error: assistantError(err) });
    }
    return { action: 'default', saved: true };
  },

  saveGeneral: async ({ cookies, request }) => {
    const form = await request.formData();

    if (!viewerIsAdmin(cookies)) {
      return { action: 'general', saved: true };
    }

    const logo = form.get('logo');
    if (logo && typeof logo === 'object' && 'size' in logo && logo.size > LOGO_LIMIT) {
      return fail(400, { action: 'general', error: tx('PNG, JPEG or WebP, up to 2 MB.') });
    }

    const body = new FormData();
    for (const field of ['name', 'company_name', 'timezone', 'default_currency']) {
      body.append(field, form.get(field)?.toString().trim() ?? '');
    }
    if (logo && typeof logo === 'object' && 'size' in logo && logo.size > 0) {
      body.append('logo', logo);
    }

    try {
      await updateOrgSettings({ cookies }, body);
    } catch (/** @type {any} */ err) {
      if (err?.status === 403) {
        return fail(403, {
          action: 'general',
          error: tx('Only an admin can change organization settings.')
        });
      }
      return fail(400, {
        action: 'general',
        error: tx(readableError(err, 'Could not save these settings.'))
      });
    }
    return { action: 'general', saved: true };
  },

  /**
   * An administrator account. Employees are created on the employee screen.
   */
  invite: async ({ cookies, request }) => {
    const form = await request.formData();
    const actor = actorFromCookies(cookies);
    if (!actor.can_manage_administrators) {
      return fail(403, { invite: { error: tx('You can only create employee profiles.') } });
    }
    const name = form.get('name')?.toString().trim() ?? '';
    const username = form.get('username')?.toString().trim() ?? '';
    const password = form.get('password')?.toString() ?? '';
    if (!name) return fail(400, { invite: { error: tx('Enter a name.') } });
    if (!username) return fail(400, { invite: { error: tx('Enter a username.') } });
    if (password.length < 8) {
      return fail(400, { invite: { error: tx('Enter a password of at least 8 characters.') } });
    }
    let email = username;
    if (!username.includes('@')) {
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(username)) {
        return fail(400, { invite: { error: tx('Use letters, numbers, dots or hyphens.') } });
      }
      email = `${username.toLowerCase()}@connexus.local`;
    }
    const granted = form
      .getAll('permissions')
      .map((value) => value.toString())
      .filter((key) => ALL_PERMISSIONS.includes(key));
    try {
      const created = await inviteUser({ cookies }, {
        email,
        role: 'ADMIN',
        name,
        password,
        granted_permissions: granted
      });
      const signInAs = username.includes('@') ? username : username.toLowerCase();
      return { invited: signInAs, reused: created?.reused === true };
    } catch (/** @type {any} */ err) {
      return fail(err?.status === 403 ? 403 : 400, {
        invite: { error: tx(readableError(err, 'Could not create that profile.')) }
      });
    }
  }
};
