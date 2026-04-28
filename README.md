# softsolution.pro

Personal site of Sebastian Rogala / Soft Solution.

Static Astro site, served by nginx, deployed via Coolify.

## Local development

```bash
# 1. Make sure the shared infra stack is running (Traefik + shared services)
cd /var/www/infra && docker compose up -d

# 2. Start this project
cd /var/www/softsolution && docker compose up -d

# 3. Visit https://softsolution.localhost (Traefik handles TLS)
```

The dev container runs `npm install && npm run dev` automatically. Hot reload works through Traefik's WebSocket proxy.

To watch logs:

```bash
docker compose logs -f dev
```

## Project structure

```
softsolution/
├── astro.config.mjs            # Astro config (Vite HMR set up for Traefik)
├── docker-compose.yml          # Dev container (joins shared infra network)
├── Dockerfile                  # Production multi-stage build (Node → nginx)
├── nginx.conf                  # Production nginx config (caching, gzip, security headers)
├── public/
│   └── screenshots/            # Redacted Pipeforge screenshots (manifest in portfolio-screenshots/)
├── src/
│   ├── layouts/
│   │   └── Base.astro          # html shell, palette, fonts, gradient
│   └── pages/
│       ├── index.astro         # Homepage (R6 design — notebook-brown, manifest, marginalia)
│       ├── pipeforge.astro     # Walkthrough (placeholder)
│       ├── kb.astro            # Knowledge base showcase (placeholder)
│       └── about.astro         # About page
└── design_handoff_softsolution_pro/   # Reference materials (gitignored)
```

## Production deploy (Coolify)

1. Push to GitHub repo (private or public)
2. In Coolify: Add New Resource → Private Repository (with GitHub App)
3. Build Pack: **Dockerfile**
4. Port: **80**
5. Domain: `https://softsolution.pro`
6. Auto Deploy: **on** (deploys on push to `main`)

The `as of [build_date]` line in the homepage footer regenerates on every deploy.

## Design source

The design originated as a Round 6 mockup from Claude Design (after multiple iteration rounds with the dark notebook-brown palette). The handoff package is in `design_handoff_softsolution_pro/` for reference. Three modifications were applied during translation:

1. Manifest reduced from 3 lines to 2 (dropped `today:` to lower metric density)
2. Pitch and availability paragraphs bumped to weight 500 (anchors identity over liveness signals)
3. Marginalia kept only on the pitch (pull-quote) and work rows (dated stamps); dropped from manifest and availability sections

## License

All rights reserved. Source visible for credibility / reference, not for reuse.
