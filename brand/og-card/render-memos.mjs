#!/usr/bin/env node
// Render each memo's OG card to public/og/memos/<slug>.png via render.sh, which
// also writes <slug>-4x3.png and <slug>-1x1.png.
// Usage (from the repo root):
//   node brand/og-card/render-memos.mjs            render cards that do not exist yet
//   node brand/og-card/render-memos.mjs --force    re-render every card
//   node brand/og-card/render-memos.mjs --only <slug>   (re-)render one card
// The card shows the title and the publish date, so re-render a memo after
// changing either (--only <slug>). Each render records what it drew in
// memo-cards.json; the build compares that with the memo and fails on a
// mismatch, so a stale card cannot ship. A re-render overwrites the same file:
// platforms that cached the old card (LinkedIn keeps previews ~7 days) show it
// until their cache expires.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const memosDir = join(root, 'src', 'content', 'memos');
const outDir = join(root, 'public', 'og', 'memos');
const manifestPath = join(here, 'memo-cards.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

// Minimal frontmatter read: the two fields the card shows.
const field = (frontmatter, name) => {
  const m = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  if (!m) return null;
  const raw = m[1].trim();
  if (raw.startsWith('"')) return JSON.parse(raw);
  if (raw.startsWith("'")) return raw.slice(1, -1).replace(/''/g, "'");
  return raw;
};

mkdirSync(outDir, { recursive: true });
const slugs = readdirSync(memosDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.slice(0, -3))
  .filter((slug) => !only || slug === only);
if (only && slugs.length === 0) throw new Error(`No memo file for slug "${only}" in ${memosDir}`);

for (const slug of slugs) {
  const out = join(outDir, `${slug}.png`);
  const outs = ['', '-4x3', '-1x1'].map((suffix) => join(outDir, `${slug}${suffix}.png`));
  if (outs.every((file) => existsSync(file)) && !force && !only) {
    console.log(`skip   ${slug} (exists)`);
    continue;
  }
  const frontmatter = readFileSync(join(memosDir, `${slug}.md`), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const title = field(frontmatter, 'title');
  const published = field(frontmatter, 'published');
  if (!title || !/^\d{4}-\d{2}-\d{2}/.test(published ?? '')) throw new Error(`${slug}: needs title and an ISO published date`);
  const [y, m, d] = published.slice(0, 10).split('-');
  const query = new URLSearchParams({ title, date: `${d}.${m}.${y}` }).toString();
  // render.sh exits non-zero (and this throws) when the title overflows a format.
  execFileSync(join(here, 'render.sh'), [out, 'memo-card.html', query], { stdio: 'inherit' });
  manifest[slug] = { title, date: `${d}.${m}.${y}` };
  console.log(`render ${slug} → ${out}`);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
