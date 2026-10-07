# Website

Next.js 16 (App Router, Cache Components, Turbopack) on React 19. Almost all content comes from the Directus CMS in `../cms`: a page is a row in Directus built out of blocks, and this app renders those blocks.

## Scripts

| Command | Does |
| --- | --- |
| `yarn dev` | Dev server on port 3000 |
| `yarn build` | Production build |
| `yarn start` | Serve the production build |
| `yarn lint` | ESLint (`eslint-config-next`) |
| `yarn knip` | Unused files, exports and dependencies |

Build while the dev server runs without clobbering it: `NEXT_DIST_DIR=.next-build yarn build`.

## Branding

Light and dark themes ship together. `site.theme.default` picks the first one visitors see, `site.theme.switcher` shows the sun/moon toggle in the navbar (in the menu drawer on phones), and the choice is remembered per browser. `src/app/theme.css` holds both palettes: the `:root` block is dark, `:root[data-theme="light"]` is light. Text that must stay white on a brand colour (logo wordmarks, the statement band) uses `text-on-brand`. Check contrast in both themes after changing a colour.

| File | Controls |
| --- | --- |
| `src/site.config.js` | Name, tagline, site URL, CTA label and URL, community link, contact email, footer, lead form copy, analytics, UTM forwarding |
| `src/app/theme.css` | Primary and accent colours (HSL channels), grey scale, background, muted text |
| `src/app/fonts.js` + `src/assets/fonts` | Body (`--font-sans`) and heading (`--font-heading`) fonts |
| `src/app/icon.svg` | Favicon. `apple-icon.js` and `opengraph-image.js` are generated from the config |
| `src/translations/*.json` | UI strings (nav, footer, 404) for `en`, `pt`, `es` |

Use the tokens, not raw colours: `bg-primary`, `text-primary-foreground`, `text-fg-muted`, `bg-grey-900`, `border-grey-800`, `text-accent-2`, `bg-brand-gradient`, `font-heading`.

## How pages are built

```
Directus `pages` row
  ├─ content      (flexible-editor JSON: prose + relation-block markers)
  ├─ page_nodes   (M2A junction to block collections)
  └─ template     (landing | article | default)
          │
          ▼
src/app/(core)/[slug]/page.js ── getPageData() ── ContentRenderer ── RelationBlock ── blocks.js ── components/Blocks/Common/*
```

`/` renders the page with slug `homepage`; every other page is `/<slug>`. To add a page, create a row in Directus, not a route file.

## Blocks

| Collection | Component | Use |
| --- | --- | --- |
| `casinoList` | CasinoList | Ranked casino cards with sorting, bonus cell, Visit and Review; `initialCount` hides the rest behind Show more but keeps every card in the HTML. `variant: compact` + `sortBy: newest` = a "new casinos" grid using each casino's launch date |
| `bonusList` | BonusList | Bonus table from the `bonuses` collection: casino, type chips, wagering, minimum deposit, value, and an expandable How to claim / info panel per row. Optional bonus type filter, search, `initialCount`. `headingLevel: h1` when it is the page title |
| `timeline` | Timeline | Dated entries, newest first, with Show more (all entries stay in the HTML). For regulation changes or market news |
| `licenceRegister` | LicenceRegister | Every casino with licence number, status chip and review link, with search. Filter to active or inactive licences |
| `logoStrip` | LogoStrip | "As seen in" strip from the `mediaMentions` collection; logos in grey, or the outlet name when no logo |
| `marketRanking` | MarketRanking | Casinos ranked by a monthly metric from the `marketStats` collection, with the change from the month before. Always name the data source in the footnote |
| `casinoSpotlight` | CasinoSpotlight | Casinos as mini-reviews (logo, rating, bonus, a paragraph, Visit / Review), with an optional label per pick ("Best for slots") |
| `casinoComparison` | CasinoComparison | Comparison table of picked casinos with chosen columns (bonus, wagering, min deposit, withdrawal time, payment methods, games, live casino, licence) |
| `infoSection` | InfoSection | The main long-form SEO block: H2, a short answer, then 2 to 6 icon sub-points (H3) with Markdown bodies, in 1, 2 or 3 columns |
| `topicCards` | TopicCards | Icon cards with a paragraph and an optional link, e.g. a game guide hub |
| `hero` | Hero | `centered`: full-screen hero with buttons. `compact`: left-aligned headline, lede and trust ticks so the casino list sits above the fold |
| `landingPageHeader` | PageHeader | Centred header for a subpage |
| `landingFeatureCards` | FeatureCards | Headline plus four icon cards on hairlines |
| `featureGrid` | FeatureGrid | Bento grid with one large tile |
| `landingSteps` | LandingSteps | Numbered steps in a row (anchor `#how-it-works`) |
| `landingManifesto` | Manifesto | Poster headline with numbered facts |
| `landingQuestions` | Questions | Stacked questions answered by one line |
| `statementBand` | StatementBand | Two-line statement on the brand gradient |
| `testimonial` | Testimonial | One large quote with rating |
| `landingTestimonials` | Testimonials | Grid of customer quotes |
| `landingTeam` | Team | Author cards: photo, role, bio, experience, expertise, favourite game, top tip, profile links, Person JSON-LD. `variant: strip` = a compact row linking to the About page |
| `landingProse` | Prose | Markdown section |
| `landingPageCta` | PageCta | Lighter closing CTA (`subpage` or `statement`) |
| `landingFinalCta` | FinalCta | Full-width closing CTA |
| `FAQ` | Faq | Accordion with FAQPage JSON-LD |
| `blogList` | BlogList | Article hub: topic tabs, load-more (every card stays in the HTML), optional `limit` and a See all link; `headingLevel: h1` when it is the page title |
| `landingHelpCenter` | HelpCenter | Help centre index with search |
| `landingHelpContact` | HelpContact | Help centre closing band |
| `helpCallout`, `helpChecklist` | HelpCallout, HelpChecklist | Help article asides |
| `heading`, `image`, `quote`, `steps`, `proCon` | | Article building blocks |

Every block has sensible default props, so it renders even before an editor fills it in.

### The block contract

The Directus collection name is the key in `src/app/blocks.js`. If the names do not match, the block renders nothing in production (a red placeholder in development).

`RelationBlock` strips `null` fields before spreading them into the component, so an empty CMS field falls back to the default prop. For values used mid-function, `src/lib/cms.js` has `pick`, `rows`, `labels` and `num`. Repeater fields arrive as arrays of objects (`[{ label: "..." }]`).

### Adding a block

1. Create the collection in Directus and add it to the junction allowlists (see `../cms/README.md`).
2. Add it to `BLOCK_COLLECTIONS` in `../cms/scripts/setup.mjs`, run `yarn setup --no-seed`, then `yarn snap`.
3. Create `src/components/Blocks/Common/<Name>/index.js` with default props.
4. Register it in `src/app/blocks.js` under the exact collection name.
5. If it has file or relational fields, add them to `src/queries/page-query.js` (images: name the field `image`, `backgroundImage` or `avatar` and they are already queried). Build image URLs with `helpers/functions/assetUrl`.

## Casinos and affiliate links

Casinos live in the Directus `casinos` collection and load through `src/lib/casinos` (cached, tag `casinos`).

- `/review/<slug>` renders a review (`src/app/(core)/review/[slug]/page.js`). Change the path with `site.affiliate.reviewPath` and rename the route folder to match.
- `/go/<slug>` redirects to the casino's `affiliateUrl` (`src/app/(api)/go/[slug]/route.js`), unknown slugs fall back to `/casinos`. Every outbound link uses `rel="nofollow sponsored noopener"`.
- Card UI: `src/components/casino/` (`CasinoCard`, `CasinoListClient` for sorting, `CasinoLogo`, `Rating`). Without a logo upload the card shows the name on the casino's brand colour.
- The CMS M2M on the `casinoList` block decides which casinos show and in what order; leave it empty to list all published casinos by their `sort`.

## Catalogue pages

Attribute collections (payment methods, providers, games, sports, licences, bonus types...) get their own pages at `/<section>/<slug>`, e.g. `/payments/visa` or `/bonuses/free-spins`, rendered by `src/app/(core)/[slug]/[item]/page.js` with loaders in `src/lib/catalog`.

- `site.catalog.sections` in `src/site.config.js` maps a URL section to its collection and sets the page title (`{name}` is replaced). Set `enabled: false` to switch a section off for a site: no pages, no sitemap entries, and chips stop linking.
- Thin pages are kept out of search: a page with no Markdown `body` and fewer than `site.catalog.minCasinosToIndex` casinos (or bonuses) gets `noindex` and is left out of the sitemap. Unticking `index` on the item does the same.
- A CMS page with the same slug as a catalogue item wins: the catalogue page 301s to it. That is how `/bonuses/welcome-bonuses` hands over to the editorial `/welcome-bonuses` page.
- Reviews show every attribute as a chip linking to its page, a payment methods table and every bonus.

## Contact form

Any link to `/contact` opens the lead form in a dialog (drawer under 640px); `/contact` itself is a full page for direct visits. Fields live in `src/lib/lead/fields.js`, copy in `site.config.js`. Submissions go through a server action (`src/lib/lead/actions.js`) into the Directus `leads` collection, and to `LEAD_WEBHOOK_URL` if set. Attribution (UTM, ref, referrer, landing page) is captured on first visit and sent with the lead.

## Caching and revalidation

Loaders use `"use cache"` with `cacheLife` and tags named after their collections (`pages`, `articles`, `help_articles`, `menus`, `theme`, `footer`); block collections share `blocks`. Content refreshes on its own within 5 to 10 minutes. For instant updates the CMS flow calls:

```bash
curl -X POST "$SITE/api/revalidate" -H "x-revalidate-secret: $REVALIDATE_SECRET" -H "content-type: application/json" -d '{"collection":"pages"}'
```

## Images

`assetUrl()` serves uploads from `NEXT_PUBLIC_CDN_URL` when set, otherwise from Directus `/assets`. `next.config.js` allows the CMS and CDN hosts in `next/image` and the CSP automatically.

## Conventions

- Reach for `src/components/ui` (shadcn) first. Every popup uses `ui/responsive-dialog`: a dialog on desktop, a drawer under 640px.
- No code comments; keep code self-explanatory.
- No em dashes in copy.
- `useSearchParams`/`usePathname` in the layout must sit inside `<Suspense>`, or prerendering breaks.

## Troubleshooting

**A block shows its default copy instead of CMS content.** It lacks Public read (rerun `yarn setup --no-seed` in `cms/`) or it is not in the junction's allowed collections. Check:

```bash
curl -s -g "$DIRECTUS_URL/items/pages?filter[slug][_eq]=homepage&fields=page_nodes.collection,page_nodes.item.*"
```

An `item` of `null` confirms it.

**The build fails in `generateStaticParams`.** Cache Components needs at least one param per dynamic route; the loaders return a placeholder when a collection is empty, so check `DIRECTUS_URL` is reachable at build time.
