# White Label Landing

A starter for SEO-focused **casino affiliate** sites, built on the GetPicks landing stack and its Directus CMS, with the layout patterns proven on apostalegal.pt and apostalegal.com: a ranked casino list above the fold, review pages, cloaked affiliate links and compliance copy everywhere it needs to be. Rebrand it in two files, point it at a fresh Directus, and you have a working affiliate site on day one. Nothing in it is casino-only at the core, so it can spin out to other verticals later.

| Folder | What it is |
| --- | --- |
| [`web/`](web) | Next.js 16 site (App Router, Cache Components, React 19, Tailwind 3, shadcn/ui) |
| [`cms/`](cms) | Directus 11 CMS: schema snapshot, flexible-editor extension, setup and seed script |

## What you get

- **Ranked casino list** (`casinoList` block): logo tile, star rating, licence, three highlights, payment methods, bonus box, Visit and Review buttons, T&Cs line, an "Our pick" ribbon and Recommended / Newest / Bonus sorting. Pick casinos by hand or list them all.
- **Casino reviews** at `/review/<slug>`: header with bonus and CTA, key facts, payment methods, pros and cons, a full CMS-written review, other top casinos, a sticky mobile CTA and Review + Breadcrumb JSON-LD.
- **Cloaked affiliate links** at `/go/<slug>`: tracking URLs live in the CMS, links carry `rel="nofollow sponsored"`, and `/go/` is noindex and disallowed in robots.txt.
- **Compliance built in**: 18+ top bar, per-offer T&Cs line, footer disclaimer with an age badge, plus seeded Responsible gambling and Advertiser disclosure pages.
- **Pages built from blocks.** Editors compose pages in Directus from 25 block types (casino list, hero with a compact variant, feature cards, steps, testimonials, FAQ with schema.org, CTAs, prose, blog list, help centre and more). No route files per page.
- **Blog** with categories, filters, load-more, reading progress, table of contents and BlogPosting JSON-LD.
- **Help centre** with search, topics, inline FAQ answers and full article pages.
- **Contact form** that opens as a dialog on desktop and a drawer on mobile, validates, captures UTM/referrer attribution and stores leads in Directus (optionally forwarding to a webhook).
- **Instant publishing.** A Directus flow calls `/api/revalidate` on every save, so edits go live without a redeploy.
- **SEO baked in.** Per-page meta, canonicals, generated OG image and icons, sitemap, robots, `llms.txt`, Organization/WebSite/FAQ/HowTo/BlogPosting JSON-LD, CMS-managed 301 redirects.
- **Performance defaults.** Partial prerendering with `use cache` and cache tags, inlined CSS, self-hosted fonts, analytics deferred until first interaction and gated by cookie consent.
- **UTM forwarding.** Campaign parameters are remembered and appended to outbound links that point at your CTA host.
- **One-file theming.** Colours in `web/src/app/theme.css`, brand copy and links in `web/src/site.config.js`.

## Quick start

You need Node 22, Yarn 1 and a local Postgres.

```bash
createdb my_site_cms
```

```bash
cd cms && cp .env.example .env && yarn install
```

Fill in `KEY`, `SECRET`, the `DB_*` values and an `ADMIN_PASSWORD` in `cms/.env`, then:

```bash
cd cms && yarn bootstrap && yarn start
```

In a second terminal, grant public read access and load the demo content:

```bash
cd cms && yarn setup
```

Then run the website:

```bash
cd web && cp .env.example .env && yarn install && yarn dev
```

Open http://localhost:3000 for the site and http://localhost:8055 for the CMS.

## Starting a new project

1. Copy this folder and `git init` it.
2. **Brand:** edit `web/src/site.config.js` (name, tagline, CTA, contact email, footer, lead form copy) and `web/src/app/theme.css` (primary colour, accent, grey scale). Set `themeColor` and `backgroundColor` in the config to match.
3. **Logo and icon:** upload a logo in Directus under Settings > Theme (falls back to a wordmark), and replace `web/src/app/icon.svg`. The Apple icon and OG image are generated from the config.
4. **Fonts:** swap the files in `web/src/assets/fonts` and the `localFont` call in `web/src/app/fonts.js`. Point `heading` at a second font for a display face.
5. **Content:** the seed casinos are fictional. Replace them with real operators (logo, licence, bonus, affiliate URL) under Casinos in Directus, or run `yarn setup --no-seed` on a fresh database for permissions only.
   Compliance copy (top bar, default T&Cs, age badge) and the Visit/Review/sort labels live in `site.compliance` and `site.affiliate` in `site.config.js`. Check them against your market's regulator before launch.
6. **Language:** set `NEXT_PUBLIC_SITE_LANGUAGE` (`en`, `pt`, `es` ship with translations in `web/src/translations`).
7. **Production:** set `REVALIDATE_SECRET` on the site and `REVALIDATE_URL`/`REVALIDATE_SECRET` in the CMS, then run `yarn setup --no-seed` against production to create the permissions and the flow.

## Things that bite

- **Permissions are not in the snapshot.** Directus snapshots carry schema only. `yarn setup` grants Public read on every content and block collection; rerun it after adding a block collection, on every environment.
- **New blocks must be on the allowlist.** A block missing from the junction's allowed collections comes back as `item: null` and renders only its defaults. See [Adding a block](web/README.md#adding-a-block).
- **Never add fields with raw SQL.** `yarn dev` in `cms/` re-applies `snapshot.yaml` and drops anything not in it. Change schema in the admin UI, then `yarn snap`.
- **Empty CMS fields are `null`.** `RelationBlock` strips nulls so component default props apply. Store `""` to hide an optional label.
- **The Tailwind palette replaces the defaults.** A colour not defined in `web/tailwind.config.js` generates no class and nothing warns you.
- **Revalidation is stale-while-revalidate.** The first request after a save still gets the old page and triggers the refresh; the next one is fresh.
- **Edits not showing in dev?** Stop the server, `rm -rf web/.next`, restart.

See [`web/README.md`](web/README.md) and [`cms/README.md`](cms/README.md) for details.
