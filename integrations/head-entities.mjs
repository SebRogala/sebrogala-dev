// Build check: fails the build when a page's <title> or meta tags carry an HTML
// entity for a character that needs no escaping there. Observed 04.10.2026:
// Google showed a memo title as "I haven&#39;t…" in search results.
//   <title>       only &amp; &lt; &gt; are needed.
//   meta content  only & and " are needed (&amp; / &#38;, &quot; / &#34;).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TITLE_OK = new Set(['&amp;', '&lt;', '&gt;']);
const META_OK = new Set(['&amp;', '&#38;', '&quot;', '&#34;']);
const ENTITY = /&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi;

/** Problems in one page's <head>, as readable strings (empty when clean). */
export const headEntityProblems = (html) => {
  const end = html.indexOf('</head>');
  const head = end === -1 ? html : html.slice(0, end);
  const problems = [];
  for (const [, text] of head.matchAll(/<title>([^<]*)<\/title>/g)) {
    for (const [e] of text.matchAll(ENTITY)) if (!TITLE_OK.has(e)) problems.push(`<title> has ${e}: ${text}`);
  }
  for (const [tag, value] of head.matchAll(/<meta\b[^>]*\bcontent="([^"]*)"[^>]*>/g)) {
    for (const [e] of value.matchAll(ENTITY)) if (!META_OK.has(e)) problems.push(`${e} in ${tag}`);
  }
  return problems;
};

export default function headEntities() {
  return {
    name: 'head-entities',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const problems = readdirSync(root, { recursive: true })
          .filter((f) => f.endsWith('.html'))
          .flatMap((f) => headEntityProblems(readFileSync(join(root, f), 'utf8')).map((p) => `${f}: ${p}`));
        if (problems.length) {
          throw new Error(`Escaped characters in <head> that search results may show raw:\n${problems.join('\n')}`);
        }
      },
    },
  };
}
