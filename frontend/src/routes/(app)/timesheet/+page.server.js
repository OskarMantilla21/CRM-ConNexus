import { fail } from '@sveltejs/kit';
import { getTimesheet, listJobs, logDailyWork, stopTimer } from '$lib/server/v2/timesheet.js';
import { readableError } from '$lib/server/v2/form-errors.js';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/public.js';

/**
 * `?start=&end=` (YYYY-MM-DD) pick the week; absent, the API picks this week
 * in the org's timezone. The week-nav buttons drive those params.
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load({ cookies, url }) {
  const start = url.searchParams.get('start') || undefined;
  const end = url.searchParams.get('end') || undefined;
  const [sheet, jobs] = await Promise.all([
    getTimesheet({ cookies }, { start, end }),
    listJobs({ cookies }).catch(() => [])
  ]);
  return { ...sheet, jobs };
}

/** @type {import('./$types').Actions} */
export const actions = {
  async stop(event) {
    const form = await event.request.formData();
    const entryId = form.get('entry_id')?.toString() ?? '';

    try {
      await stopTimer(event, entryId);
    } catch (/** @type {any} */ err) {
      return fail(400, { error: readableError(err, tx('Could not stop the timer.')) });
    }

    return { stopped: true };
  },

  /**
   * Minutes of work done today, on one job. The API owns the entry: it is
   * closed, not billable, and it belongs to the person submitting it.
   */
  async log(event) {
    const form = await event.request.formData();
    const caseId = form.get('case_id')?.toString() ?? '';
    const description = form.get('description')?.toString().trim() ?? '';
    const minutes = Number(form.get('minutes'));
    if (!caseId || !description || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
      return fail(400, {
        logError: tx('Choose a job, describe the work, and give the minutes.')
      });
    }
    try {
      await logDailyWork(event, { caseId, minutes, description });
    } catch (/** @type {any} */ err) {
      return fail(400, { logError: readableError(err, tx('Could not log that work.')) });
    }
    return { logged: true };
  }
};
