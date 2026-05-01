import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sebrogala.dev',
  trailingSlash: 'never',
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
