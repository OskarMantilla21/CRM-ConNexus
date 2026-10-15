/**
 * The invoice PDF proxy. Preview paints the file in the page; download keeps
 * the API's attachment disposition. A caller who may not read the invoice
 * learns nothing from a 403.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isHttpError } from '@sveltejs/kit';

vi.mock('$env/dynamic/public', () => ({
  env: { PUBLIC_DJANGO_API_URL: 'http://api.test' }
}));

const { GET } = await import('./+server.js');

/** @type {import('vitest').Mock} */
let fetchMock;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

/**
 * @param {string} path
 * @param {string | undefined} token
 */
function event(path, token = 'tok') {
  const url = new URL(`http://app.test${path}`);
  return /** @type {any} */ ({
    params: { id: 'inv-1' },
    url,
    cookies: { get: (/** @type {string} */ key) => (key === 'jwt_access' ? token : undefined) },
    request: new Request(url)
  });
}

function pdfUpstream(status, headers = {}) {
  return new Response(status === 200 ? '%PDF-1.4' : null, {
    status,
    headers: { 'Content-Type': 'application/pdf', ...headers }
  });
}

describe('invoice PDF route', () => {
  it('refuses without a token instead of asking the API anonymously', async () => {
    // An explicit empty string: a missing argument would take the default token.
    try {
      await GET(event('/invoices/inv-1/pdf', ''));
      expect.unreachable();
    } catch (err) {
      expect(isHttpError(err) && err.status).toBe(401);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('draws a PDF inline for a preview and does not forward the cache-buster', async () => {
    fetchMock.mockResolvedValue(
      pdfUpstream(200, {
        'Content-Disposition': 'attachment; filename="Invoice_INV-1.pdf"'
      })
    );

    const response = await GET(event('/invoices/inv-1/pdf?preview=1&v=abc'));

    expect(fetchMock.mock.calls[0][0]).toBe('http://api.test/api/invoices/inv-1/pdf/');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer tok');
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(response.headers.get('Content-Disposition')).toBe(
      'inline; filename="Invoice_INV-1.pdf"'
    );
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Cache-Control')).toContain('private');
  });

  it('keeps the download as an attachment', async () => {
    fetchMock.mockResolvedValue(
      pdfUpstream(200, { 'Content-Disposition': 'attachment; filename="Invoice_INV-1.pdf"' })
    );

    const response = await GET(event('/invoices/inv-1/pdf'));

    expect(response.headers.get('Content-Disposition')).toBe(
      'attachment; filename="Invoice_INV-1.pdf"'
    );
  });

  it('does not paint a non-PDF inline', async () => {
    fetchMock.mockResolvedValue(
      new Response('<html></html>', {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': 'attachment; filename="invoice.html"'
        }
      })
    );

    const response = await GET(event('/invoices/inv-1/pdf?preview=1'));

    expect(response.headers.get('Content-Type')).toBe('application/octet-stream');
    expect(response.headers.get('Content-Disposition')).toContain('attachment');
  });

  it('hides an invoice the caller may not read', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 403 }));
    try {
      await GET(event('/invoices/inv-1/pdf'));
      expect.unreachable();
    } catch (err) {
      expect(isHttpError(err)).toBe(true);
      if (isHttpError(err)) expect(err.status).toBe(404);
    }
  });

  it('says when the PDF could not be generated', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));
    try {
      await GET(event('/invoices/inv-1/pdf'));
      expect.unreachable();
    } catch (err) {
      expect(isHttpError(err) && err.status).toBe(502);
    }
  });
});
