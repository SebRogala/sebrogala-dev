// Served at /llms.txt. An endpoint rather than a file in public/ so the text can
// import shared values (the OMS status in src/lib/oms.ts) instead of repeating them.
import type { APIRoute } from 'astro';
import { omsStatus, omsScopeVerb, capitalize } from '../lib/oms';

const body = `# Sebastian Rogala

> AI-Native Software Engineer | Agentic SDLC. AI agents build the software, and he directs them and verifies it works. Over a decade of broad software engineering, fully AI-directed since early 2026. Based in Rzeszów, Poland.

A map of the site for automated readers. Everything here is also on the linked pages. If a fact here conflicts with a page, trust the page.

## Pages

- [Home](https://sebrogala.dev): what he does, current work, speaking, availability.
- [Projects](https://sebrogala.dev/projects): every project below, plus small apps and open-source contributions.
- [Pipeforge and Fleetforge](https://sebrogala.dev/projects/pipeforge): orchestration for Claude Code and Codex on a PostgreSQL MCP server. Screenshot walkthrough of real runs.
- [Memos](https://sebrogala.dev/memos): how he builds software with AI agents, his setup and what's changing.
- [Talks & workshops](https://sebrogala.dev/talks): talk and workshop topics on AI-native software delivery, in Polish or English, plus past talks.
- [Right fit](https://sebrogala.dev/right-fit): the work and team he's looking for, as fractional, contract or full-time, and where (Rzeszów or remote).

## Current work

- Education SaaS: multi-tenant education CRM built for its first client, in production since 03.2026.
- OMS / backoffice: ${omsStatus}. Order management and catalogue import for a building-materials e-shop. ${capitalize(omsScopeVerb)} the most-used ~80% of a legacy admin.
- ProfitOfExile: open-source (GPL-3.0) Windows companion app for Path of Exile.
- Pipeforge and Fleetforge: private orchestration tooling, used daily. Every project above ships through it.
- Claude Design Playbook: public design-to-code handoff for coding agents. https://github.com/SebRogala/claude-design-playbook

## Smaller apps

- Milisto: personal mobile PWA shopping list, not released.
- Pomodoro: visual sequence timer. https://pomodoro.softsolution.pro

## Contact

- Email: sebrogala@gmail.com
- LinkedIn: https://linkedin.com/in/sebrogala
- GitHub: https://github.com/SebRogala

## Availability

- Custom software projects, fractional delivery, advisory, and workshops or training. Full-time for the right fit: https://sebrogala.dev/right-fit
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
