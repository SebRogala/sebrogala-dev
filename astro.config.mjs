import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readFileSync } from 'node:fs';

const site = 'https://sebrogala.dev';

// Showcases live under /projects/* as canonical URLs. The old flat URLs
// (/pipeforge, /kb) redirect to keep any in-flight links working.
const redirects = {
  '/pipeforge': '/projects/pipeforge',
  // The knowledge-base showcase was retired (02.10.2026). Its summary now
  // lives on the Pipeforge page, so both of its URLs land there.
  '/kb': '/projects/pipeforge',
  '/projects/kb': '/projects/pipeforge',
  // /about was collapsed into the home page. Kept so existing links —
  // LinkedIn, CV references, anything already indexed — do not 404.
  '/about': '/',
};

// Sitemap leaves out redirect sources (they are meta-refresh stubs) and the
// llms.txt endpoint. The integration already drops /404 itself.
const sitemapExcluded = new Set([...Object.keys(redirects), '/llms.txt'].map((path) => site + path));

// `updated` from a memo's frontmatter, or null. The sitemap config has no
// content-collection access, so it reads the file the URL's slug names.
const memoUpdated = (slug) => {
  const file = new URL(`./src/content/memos/${slug}.md`, import.meta.url);
  if (!existsSync(file)) return null;
  const frontmatter = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  const updated = frontmatter?.[1].match(/^updated:\s*['"]?([0-9-]+)['"]?\s*$/m);
  return updated ? updated[1] : null;
};

export default defineConfig({
  site,
  trailingSlash: 'never',
  redirects,
  integrations: [
    sitemap({
      filter: (page) => !sitemapExcluded.has(page.replace(/\/$/, '')),
      serialize(item) {
        // Match the canonical tags: no trailing slash except on the root.
        if (item.url !== site + '/') item.url = item.url.replace(/\/$/, '');
        // lastmod only where a memo states it was updated; never a build date.
        const memo = item.url.match(/\/memos\/([^/]+)$/);
        const updated = memo && memoUpdated(memo[1]);
        if (updated) item.lastmod = new Date(updated).toISOString();
        return item;
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  vite: {
    server: {
      hmr: {
        host: 'sebrogala.localhost',
        protocol: 'wss',
        clientPort: 443,
      },
      // Allow Vite to accept requests from the Traefik-fronted hostname.
      // softsolution.localhost kept for back-compat while infra is being switched over.
      allowedHosts: ['sebrogala.localhost', 'softsolution.localhost', 'localhost', '127.0.0.1'],
    },
  },
});
