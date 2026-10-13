/**
 * Turn assistant text into blocks the column can render as elements.
 * The model text never becomes HTML.
 *
 * @param {string} source
 * @returns {Array<
 *   | { type: 'paragraph', parts: Inline[] }
 *   | { type: 'heading', level: number, parts: Inline[] }
 *   | { type: 'list', ordered: boolean, items: Inline[][] }
 *   | { type: 'code', lang: string, text: string }
 *   | { type: 'table', rows: string[][] }
 * >}
 */
export function markdownBlocks(source) {
  const lines = String(source || '').replace(/\r\n/g, '\n').split('\n');
  /** @type {ReturnType<typeof markdownBlocks>} */
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const lang = (line.slice(3).trim().match(/^[A-Za-z0-9_+-]{0,16}/) || [''])[0].toLowerCase();
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: 'code', lang, text: code.join('\n') });
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(\S.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, parts: inline(heading[2].trim()) });
      i += 1;
      continue;
    }
    if (isTableStart(lines, i)) {
      /** @type {string[][]} */
      const rows = [];
      while (i < lines.length && lines[i].includes('|')) {
        if (!/^\s*\|?\s*:?-{3,}/.test(lines[i])) rows.push(splitRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: 'table', rows });
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      /** @type {Inline[][]} */
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(inline(lines[i].replace(/^\s*[-*]\s+/, '')));
        i += 1;
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      /** @type {Inline[][]} */
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(inline(lines[i].replace(/^\s*\d+\.\s+/, '')));
        i += 1;
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }
    if (!line.trim()) {
      i += 1;
      continue;
    }
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('```') &&
      !/^#{1,3}\s+\S/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !isTableStart(lines, i)
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: 'paragraph', parts: inline(para.join(' ')) });
  }
  return blocks;
}

/**
 * @typedef {{ kind: 'text' | 'strong' | 'code', text: string }} Inline
 * @param {string} text
 * @returns {Inline[]}
 */
export function inline(text) {
  /** @type {Inline[]} */
  const parts = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let match;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push({ kind: 'text', text: text.slice(last, match.index) });
    if (match[1] != null) parts.push({ kind: 'strong', text: match[1] });
    else parts.push({ kind: 'code', text: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}

/**
 * @param {string[]} lines
 * @param {number} index
 */
function isTableStart(lines, index) {
  const line = lines[index] || '';
  const next = lines[index + 1] || '';
  return line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(next);
}

/** @param {string} line */
function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}
