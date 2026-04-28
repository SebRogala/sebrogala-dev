import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://softsolution.pro',
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  vite: {
    server: {
      hmr: {
        host: 'softsolution.localhost',
        protocol: 'wss',
        clientPort: 443,
      },
      // Allow Vite to accept requests from the Traefik-fronted hostname
      allowedHosts: ['softsolution.localhost', 'localhost', '127.0.0.1'],
    },
  },
});
