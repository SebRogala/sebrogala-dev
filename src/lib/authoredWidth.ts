import { readFileSync } from 'node:fs';

/**
 * Width a screenshot had on screen when it was taken, in CSS pixels.
 *
 * Captures inherit the display's scale factor, so a 1.5x screenshot is 50%
 * wider in raw pixels than it looked when made. PNG records that scale in its
 * pHYs chunk as pixels-per-metre; 96 DPI is 1x. Rendering the raw pixel width
 * therefore shows the capture larger than authored — 999px for a 666px image.
 *
 * Falls back to the intrinsic width when pHYs is absent or already 1x.
 */
export function authoredWidth(file: string): number {
  const buf = readFileSync(new URL(`../../public/screenshots/${file}`, import.meta.url));
  const intrinsic = buf.readUInt32BE(16);

  let i = 8;
  while (i < buf.length - 8) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString('ascii', i + 4, i + 8);
    if (type === 'pHYs') {
      const perMetre = buf.readUInt32BE(i + 8);
      const unitIsMetre = buf[i + 16] === 1;
      if (unitIsMetre) {
        const scale = (perMetre * 0.0254) / 96;
        if (scale > 1) return Math.round(intrinsic / scale);
      }
      break;
    }
    if (type === 'IDAT') break;
    i += 12 + len;
  }
  return intrinsic;
}
