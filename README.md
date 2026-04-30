# sebrogala.dev

Personal site of Sebastian Rogala. Static Astro build, served by nginx, deployed via Coolify.

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`.

A `docker-compose.yml` is included for the development setup I run on my own infrastructure (Traefik-fronted local container). It assumes a `infra` external Docker network and isn't required to work on the site — `npm run dev` alone is enough.

## Production

Auto-deploys on push to `main` via Coolify (Dockerfile build pack, port 80). Live at <https://sebrogala.dev>.

The `latest build {date}` line in the footer regenerates on every deploy.

## License

All rights reserved. Source is visible for credibility / reference, not for reuse.
