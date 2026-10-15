/**
 * Reaching an uploaded file, without handing the browser a `/media/` URL.
 *
 * The four modules that render attachments used to resolve `file_path`
 * against the Django origin and put that straight in an `href`. Two things
 * were wrong with it. A cross-origin `<a href>` carries neither the JWT nor
 * the SvelteKit session cookie, so the link 403s for the person who is
 * allowed to open the file; and where it does resolve, `/media/` is guarded
 * only by "has an org context", which is every signed-in user of every
 * tenant. The link was broken for its owner and open to everybody else.
 *
 * So the client never sees a storage path. It gets a route on this origin,
 * which streams the file from an authenticated backend endpoint that checks
 * the record's own read predicate first.
 */
import { env } from '$env/dynamic/public';

const API_BASE_URL = `${env.PUBLIC_DJANGO_API_URL}/api`;

/**
 * Where a page links to download one attachment.
 *
 * @param {string|null|undefined} id
 * @returns {string|null} null when there is nothing to link to, so callers
 *   can keep rendering the name as plain text rather than a dead link.
 */
export function attachmentHref(id) {
  return id ? `/api/attachments/${id}/download` : null;
}

/**
 * Where a page links to download a document's file.
 *
 * @param {string|null|undefined} id
 * @returns {string|null}
 */
export function documentHref(id) {
  return id ? `/api/documents/${id}/download` : null;
}

/**
 * Where a page links to a product photo or its catalogue PDF.
 *
 * `which` is `image` or `catalog`. The route streams the file; add
 * `&preview=1` to draw a photo or a PDF in the page.
 *
 * @param {string|null|undefined} id
 * @param {'image' | 'catalog'} which
 * @returns {string|null}
 */
export function productFileHref(id, which) {
  if (!id) return null;
  const slot = which === 'catalog' ? 'catalog' : 'image';
  return `/api/invoices/products/${id}/file?which=${slot}`;
}

/**
 * Extensions a preview may render in the page. HTML and SVG stay a download:
 * same-origin inline HTML would run as this app.
 */
const PREVIEW_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  txt: 'text/plain; charset=utf-8',
  csv: 'text/plain; charset=utf-8',
  md: 'text/plain; charset=utf-8'
};

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

/**
 * @param {{ cookies: import('@sveltejs/kit').Cookies, request: Request }} event
 * @param {string} path
 * @param {{ preview?: boolean }} [options] `preview` serves an image, PDF or
 *   plain text inline. Anything else keeps the download disposition.
 */
export async function streamDownload({ cookies, request }, path, options = {}) {
  const accessToken = cookies.get('jwt_access');
  if (!accessToken) return new Response('Unauthorized', { status: 401 });

  const upstream = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: request.signal
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Could not download that file.', {
      status: upstream.status || 502
    });
  }

  const upstreamType = upstream.headers.get('Content-Type') || 'application/octet-stream';
  const upstreamDisposition = upstream.headers.get('Content-Disposition') || 'attachment';
  let contentType = upstreamType;
  let disposition = upstreamDisposition;
  if (options.preview) {
    const name = filenameFromDisposition(upstreamDisposition);
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    const safe = PREVIEW_TYPES[ext];
    if (safe) {
      contentType = safe;
      disposition = `inline; filename="${name.replace(/[\r\n"]/g, '')}"`;
    }
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': disposition,
      'X-Content-Type-Options': 'nosniff',
      // The response is one tenant's private file. Nothing in front of this
      // may keep a copy of it.
      'Cache-Control': 'private, no-store'
    }
  });
}
