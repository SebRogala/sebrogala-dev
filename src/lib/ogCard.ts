// Social card paths. Each card is rendered in three aspect ratios by
// brand/og-card/render.sh: <name>.png (16:9, the og:image), <name>-4x3.png and
// <name>-1x1.png. Structured data lists all three, one image per ratio.

/** Site-wide card. Versioned filename: a future swap gets a new URL, so platform
 * and CDN caches never serve a stale card. LinkedIn caches previews for 7 days. */
export const siteCard = '/og-card-v3.png';

/** The 1:1, 4:3 and 16:9 renders of a card, given its 16:9 path. */
export const cardFormats = (card: string) => ['-1x1', '-4x3', ''].map((suffix) => card.replace(/\.png$/, `${suffix}.png`));
