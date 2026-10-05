import { env as publicEnv } from '$env/dynamic/public';
import { isRedirect, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { describeError } from '$lib/server/log-safe.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const jwtAccess = cookies.get('jwt_access');
  if (!jwtAccess) {
    throw redirect(307, '/login');
  }

  const apiUrl = publicEnv.PUBLIC_DJANGO_API_URL;
  try {
    const me = await axios.get(`${apiUrl}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${jwtAccess}` }
    });
    if (!me.data.is_platform_admin) {
      throw redirect(303, '/org');
    }
    const response = await axios.get(`${apiUrl}/api/platform/users/`, {
      headers: { Authorization: `Bearer ${jwtAccess}` }
    });
    return { users: response.data.users ?? [], error: '' };
  } catch (error) {
    if (isRedirect(error)) throw error;
    console.error('Error fetching the user directory:', describeError(error));
    return { users: [], error: 'No se pudo cargar el directorio de usuarios.' };
  }
}
