import { redirect } from '@sveltejs/kit';

/** The task calendar is retired. Dated work is the ticket queue. */
export function load() {
  redirect(307, '/tickets');
}
