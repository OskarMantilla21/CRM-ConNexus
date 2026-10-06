/**
 * Sign-in page.
 *
 * The form posts a username and a password to Django `POST /api/auth/password/`
 * and stores the JWT in httpOnly cookies. A Google redirect that is already
 * in flight still finishes through `/api/auth/google/callback/`.
 */

import axios from 'axios';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { describeError } from '$lib/server/log-safe.js';
import { relayHeaders } from '$lib/server/relay.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/public.js';

// Cookie configuration
const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax'
};

/**
 * Get secure cookie options based on environment
 * @param {number} maxAge - Cookie max age in seconds
 * @returns {object} Cookie options with secure flag for production
 */
function getCookieOptions(maxAge) {
  return {
    ...COOKIE_OPTIONS,
    secure: env.NODE_ENV === 'production',
    maxAge
  };
}

/** @type {import('@sveltejs/kit').ServerLoad} */
export async function load({ url, cookies, getClientAddress, request }) {
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  // Handle OAuth error returned from Google
  if (error) {
    console.error('Google OAuth error:', error, errorDescription);
    return {
      google_url: null,
      error: errorDescription || `OAuth error: ${error}`
    };
  }

  // Handle OAuth callback with authorization code
  if (code) {
    return handleOAuthCallback(code, returnedState, cookies, { getClientAddress, request });
  }

  // Check if user is already authenticated
  const jwtAccess = cookies.get('jwt_access');
  if (jwtAccess) {
    throw redirect(307, '/org');
  }

  return {};
}

/**
 * Handle the OAuth callback when Google redirects back with an authorization code
 * @param {string} code - Authorization code from Google
 * @param {string|null} returnedState - State parameter returned from Google
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies
 * @param {{ getClientAddress: () => string, request: Request }} visitor - Who the API's audit row records
 */
async function handleOAuthCallback(code, returnedState, cookies, visitor) {
  // Retrieve and immediately clear OAuth cookies (one-time use)
  const savedState = cookies.get('oauth_state');
  const codeVerifier = cookies.get('oauth_code_verifier');

  // Clear OAuth cookies regardless of outcome
  cookies.delete('oauth_state', { path: '/' });
  cookies.delete('oauth_code_verifier', { path: '/' });

  // Validate state parameter (CSRF protection)
  if (!savedState || savedState !== returnedState) {
    console.error('OAuth state mismatch - possible CSRF attack');
    console.error('Expected:', savedState?.substring(0, 10) + '...');
    console.error('Received:', returnedState?.substring(0, 10) + '...');
    throw redirect(307, '/login?error=state_mismatch');
  }

  // Validate code verifier exists
  if (!codeVerifier) {
    console.error('Missing PKCE code verifier - session may have expired');
    throw redirect(307, '/login?error=session_expired');
  }

  const redirect_uri = env.GOOGLE_LOGIN_DOMAIN + '/login';

  try {
    // Exchange code for tokens via Django backend
    // The backend handles the actual token exchange with Google using the client secret
    const apiUrl = publicEnv.PUBLIC_DJANGO_API_URL;
    console.log('Using API URL:', apiUrl);
    const response = await axios.post(
      `${apiUrl}/api/auth/google/callback/`,
      {
        code,
        code_verifier: codeVerifier,
        redirect_uri
      },
      {
        // The sign-in audit row, success or failure, records who signed in,
        // and failures are capped per address; see `$lib/server/relay.js`.
        headers: { 'Content-Type': 'application/json', ...relayHeaders(visitor) },
        timeout: 30000
      }
    );

    const { access_token, refresh_token } = response.data;

    // Store JWT tokens in secure httpOnly cookies
    cookies.set('jwt_access', access_token, getCookieOptions(60 * 60 * 24)); // 1 day
    cookies.set('jwt_refresh', refresh_token, getCookieOptions(60 * 60 * 24 * 365)); // 1 year
  } catch (error) {
    // Never log the raw error or the response body: the axios `config.data` for
    // this call is the authorization code plus the PKCE code_verifier, and a
    // token endpoint's response body can carry tokens.
    console.error('OAuth token exchange failed:', describeError(error));
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';

    // Provide user-friendly error messages
    let userError = 'auth_failed';
    const errStr = String(errorMessage);
    if (errStr.includes('code_verifier')) {
      userError = 'pkce_failed';
    } else if (errStr.includes('expired')) {
      userError = 'code_expired';
    }
    // Log the classification, not errorMessage: that string comes from the
    // token endpoint's response body, which does not belong in logs.
    console.error('OAuth failure classified as:', userError);

    throw redirect(307, `/login?error=${userError}`);
  }

  // Success - redirect to organization selection
  throw redirect(307, '/org');
}

/** @type {import('@sveltejs/kit').Actions} */
export const actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const formData = await request.formData();
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!username || !password) {
      return fail(400, { error: tx('Username and password are required') });
    }

    try {
      const apiUrl = publicEnv.PUBLIC_DJANGO_API_URL;
      const response = await axios.post(
        `${apiUrl}/api/auth/password/`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
            ...relayHeaders({ getClientAddress, request })
          },
          timeout: 10000
        }
      );
      const { access_token, refresh_token } = response.data;
      cookies.set('jwt_access', access_token, getCookieOptions(60 * 60 * 24));
      cookies.set('jwt_refresh', refresh_token, getCookieOptions(60 * 60 * 24 * 365));
    } catch (error) {
      const status = error.response?.status;
      const apiError = error.response?.data?.error;
      if (status === 429) {
        return fail(429, {
          error: tx('Too many sign-in attempts. Wait a few minutes and try again.')
        });
      }
      if (status === 403 && apiError === 'User account is disabled') {
        return fail(403, { error: tx('User account is disabled') });
      }
      return fail(400, { error: tx('Invalid username or password') });
    }

    throw redirect(303, '/org');
  }
};
