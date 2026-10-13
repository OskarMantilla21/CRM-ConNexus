/**
 * Tokens for a code block. The result is data the chat renders as elements.
 * Model text never becomes HTML.
 *
 * @param {string} source
 * @param {string} [lang]
 * @returns {{ kind: 'plain' | 'keyword' | 'string' | 'comment' | 'number', text: string }[]}
 */
export function highlightCode(source, lang) {
  const text = String(source ?? '');
  if (!text) return [];
  const family = familyOf(lang);
  if (!family) return [{ kind: 'plain', text }];
  const keywords = WORDS[family];
  const re = family === 'json' ? JSON_RE : family === 'py' ? PY_RE : CODE_RE;
  re.lastIndex = 0;
  /** @type {{ kind: 'plain' | 'keyword' | 'string' | 'comment' | 'number', text: string }[]} */
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: 'plain', text: text.slice(last, index) });
    parts.push({ kind: tokenKind(match[0], keywords, family), text: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ kind: 'plain', text: text.slice(last) });
  return parts;
}

const WORDS = {
  js: new Set(
    'const let var function return if else for while class new this async await import export from of in typeof break continue try catch throw switch case default null undefined true false'.split(
      ' '
    )
  ),
  py: new Set(
    'def class return if elif else for while import from as try except raise with pass lambda None True False and or not in is'.split(
      ' '
    )
  ),
  sql: new Set(
    'select from where and or not insert into values update set delete join left right inner on group by order limit as create table'.split(
      ' '
    )
  ),
  css: new Set(
    'color background display flex grid none block inline width height margin padding font border'.split(' ')
  ),
  json: new Set(['true', 'false', 'null'])
};

const CODE_RE =
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b/g;
const PY_RE =
  /#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b/g;
const JSON_RE = /"(?:\\.|[^"\\])*"|-?\b\d+(?:\.\d+)?\b|\b(?:true|false|null)\b/g;

/** @param {string | undefined} lang */
function familyOf(lang) {
  const name = String(lang || '').toLowerCase();
  if (name === 'js' || name === 'jsx' || name === 'ts' || name === 'tsx' || name === 'javascript') return 'js';
  if (name === 'py' || name === 'python') return 'py';
  if (name === 'sql') return 'sql';
  if (name === 'css') return 'css';
  if (name === 'json') return 'json';
  return '';
}

/**
 * @param {string} token
 * @param {Set<string>} keywords
 * @param {string} family
 */
function tokenKind(token, keywords, family) {
  if (token.startsWith('//') || token.startsWith('#') || token.startsWith('/*') || token.startsWith('"""') || token.startsWith("'''")) {
    return 'comment';
  }
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) return 'string';
  if (/^-?\d/.test(token)) return 'number';
  if (family === 'sql' || family === 'css') {
    return keywords.has(token.toLowerCase()) ? 'keyword' : 'plain';
  }
  return keywords.has(token) ? 'keyword' : 'plain';
}
