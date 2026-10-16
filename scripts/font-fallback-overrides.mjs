// Prints the @font-face overrides for the "Font fallbacks" block in
// src/layouts/Base.astro. Run after `npm run build`, whenever a font changes:
//   node scripts/font-fallback-overrides.mjs
// Formula: Capsize's createFontStack, as Astro's own fallback generator uses it.
import { readFileSync } from 'node:fs';
import { fromFile } from '@capsizecss/unpack/fs'; // installed with astro

const html = readFileSync('dist/index.html', 'utf8');
// Regular-weight, upright file of a webfont family, from the built @font-face rules.
const regularFile = (family) => {
  const faces = html.match(new RegExp(`@font-face\\{font-family:"?${family}-[0-9a-f]+"?;[^}]*\\}`, 'g')) ?? [];
  const face = faces.find((f) => f.includes('font-weight:400;font-style:normal'));
  if (!face) throw new Error(`No regular @font-face for ${family} in dist/index.html`);
  return 'dist' + face.match(/url\("([^"]+)"\)/)[1];
};

// Local-font metrics. Times / Arial / Courier New: Astro's system-fallbacks table
// (Liberation fonts share them). Roboto: same table. Noto Serif: read from the
// Google Fonts TTF with @capsizecss/unpack.
const local = {
  times: { ascent: 1825, descent: -443, lineGap: 87, unitsPerEm: 2048, xWidthAvg: 832 },
  arial: { ascent: 1854, descent: -434, lineGap: 67, unitsPerEm: 2048, xWidthAvg: 913 },
  courier: { ascent: 1705, descent: -615, lineGap: 0, unitsPerEm: 2048, xWidthAvg: 1229 },
  roboto: { ascent: 1900, descent: -500, lineGap: 0, unitsPerEm: 2048, xWidthAvg: 911 },
  notoSerif: { ascent: 1069, descent: -293, lineGap: 0, unitsPerEm: 1000, xWidthAvg: 481 },
};

const pct = (v) => `${parseFloat((v * 100).toFixed(4))}%`;
const overrides = (web, fb) => {
  const size = web.xWidthAvg / web.unitsPerEm / (fb.xWidthAvg / fb.unitsPerEm);
  const em = web.unitsPerEm * size;
  return `size-adjust: ${pct(size)}; ascent-override: ${pct(web.ascent / em)}; descent-override: ${pct(Math.abs(web.descent) / em)}; line-gap-override: ${pct(web.lineGap / em)};`;
};

const serif = await fromFile(regularFile('Source Serif 4'));
const sans = await fromFile(regularFile('Inter'));
const mono = await fromFile(regularFile('JetBrains Mono'));
console.log('Serif Fallback         ', overrides(serif, local.times));
console.log('Serif Fallback Android ', overrides(serif, local.notoSerif));
console.log('Sans Fallback          ', overrides(sans, local.arial));
console.log('Sans Fallback Android  ', overrides(sans, local.roboto));
console.log('Mono Fallback          ', overrides(mono, local.courier));
