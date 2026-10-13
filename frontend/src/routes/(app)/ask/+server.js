/**
 * The screen bar posts here so the browser never talks to the model and the
 * key stays on the API. The body is the question plus the data already on
 * the open page.
 */

import { json } from '@sveltejs/kit';
import { askScreen } from '$lib/server/v2/assistants.js';
import { cleanVisible, screenBrief } from '$lib/screen-brief.js';

/**
 * @param {unknown} screen
 */
function briefForApi(screen) {
  const brief = /** @type {Record<string, unknown>} */ (screenBrief(screen));
  const visible = cleanVisible(
    screen && typeof screen === 'object' ? /** @type {{ visible?: unknown }} */ (screen).visible : ''
  );
  if (visible) brief.visible = visible;
  return brief;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
  /** @type {{ question?: unknown, path?: unknown, screen?: unknown }} */
  let payload = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }
  const question = String(payload.question || '').trim();
  if (!question) return json({ error: 'empty' }, { status: 400 });
  try {
    const data = await askScreen(
      { cookies },
      {
        question: question.slice(0, 400),
        path: String(payload.path || '/').slice(0, 200),
        screen: briefForApi(payload.screen)
      }
    );
    return json({
      answer: typeof data?.answer === 'string' ? data.answer : '',
      provider: typeof data?.provider === 'string' ? data.provider : ''
    });
  } catch (err) {
    const status = /** @type {{ status?: number, body?: { error?: string } }} */ (err).status;
    const code = /** @type {{ body?: { error?: string } }} */ (err).body?.error;
    if (status === 429) return json({ error: 'busy' }, { status: 429 });
    if (code === 'not_connected' || code === 'empty') return json({ error: code }, { status: 400 });
    return json({ error: 'unavailable' }, { status: 502 });
  }
}
