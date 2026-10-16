import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per memo. The filename is the slug and the URL
// (/memos/<filename>), so it is named by subject and never renamed once
// published. The body is plain paragraphs with raw URLs; src/lib/memos.ts
// renders it (links, command tokens), not the Markdown pipeline.
const memos = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/memos',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    published: z.coerce.date(),
    // Optional. When set: dateModified, article:modified_time, sitemap lastmod.
    updated: z.coerce.date().optional(),
    // The memo's own image (page + index thumbnail). Not the OG card.
    // src is relative to the .md file; astro:assets reads its dimensions and
    // renders the resized variants.
    cover: z
      .object({
        src: image(),
        alt: z.string(),
      })
      .optional(),
    // In-body figures, rendered by src/components/Figure.astro. Each follows
    // the body paragraph that starts with `after`; src is relative to the .md
    // file. The build fails when `after` starts no paragraph.
    figures: z
      .array(
        z.object({
          after: z.string(),
          src: image(),
          alt: z.string(),
          caption: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { memos };
