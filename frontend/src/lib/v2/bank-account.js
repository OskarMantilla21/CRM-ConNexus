/**
 * The account number deposits are paid into.
 *
 * Empty is allowed: an organisation that has not set one yet can still work.
 * A value has to be something a person could type on a transfer form: letters,
 * digits, spaces and hyphens, at least four significant characters, and no
 * longer than the column that stores it. The same rule is enforced by
 * `OrgSettingsSerializer.validate_bank_account_number`.
 *
 * @param {unknown} value
 * @returns {string} an English sentence when the value cannot be saved, else ''
 */
export function depositAccountError(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  const significant = text.replace(/[\s-]/g, '');
  if (
    text.length > 40 ||
    significant.length < 4 ||
    !/^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/.test(text)
  ) {
    return 'Use letters, digits, spaces and hyphens, at least 4 characters.';
  }
  return '';
}
