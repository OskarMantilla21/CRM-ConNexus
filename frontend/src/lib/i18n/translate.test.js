import { afterEach, describe, expect, it } from 'vitest';
import { setClientLocale, normalizeLocale, safeNext } from '$lib/i18n/locale.js';
import { tx, choiceLabel } from '$lib/i18n/translate.js';
import { relativeDays } from '$lib/v2/format.js';
import { LEAD_STATUS_LABEL } from '$lib/v2/enums.js';

afterEach(() => setClientLocale('en'));

describe('normalizeLocale', () => {
  it('defaults to Spanish', () => {
    expect(normalizeLocale(undefined)).toBe('es');
    expect(normalizeLocale('')).toBe('es');
    expect(normalizeLocale('fr')).toBe('es');
  });

  it('accepts English and Brazilian Portuguese, including loose spellings', () => {
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('pt-BR')).toBe('pt-BR');
    expect(normalizeLocale('pt_br')).toBe('pt-BR');
    expect(normalizeLocale('pt')).toBe('pt-BR');
    expect(normalizeLocale('es-MX')).toBe('es');
  });
});

describe('safeNext', () => {
  it('keeps a same-site path and rejects an off-site target', () => {
    expect(safeNext('/pipeline?open=true')).toBe('/pipeline?open=true');
    expect(safeNext('https://evil.example')).toBe('/');
    expect(safeNext('//evil.example')).toBe('/');
  });
});

describe('tx', () => {
  it('speaks Spanish by default once the test pin is lifted', () => {
    setClientLocale('es');
    expect(tx('Sign out')).toBe('Cerrar sesión');
    expect(tx('{n} days ago', { n: 3 })).toBe('hace 3 días');
  });

  it('speaks Brazilian Portuguese when asked', () => {
    setClientLocale('pt-BR');
    expect(tx('Sign out')).toBe('Sair');
    expect(tx('Invoices')).toBe('Faturas');
    expect(choiceLabel('Partially_Paid')).toBe('Parcialmente pago');
  });

  it('returns the English source for the English language, placeholders filled', () => {
    setClientLocale('en');
    expect(tx('Sign out')).toBe('Sign out');
    expect(tx('over {from}', { from: 5000 })).toBe('over 5000');
    expect(relativeDays('2026-08-07', new Date('2026-08-07T12:00:00'))).toBe('today');
    expect(LEAD_STATUS_LABEL.assigned).toBe('Assigned');
  });
});
