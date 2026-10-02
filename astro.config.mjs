import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sebrogala.dev',
  trailingSlash: 'never',
  // Showcases live under /projects/* as canonical URLs. The old flat URLs
  // (/pipeforge, /kb) redirect to keep any in-flight links working.
  redirects: {
    '/pipeforge': '/projects/pipeforge',
    // The knowledge-base showcase was retired (02.10.2026). Its summary now
    // lives on the Pipeforge page, so both of its URLs land there.
    '/kb': '/projects/pipeforge',
    '/projects/kb': '/projects/pipeforge',
    // /about was collapsed into the home page. Kept so existing links —
    // LinkedIn, CV references, anything already indexed — do not 404.
    '/about': '/',
  },
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
