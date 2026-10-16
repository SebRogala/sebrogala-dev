import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

// Guard for the image build rule: a page renders its images through
// astro:assets <Image> (resized variants, srcset), never as a plain <img>
// pointing into public/, which ships the original file at full size.

// Plain <img> tags whose src is a site-root path: "/x", '/x', {`/x`}, {"/x"}.
export const publicImgTags = (source: string): string[] =>
  [...source.matchAll(/<img\b[^>]*?\bsrc=\{?["'`]\/[^>]*>/g)].map((m) => m[0]);

// Pages still serving public/ screenshots, until their pass lands. Remove a
// file here once it renders through <Image>; the stale-entry test enforces it.
const PENDING = new Set(['src/pages/projects.astro', 'src/pages/projects/pipeforge.astro']);

const root = new URL('..', import.meta.url).pathname;
const astroFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? astroFiles(join(dir, e.name)) : e.name.endsWith('.astro') ? [join(dir, e.name)] : [],
  );
const sources = astroFiles(join(root, 'src')).map((file) => ({
  path: relative(root, file),
  text: readFileSync(file, 'utf8'),
}));

test('flags a plain img with a quoted public path', () => {
  assert.equal(publicImgTags('<img src="/hero.webp" alt="" />').length, 1);
});

test('flags a plain img with a template-literal public path', () => {
  assert.equal(publicImgTags('<img\n  src={`/screenshots/${name}`}\n  alt="x"\n/>').length, 1);
});

test('leaves an astro:assets Image alone', () => {
  assert.deepEqual(publicImgTags('<Image src={heroArt} widths={[480]} alt="" />'), []);
});

test('leaves an img without a src alone', () => {
  assert.deepEqual(publicImgTags('<img class="lightbox-img" alt="" />'), []);
});

test('leaves an img with an imported src alone', () => {
  assert.deepEqual(publicImgTags('<img src={cover.src} alt="" />'), []);
});

test('no page outside the pending list renders a public/ image as a plain img', () => {
  const offenders = sources
    .filter((s) => !PENDING.has(s.path))
    .flatMap((s) => publicImgTags(s.text).map((tag) => `${s.path}: ${tag.replace(/\s+/g, ' ')}`));
  assert.deepEqual(offenders, [], 'render these through <Image> from astro:assets');
});

test('every pending file still has a public/ image, so the list shrinks when one is fixed', () => {
  const stale = [...PENDING].filter((path) => {
    const s = sources.find((x) => x.path === path);
    return !s || publicImgTags(s.text).length === 0;
  });
  assert.deepEqual(stale, [], 'remove these from PENDING in tests/media.test.ts');
});
