import { describe, expect, it } from 'vitest';
import { cleanVisible, optionLine, screenBrief, withVisible } from './screen-brief.js';

describe('screenBrief', () => {
  it('keeps the rows on the screen and drops secrets and shell badges', () => {
    const brief = screenBrief({
      leads: [{ title: 'Panadería Luna', status: 'assigned' }],
      password: 'No-debe-salir',
      api_key: 'gemini-secret',
      counts: { leads: 99 },
      permissions: ['sell'],
      screenAssistant: { connected: true },
      feed: 'https://example.test/cal?token=abc',
      user: { name: 'Ana', email: 'ana@example.com' }
    });
    expect(brief).toEqual({
      leads: [{ title: 'Panadería Luna', status: 'assigned' }],
      user: { name: 'Ana', email: 'ana@example.com' }
    });
  });

  it('keeps the words on the screen and drops a token line', () => {
    const brief = withVisible(
      {
        leads: Array.from({ length: 3 }, (_, index) => ({
          id: `id-${index}`,
          title: `Prospecto ${index}`,
          lead_comments: [{ comment: 'interno' }]
        }))
      },
      'Panadería Luna\nhttps://example.test/cal?token=abc\neyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.dG9rZW4'
    );
    expect(brief.leads).toEqual([
      { title: 'Prospecto 0' },
      { title: 'Prospecto 1' },
      { title: 'Prospecto 2' }
    ]);
    expect(brief.visible).toBe('Panadería Luna');
    expect(cleanVisible('  una línea  \n\n  otra  ')).toBe('una línea\notra');
  });

  it('adds people from a list when the page text does not name them', () => {
    expect(optionLine('Asignar a', ['Ana', 'Luis'], 'Asignar a\nAna')).toBe('Asignar a: Luis');
  });
});
