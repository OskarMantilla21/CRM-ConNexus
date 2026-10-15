/**
 * Download a product photo or its catalogue PDF. See `$lib/server/v2/files.js`
 * for why this exists rather than a link straight at the file's `/media/` path.
 */
import { streamDownload } from '$lib/server/v2/files.js';

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  const which = event.url.searchParams.get('which') === 'catalog' ? 'catalog' : 'image';
  return streamDownload(event, `/invoices/products/${event.params.id}/file/?which=${which}`, {
    preview: event.url.searchParams.get('preview') === '1'
  });
}
