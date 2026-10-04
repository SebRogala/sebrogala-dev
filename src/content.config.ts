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
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    // Optional. When set: dateModified, article:modified_time, sitemap lastmod.
    updated: z.coerce.date().optional(),
    // The memo's own image (page + index thumbnail). Not the OG card.
    cover: z
      .object({
        src: z.string(),
        width: z.number(),
        height: z.number(),
        alt: z.string(),
      })
      .optional(),
  }),
});

export const collections = { memos };
