import { redirect } from '@sveltejs/kit';

/** The task board is retired. The ticket board is the board that remains. */
export function load() {
  redirect(307, '/tickets/board');
}
