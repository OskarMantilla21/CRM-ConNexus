import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { tx } from '$lib/i18n/translate.js';
import '$lib/i18n/pages/bill.js';

/**
 * Stream an invoice PDF from the API.
 *
 * The PDF endpoint is authenticated with the bearer token, which lives in an
 * httpOnly cookie the browser never sends to the API host, so a plain
 * `<a href>` straight to `:8000/api/.../pdf/` would arrive unauthenticated and
 * 401. This server route carries the token for the browser and pipes the bytes
 * back. Authorization is still the API's call: `get_invoice_or_error` runs on
 * the far side, so a member who may not see the invoice gets a 404 here too.
 *
 * `?preview=1` draws that same PDF in the page (the list thumbnail and the
 * detail preview). The API always sends `attachment`, which makes a browser
 * download the file instead of painting it in an iframe, so the preview
 * answers `inline` and only when the bytes are actually a PDF. Anything else
 * stays a download. `v` is a cache-buster the page adds when the invoice
 * changes; this route does not forward it.
 */

/** @param {string | null} header */
function filenameFromDisposition(header) {
  if (!header) return '';
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star) {
    try {
      return decodeURIComponent(star[1].replace(/"/g, ''));
    } catch {
      return star[1];
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain ? plain[1] : '';
}

/** @param {string} name */
function safePdfName(name) {
  const clean = (name || 'invoice.pdf').replace(/[\r\n"]/g, '').replace(/[\\/]/g, '');
  return clean.toLowerCase().endsWith('.pdf') ? clean : 'invoice.pdf';
}

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ params, cookies, request, url }) {
  const token = cookies.get('jwt_access');
  if (!token) error(401, tx('Not signed in.'));

  const upstream = await fetch(`${env.PUBLIC_DJANGO_API_URL}/api/invoices/${params.id}/pdf/`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: request.signal
  });

  if (!upstream.ok || !upstream.body) {
    // 403/404 collapse to 404: do not confirm an invoice exists to someone who
    // may not read it. 503 means WeasyPrint is missing on the server.
    if (upstream.status === 403 || upstream.status === 404) {
      error(404, tx('That invoice does not exist, or you do not have access to it.'));
    }
    error(502, tx('Could not generate the PDF.'));
  }

  const upstreamType = upstream.headers.get('Content-Type') || '';
  const upstreamDisposition = upstream.headers.get('Content-Disposition') || '';
  const isPdf = upstreamType.toLowerCase().includes('application/pdf');
  const filename = safePdfName(filenameFromDisposition(upstreamDisposition));
  const preview = url.searchParams.get('preview') === '1' && isPdf;

  return new Response(upstream.body, {
    headers: {
      'Content-Type': isPdf ? 'application/pdf' : 'application/octet-stream',
      'Content-Disposition': preview
        ? `inline; filename="${filename}"`
        : upstreamDisposition || `attachment; filename="${filename}"`,
      'X-Content-Type-Options': 'nosniff',
      // One tenant's invoice. A shared cache must not keep it. The browser may
      // reuse this exact URL for a minute; the page changes `v` when the
      // invoice changes, so a payment does not keep painting the old PDF.
      'Cache-Control': 'private, max-age=60'
    }
  });
}
