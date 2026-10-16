# AGENTS.md

Rules for agents changing this site. Static Astro, served by nginx.

## One component per UI pattern

1. Render each repeated UI pattern from one component in `src/components/`. A pattern is
   repeated when two places show it: a figure, a card, a list row, a footer link group.
2. Before you add markup, search `src/components/` for a component that already renders it.
   Use that component. Extend its props when a new case needs one more option.
3. When you find a pattern copied by hand in two or more files, move it into a component in
   the same change, and replace every copy.
4. Keep a component's styles inside the component. A page passes props; it does not restyle
   the component's internals.

## Components that exist

- `Figure.astro` — every image or diagram shown in content: `<Image>` sizing, tap-to-zoom
  through the lightbox in `src/layouts/Base.astro`, optional caption. A memo adds figures
  through its frontmatter `figures` list.
- `TopNav.astro`, `SiteFooter.astro`, `PastTalks.astro`.

Add a line here when you add a component.

## Checks

Run `npm test` and `npm run build` before you commit. The build fails on a memo figure
whose `after` text starts no paragraph, and on a missing or stale OG card.

After a change to `src/content.config.ts`, stop the dev server, delete `.astro/`, and start
it again. Until then the dev server keeps serving entries parsed with the old schema (seen
with Astro 5.18: a new frontmatter field stayed missing across plain restarts).
