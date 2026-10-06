import { redirect } from '@sveltejs/kit';
import {
  normalizeLocale,
  LOCALE_COOKIE,
  localeCookieOptions,
  safeNext
} from '$lib/i18n/locale.js';

/**
 * Switch the UI language and come back to the page that asked.
 * Public on purpose: the sign-in screen offers the same choice.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request, cookies, url }) {
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) {
    return new Response('Bad origin', { status: 403 });
  }

  const data = await request.formData();
  cookies.set(LOCALE_COOKIE, normalizeLocale(data.get('locale')), localeCookieOptions());
  throw redirect(303, safeNext(data.get('next')));
}
