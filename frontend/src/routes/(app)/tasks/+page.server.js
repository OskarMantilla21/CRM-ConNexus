import { redirect } from '@sveltejs/kit';

/**
 * The task list is retired. New work is a ticket, and the queue carries the
 * overdue and due-this-week cards this page used to show.
 *
 * @type {import('./$types').PageServerLoad}
 */
export function load() {
  redirect(307, '/tickets');
}
