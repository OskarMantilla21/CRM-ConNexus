import { describe, expect, it } from 'vitest';
import { invoiceRevision } from './invoice-preview.js';

describe('invoiceRevision', () => {
  it('stays put while the invoice stays put', () => {
    const parts = { status: 'Draft', due: '100' };
    expect(invoiceRevision(parts)).toBe(invoiceRevision({ due: '100', status: 'Draft' }));
  });

  it('changes when the amount due changes', () => {
    expect(invoiceRevision({ due: '100' })).not.toBe(invoiceRevision({ due: '40' }));
  });
});
