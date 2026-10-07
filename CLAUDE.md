# Project notes for Claude

- Purpose: white-label for SEO casino affiliate sites (layout reference: apostalegal.pt / apostalegal.com). GetPicks is an operator site, not a reference for affiliate UX.
- Two apps: `web/` (Next.js 16, Cache Components) and `cms/` (Directus 11). Read both READMEs before changing structure.
- Brand lives only in `web/src/site.config.js` and `web/src/app/theme.css`. Never hardcode brand names, hex colours or URLs in components; use the config and the Tailwind tokens.
- Blocks: a Directus collection name maps to a component in `web/src/app/blocks.js`. A new block also needs the junction allowlist, `BLOCK_COLLECTIONS` in `cms/scripts/setup.mjs`, and `yarn snap`.
- Schema changes go through the Directus admin or API, then `yarn snap`. Never raw SQL: `yarn dev` drops unknown columns.
- Snapshots carry no permissions; `yarn setup --no-seed` re-grants them.
- Use shadcn components in `web/src/components/ui`; popups use `ui/responsive-dialog` (drawer under 640px).
- No code comments. No em dashes in copy or CMS content.
- Verify with `yarn lint`, `yarn knip` and `NEXT_DIST_DIR=.next-build yarn build` in `web/`.
- Outbound casino links always go through `/go/<slug>` with `rel="nofollow sponsored noopener"`; never link `affiliateUrl` directly.
