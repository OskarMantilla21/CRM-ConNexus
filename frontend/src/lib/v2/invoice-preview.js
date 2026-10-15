/**
 * A short stamp for an invoice PDF URL.
 *
 * The preview address has to change when the invoice changes, or the browser
 * keeps painting the PDF it already fetched. The stamp is not a secret and
 * not a checksum of the file: it only has to differ after a payment, a status
 * change, or a different line.
 *
 * @param {Record<string, unknown>} parts
 */
export function invoiceRevision(parts) {
  const raw = Object.keys(parts)
    .sort()
    .map((key) => `${key}=${parts[key] ?? ''}`)
    .join('|');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(36);
}
