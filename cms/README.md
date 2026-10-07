# CMS

Directus 11 with the flexible-editor extension. The schema lives in `snapshot.yaml`; permissions, the revalidation flow and demo content come from `scripts/setup.mjs`.

## Scripts

| Command | Does |
| --- | --- |
| `yarn bootstrap` | Creates the Directus system tables and first admin, then applies `snapshot.yaml`. Run once per new database. |
| `yarn dev` | Applies `snapshot.yaml`, then starts Directus. |
| `yarn start` | Starts Directus without touching the schema. |
| `yarn snap` | Writes the current schema to `snapshot.yaml`. Commit it. |
| `yarn setup` | Grants Public permissions, creates the revalidation flow (if configured) and seeds demo content into an empty database. |

`yarn setup` flags:

- `--no-seed` only permissions and the flow. Use this on production.
- `--force-seed` adds the demo content even when pages already exist.
- `--rebuild-homepage` replaces the homepage with the current demo homepage (the old one is kept as an archived page) and fills the demo casinos' newer fields. Use it after pulling a new starter version into an existing local install.

It logs in with `ADMIN_EMAIL`/`ADMIN_PASSWORD`, or uses `SETUP_DIRECTUS_TOKEN` if set. Point it at another instance with `SETUP_DIRECTUS_URL`.

It also repairs any collection display template that points at a missing field. One broken template makes the flexible editor's Content field show "Unexpected Error" on every page, because the editor queries all allowed blocks' templates in a single request.

## What setup grants

| Policy | Access |
| --- | --- |
| Public | Read on pages, blog, help centre, menus, theme, footer, redirects and every block collection |
| Public | Read on `directus_files` (safe fields) and `directus_users` (name, avatar, title, description, LinkedIn only) |
| Public | Create on `leads` (form fields only, no read) |

## Collections

| Collection | Used for |
| --- | --- |
| `casinos` + `casinos_editor_node` | Operators (a suspended or revoked `licenceStatus` removes a casino from rankings, reviews and `/go/` links; it stays in the licence register): rating, bonus, highlights, payment methods, licence, affiliate URL, pros/cons and the review body (flexible editor). Review at `/review/<slug>`, outbound link `/go/<slug>`. |
| `mediaMentions` | Press coverage for the logo strip: name, logo, link. |
| `marketStats` | One row per casino per month (e.g. searches). Feeds the `marketRanking` block, which shows the latest month and the change from the previous one. |
| `authors` | Writers and reviewers (photo, role, bio, experience, expertise, favourite, tip, links). Shown by the `landingTeam` block; each has a slug for future author pages. |
| `pages` + `pages_editor_node` | Marketing pages. `content` is flexible-editor JSON; blocks are an M2A on `page_nodes`. |
| `articles`, `categories` | Blog at `/blog/<category>/<slug>` |
| `help_articles`, `help_categories` | Help centre at `/help-center/<slug>` |
| `menus` | `main-menu` for the nav; `footer-menu-<n>` columns in the footer. A footer menu titled "Social" renders as icons, one titled "Legal" moves to the bottom bar. |
| `theme` (singleton) | Logo |
| `footer` (singleton) | Footer disclaimer |
| `redirects` | 301s, read when the site builds |
| `leads` | Contact form submissions |

Page templates: `landing` (full bleed, optional backlight glow), `article` (reading layout with a table of contents) or default.

## Adding a block collection

1. Create it in the admin UI inside the Blocks folder.
2. Add it to the allowed collections of each junction it belongs in: `pages_editor_node.item`, and if it should work in posts or help articles, `articles_editor_node.item` / `help_articles_editor_node.item`.
3. Add its name to `BLOCK_COLLECTIONS` in `scripts/setup.mjs` and run `yarn setup --no-seed`.
4. `yarn snap` and commit `snapshot.yaml`.
5. Build the component in the website (see `web/README.md`).

## Production notes

- Directus refuses flow requests to private IPs by default. That is right for production; the `IMPORT_IP_DENY_LIST` line in `.env.example` is for local testing only.
- Uploads go to local disk by default. For production, configure a storage adapter (S3, Spaces, R2) and set `NEXT_PUBLIC_CDN_URL` on the site to the bucket's public URL.
