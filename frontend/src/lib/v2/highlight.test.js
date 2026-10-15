import { describe, expect, it } from 'vitest';
import { highlightCode } from './highlight.js';

describe('highlightCode', () => {
  it('marks a keyword, a string and a number without building html', () => {
    const parts = highlightCode('const name = "Ana";\nconst n = 1;', 'js');
    expect(parts.find((part) => part.text === 'const')?.kind).toBe('keyword');
    expect(parts.find((part) => part.text === '"Ana"')?.kind).toBe('string');
    expect(parts.find((part) => part.text === '1')?.kind).toBe('number');
    expect(JSON.stringify(parts)).not.toContain('<span');
  });

  it('leaves an unknown language as plain text', () => {
    expect(highlightCode('plain', 'ruby')).toEqual([{ kind: 'plain', text: 'plain' }]);
  });
});
