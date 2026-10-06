// Memo content helpers shared by /memos, /memos/[slug] and their <head>.
// Everything here is derived from the memo file at build time, never stored.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { cardFormats } from './ogCard';

export type Memo = CollectionEntry<'memos'>;

/** All memos, newest first. */
export const getMemos = async (): Promise<Memo[]> =>
  (await getCollection('memos')).sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

const pad = (n: number) => String(n).padStart(2, '0');

/** DD.MM.YYYY: the site writes every visible date numerically, day first. */
export const formatDate = (date: Date) =>
  `${pad(date.getUTCDate())}.${pad(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`;

/** Body paragraphs, as written (blank-line separated). */
export const paragraphs = (memo: Memo) =>
  (memo.body ?? '')
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' '));

export const wordCount = (memo: Memo) => paragraphs(memo).join(' ').split(/\s+/).length;

// ─── Inline rendering ────────────────────────────────────────────
// A memo's source keeps raw URLs; no raw URL is ever shown as text:
//   1. a GitHub issue URL renders as `#<n>`, inside the author's parentheses;
//   2. `word (url)` renders as the word, linked, parenthetical dropped;
//   3. any other bare URL renders as its hostname, linked.
// `/command` tokens (/compact, /deliver, …) render as inline code.

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COMMAND = /(^|[\s(“])(\/[a-z][a-z0-9-]*)(?=$|[\s.,;:!?)”])/g;
const commands = (text: string, open = '<code>', close = '</code>') =>
  escapeHtml(text).replace(COMMAND, (_, lead, cmd) => `${lead}${open}${cmd}${close}`);

const ISSUE = /^https?:\/\/github\.com\/[^\s)]*\/issues\/(\d+)/;
// Case 2 first (word + parenthesised URL), then any URL on its own.
const LINKS = /([\w.-]+) \((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;

type Segment = { text: string; href?: string };

const segments = (source: string): Segment[] => {
  const out: Segment[] = [];
  let last = 0;
  for (const m of source.matchAll(LINKS)) {
    const [whole, word, wordUrl, bareUrl] = m;
    const start = m.index ?? 0;
    // A GitHub issue keeps the word before it and its parentheses: "issue (#6354)".
    if (word && ISSUE.test(wordUrl)) {
      out.push({ text: source.slice(last, start) + word + ' (' });
      out.push({ text: `#${wordUrl.match(ISSUE)![1]}`, href: wordUrl });
      out.push({ text: ')' });
    } else if (word) {
      out.push({ text: source.slice(last, start) });
      out.push({ text: word, href: wordUrl });
    } else {
      out.push({ text: source.slice(last, start) });
      const issue = bareUrl.match(ISSUE);
      out.push({ text: issue ? `#${issue[1]}` : new URL(bareUrl).hostname, href: bareUrl });
    }
    last = start + whole.length;
  }
  out.push({ text: source.slice(last) });
  return out;
};

/** One paragraph as HTML: links per the rules above, commands as <code>. */
export const renderInline = (source: string) =>
  segments(source)
    .map(({ text, href }) =>
      href ? `<a href="${escapeHtml(href)}">${commands(text)}</a>` : commands(text),
    )
    .join('');

/** Same text with links flattened to their link text (index excerpt: one link per row). */
export const renderPlainLinks = (source: string) =>
  segments(source)
    .map(({ text }) => commands(text))
    .join('');

/** Title as HTML, command tokens wrapped for mono. */
export const renderTitle = (title: string) => commands(title, '<span class="cmd">', '</span>');

// ─── Derived text ────────────────────────────────────────────────

const firstSentence = (memo: Memo) => paragraphs(memo)[0].split(/(?<=\.)\s/)[0];

/** Excerpt as HTML for the index row. */
export const excerptHtml = (memo: Memo) => renderPlainLinks(firstSentence(memo));

/** Excerpt as plain text, for meta description and JSON-LD. */
export const excerptText = (memo: Memo) =>
  segments(firstSentence(memo))
    .map(({ text }) => text)
    .join('');

// ─── OG card ─────────────────────────────────────────────────────

/** Site path of the memo's 16:9 OG card; rendered, with its cardFormats()
 * siblings, by brand/og-card/render-memos.mjs. */
export const ogCardPath = (memo: Memo) => `/og/memos/${memo.id}.png`;

/**
 * Fails the build when any of a memo's card renders is missing, or the card is stale (rendered for another
 * title or date than the memo now has), so no memo ships with a wrong card.
 * render-memos.mjs records what each card shows in brand/og-card/memo-cards.json.
 */
export const assertOgCard = (memo: Memo) => {
  const fix = `Run: node brand/og-card/render-memos.mjs --only ${memo.id}`;
  for (const path of cardFormats(ogCardPath(memo))) {
    const file = join(process.cwd(), 'public', path);
    if (!existsSync(file)) throw new Error(`Missing OG card for memo "${memo.id}": ${file}. ${fix}`);
  }
  const manifestPath = join(process.cwd(), 'brand', 'og-card', 'memo-cards.json');
  const rendered = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8'))[memo.id] : undefined;
  const expected = { title: memo.data.title, date: formatDate(memo.data.published) };
  if (rendered?.title !== expected.title || rendered?.date !== expected.date) {
    throw new Error(`Stale OG card for memo "${memo.id}": card shows ${JSON.stringify(rendered)}, memo is ${JSON.stringify(expected)}. ${fix}`);
  }
};
