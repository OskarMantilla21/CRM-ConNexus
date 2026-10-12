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
 * @param {string} apiKey
 */
export async function connectAssistant({ cookies }, provider, apiKey) {
  return apiRequest(
    `/assistants/${provider}/connect/`,
    { method: 'POST', body: { api_key: apiKey } },
    { cookies }
  );
}

/**
 * @param {{ cookies: import('@sveltejs/kit').Cookies }} event
 * @param {string} provider
 */
export async function disconnectAssistant({ cookies }, provider) {
  return apiRequest(`/assistants/${provider}/disconnect/`, { method: 'POST', body: {} }, { cookies });
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
 * @param {{ question: string, path: string, screen: Record<string, unknown> }} body
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
