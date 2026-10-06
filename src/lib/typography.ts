// Typography pass over rendered HTML: a one-letter word ("I", "a", "A") is
// bound to the word after it with a no-break space, so no line ends on it.
// src/middleware.ts runs it on every HTML page, in dev and in the build.
//
// Only visible body text changes. Passed through untouched: everything up to
// </head>, tags with their attributes, comments, and the contents of script,
// style, pre, code and textarea. A one-letter word at the end of a text node
// is bound only when an inline element follows ("a <a>memo</a>"); before a
// closing or block tag there is nothing on its line to bind it to.

const NBSP = ' ';
const RAW_TEXT = new Set(['script', 'style', 'pre', 'code', 'textarea']);
const INLINE_START = /^<(a|abbr|b|em|i|kbd|span|strong)\b/i;

// A one-letter word: at the start of the text or after whitespace or an
// opening bracket or quote, followed by whitespace.
const ONE_LETTER = /(?<=^|[\s(“"‘])([IaA])\s+(?=\S)/g;
const ONE_LETTER_AT_END = /(?<=^|[\s(“"‘])([IaA])\s+$/;

// Comments, tags (name captured), or a run of text.
const TOKEN = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)[^>]*>|[^<]+/g;

const bindText = (text: string, next: string) => {
  const bound = text.replace(ONE_LETTER, `$1${NBSP}`);
  return INLINE_START.test(next) ? bound.replace(ONE_LETTER_AT_END, `$1${NBSP}`) : bound;
};

export const bindOneLetterWords = (html: string) => {
  const headEnd = html.indexOf('</head>');
  const start = headEnd === -1 ? 0 : headEnd;
  const body = html.slice(start);
  let rawDepth = 0;
  const out = body.replace(TOKEN, (token, closing: string | undefined, name: string | undefined, offset: number) => {
    if (name) {
      if (RAW_TEXT.has(name.toLowerCase())) rawDepth = Math.max(0, rawDepth + (closing ? -1 : 1));
      return token;
    }
    if (token.startsWith('<') || rawDepth > 0) return token;
    return bindText(token, body.slice(offset + token.length));
  });
  return html.slice(0, start) + out;
};
