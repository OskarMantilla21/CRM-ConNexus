/**
 * The CEO's assistants on Today.
 *
 * Server-only. The API key is posted straight through to Django and is not
 * kept here. The list never includes a key.
 */
import { apiRequest } from '$lib/api-helpers.js';

/**
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 */
export async function getAssistants({ cookies }) {
  return apiRequest('/assistants/', {}, { cookies });
}

/**
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} provider
 * @param {string | Record<string, unknown>} apiKeyOrBody
 */
export async function connectAssistant({ cookies }, provider, apiKeyOrBody) {
  const body = typeof apiKeyOrBody === 'string' ? { api_key: apiKeyOrBody } : apiKeyOrBody;
  return apiRequest(`/assistants/${provider}/connect/`, { method: 'POST', body }, { cookies });
}

/**
 * Paste a key. The API names the assistant from the key and stores it.
 * The key is not kept in this module and is not in the response.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} apiKey
 */
export async function connectFromKey({ cookies }, apiKey) {
  return apiRequest('/assistants/from-key/', { method: 'POST', body: { api_key: apiKey } }, { cookies });
}

/**
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} provider
 */
export async function disconnectAssistant({ cookies }, provider) {
  return apiRequest(`/assistants/${provider}/disconnect/`, { method: 'POST', body: {} }, { cookies });
}

/**
 * Prove a key without storing it. Omit `apiKey` to retest the stored one.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} provider
 * @param {{ api_key?: string, model?: string, max_output_tokens?: number }} body
 */
export async function testAssistant({ cookies }, provider, body) {
  return apiRequest(`/assistants/${provider}/test/`, { method: 'POST', body }, { cookies });
}

/**
 * Default provider, model and token cap. This body has no key.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {Record<string, unknown>} body
 */
export async function saveAssistantSettings({ cookies }, body) {
  return apiRequest('/assistants/settings/', { method: 'POST', body }, { cookies });
}

/**
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} provider
 * @param {string} question
 */
/**
 * Whether this org has an assistant the screen bar can call. No key.
 *
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 */
export async function getScreenAssistant({ cookies }) {
  return apiRequest('/assistants/screen/', {}, { cookies });
}

/**
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {{ question: string, path: string, screen: Record<string, unknown>, model?: string, attachment?: string, filename?: string }} body
 */
export async function askScreen({ cookies }, body) {
  return apiRequest('/assistants/screen/', { method: 'POST', body }, { cookies });
}

export async function askAssistant({ cookies }, provider, question) {
  return apiRequest(
    `/assistants/${provider}/ask/`,
    { method: 'POST', body: { question } },
    { cookies }
  );
}
