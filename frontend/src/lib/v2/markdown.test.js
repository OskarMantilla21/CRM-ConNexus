import { describe, expect, it } from 'vitest';
import { markdownBlocks } from './markdown.js';

describe('markdownBlocks', () => {
  it('keeps paragraphs, lists, code and a table as data', () => {
    const blocks = markdownBlocks(
      'Hola **Ana**.\n\n- uno\n- dos\n\n```\nconst n = 1;\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |'
    );
    expect(blocks.map((block) => block.type)).toEqual(['paragraph', 'list', 'code', 'table']);
    expect(blocks[0].type === 'paragraph' && blocks[0].parts[1]).toEqual({
      kind: 'strong',
      text: 'Ana'
    });
    expect(blocks[2].type === 'code' && blocks[2].text).toBe('const n = 1;');
    expect(blocks[2].type === 'code' && blocks[2].lang).toBe('');
    expect(JSON.stringify(blocks)).not.toContain('<script');
  });

  it('keeps a heading and the language on a fence', () => {
    const blocks = markdownBlocks('# Title with **bold**\n\n```js\nconst n = 1;\n```');
    expect(blocks[0]).toMatchObject({ type: 'heading', level: 1 });
    expect(blocks[0].type === 'heading' && blocks[0].parts.map((part) => part.text)).toEqual([
      'Title with ',
      'bold'
    ]);
    expect(blocks[1]).toMatchObject({ type: 'code', lang: 'js', text: 'const n = 1;' });
  });
});
