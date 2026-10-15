import { redirect } from '@sveltejs/kit';

/**
 * Tasks are no longer created. A bookmark or a stale form lands on a new ticket.
 *
 * @type {import('./$types').PageServerLoad}
 */
export function load() {
  redirect(307, '/tickets/new');
}

/** @type {import('./$types').Actions} */
export const actions = {
  create: async () => {
    redirect(303, '/tickets/new');
  }
};
