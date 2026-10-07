import { randomUUID } from "node:crypto";

const BASE = (process.env.SETUP_DIRECTUS_URL || process.env.PUBLIC_URL || "http://localhost:8055").replace(/\/$/, "");
const args = new Set(process.argv.slice(2));

const CONTENT_COLLECTIONS = [
  "pages", "pages_editor_node",
  "casinos", "casinos_editor_node", "authors", "marketStats", "mediaMentions",
  "articles", "articles_editor_node", "articles_categories", "categories",
  "help_articles", "help_articles_editor_node", "help_articles_related", "help_categories",
  "menus", "theme", "footer", "redirects",
];

const BLOCK_COLLECTIONS = [
  "casinoList", "casinoList_casinos", "casinoSpotlight", "casinoSpotlight_casinos", "casinoComparison", "casinoComparison_casinos", "infoSection", "topicCards", "marketRanking", "timeline", "licenceRegister", "logoStrip", "landingTeam", "landingTeam_authors", "hero", "landingPageHeader", "landingFeatureCards", "featureGrid", "landingSteps", "landingManifesto",
  "landingQuestions", "statementBand", "testimonial", "landingTestimonials", "landingProse", "landingPageCta",
  "landingFinalCta", "FAQ", "blogList", "blogList_categories", "landingHelpCenter", "landingHelpContact",
  "helpCallout", "helpChecklist", "heading", "image", "quote", "steps", "proCon",
];

const LEAD_FIELDS = ["name", "email", "company", "topic", "message", "answers", "attribution", "source"];
const AUTHOR_FIELDS = ["id", "first_name", "last_name", "avatar", "title", "description", "linkedin"];
const FILE_FIELDS = ["id", "filename_disk", "filename_download", "title", "description", "type", "width", "height", "focal_point_x", "focal_point_y"];

let token;

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text).data : null;
}

async function login() {
  if (process.env.SETUP_DIRECTUS_TOKEN) {
    token = process.env.SETUP_DIRECTUS_TOKEN;
    return;
  }
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (or SETUP_DIRECTUS_TOKEN).");
  const data = await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  token = data.access_token;
}

async function publicPolicyId() {
  const access = await api("GET", "/access?filter[role][_null]=true&filter[user][_null]=true&fields=policy&limit=1");
  if (access?.[0]?.policy) return access[0].policy;
  const policies = await api("GET", "/policies?fields=id,name&limit=-1");
  const found = policies.find((p) => /public/i.test(p.name));
  if (!found) throw new Error("Could not find the Public policy.");
  return found.id;
}

async function grant(policy, collection, action, fields = ["*"]) {
  const existing = await api(
    "GET",
    `/permissions?filter[policy][_eq]=${policy}&filter[collection][_eq]=${encodeURIComponent(collection)}&filter[action][_eq]=${action}&limit=1`
  );
  const body = { policy, collection, action, fields, permissions: {}, validation: {} };
  if (existing?.length) {
    await api("PATCH", `/permissions/${existing[0].id}`, body);
  } else {
    await api("POST", "/permissions", body);
  }
}

async function grantPublicPermissions() {
  const policy = await publicPolicyId();
  for (const c of [...CONTENT_COLLECTIONS, ...BLOCK_COLLECTIONS]) await grant(policy, c, "read");
  await grant(policy, "directus_files", "read", FILE_FIELDS);
  await grant(policy, "directus_users", "read", AUTHOR_FIELDS);
  await grant(policy, "leads", "create", LEAD_FIELDS);
  console.log(`Public policy: read on ${CONTENT_COLLECTIONS.length + BLOCK_COLLECTIONS.length} collections, files and authors; create on leads.`);
}

async function repairDisplayTemplates() {
  const [collections, fields] = await Promise.all([
    api("GET", "/collections?limit=-1"),
    api("GET", "/fields?limit=-1"),
  ]);
  const known = new Set(fields.map((f) => `${f.collection}.${f.field}`));
  for (const c of collections) {
    const template = c.meta?.display_template;
    if (!template || c.collection.startsWith("directus_")) continue;
    const refs = [...template.matchAll(/\{\{\s*([A-Za-z0-9_]+)[^}]*\}\}/g)];
    const missing = refs.filter(([, field]) => !known.has(`${c.collection}.${field}`));
    if (missing.length === 0) continue;
    const fixed = missing.reduce((t, [token]) => t.replace(token, ""), template).trim() || null;
    await api("PATCH", `/collections/${encodeURIComponent(c.collection)}`, { meta: { display_template: fixed } });
    console.log(`Repaired display template on ${c.collection}: "${template}" -> "${fixed ?? ""}" (missing ${missing.map(([, f]) => f).join(", ")}).`);
  }
}

async function setupRevalidationFlow() {
  const url = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) {
    console.log("Revalidation flow skipped (set REVALIDATE_URL and REVALIDATE_SECRET to create it).");
    return;
  }
  const name = "Revalidate website";
  const existing = await api("GET", `/flows?filter[name][_eq]=${encodeURIComponent(name)}&fields=id`);
  for (const flow of existing) await api("DELETE", `/flows/${flow.id}`);

  const flow = await api("POST", "/flows", {
    name,
    icon: "refresh",
    status: "active",
    trigger: "event",
    accountability: "all",
    options: {
      type: "action",
      scope: ["items.create", "items.update", "items.delete"],
      collections: [...CONTENT_COLLECTIONS, ...BLOCK_COLLECTIONS],
    },
  });
  const operation = await api("POST", "/operations", {
    flow: flow.id,
    name: "Call /api/revalidate",
    key: "revalidate",
    type: "request",
    position_x: 19,
    position_y: 1,
    options: {
      method: "POST",
      url,
      headers: [
        { header: "x-revalidate-secret", value: secret },
        { header: "content-type", value: "application/json" },
      ],
      body: '{"collection":"{{$trigger.collection}}"}',
    },
  });
  await api("PATCH", `/flows/${flow.id}`, { operation: operation.id });
  console.log(`Revalidation flow points at ${url}`);
}

const text = (value) => ({ type: "text", text: value });
const p = (value) => ({ type: "paragraph", content: [text(value)] });
const h = (level, value) => ({ type: "heading", attrs: { level }, content: [text(value)] });
const ul = (items) => ({ type: "bulletList", content: items.map((i) => ({ type: "listItem", content: [p(i)] })) });

function blocksDoc(junction, blocks, prose = []) {
  const nodes = blocks.map(([collection, item]) => ({ id: randomUUID(), collection, item }));
  return {
    nodes,
    content: {
      type: "doc",
      content: [
        ...prose,
        ...nodes.map((n) => ({ type: "relation-block", attrs: { id: n.id, junction, collection: n.collection } })),
      ],
    },
  };
}

async function createPage({ slug, title, template, backlight, metatitle, metadescription, blocks }) {
  const { nodes, content } = blocksDoc("pages_editor_node", blocks);
  await api("POST", "/items/pages", {
    status: "published",
    slug,
    title,
    template,
    backlight: backlight ?? "",
    metatitle,
    metadescription,
    index: true,
    content,
    page_nodes: nodes,
  });
  console.log(`  page /${slug === "homepage" ? "" : slug}`);
}

const CASINOS = [
  { name: "Royal Harbor", slug: "royal-harbor", brandColor: "#0F3D5E", rating: 4.9, bonusLabel: "€500", bonusValue: 500, bonusDescription: "100% up to €500 + 200 free spins", established: 2016, minDeposit: "€10", withdrawalTime: "Under 24 hours",
    highlights: ["100% up to €500 on your first deposit", "200 free spins on selected slots", "Live casino with 300+ tables"],
    payments: ["Visa", "Mastercard", "PayPal", "Skrill", "Neteller", "Apple Pay", "Bank transfer"],
    pros: ["Fast withdrawals, most under 24 hours", "Huge live casino lobby", "Clear, fair bonus terms"], cons: ["No sports betting", "Phone support only on weekdays"] },
  { name: "Lucky Ember", slug: "lucky-ember", brandColor: "#B4361C", rating: 4.7, bonusLabel: "€300", bonusValue: 300, bonusDescription: "Up to €300 across your first three deposits", established: 2019, minDeposit: "€10", withdrawalTime: "1 to 2 days",
    highlights: ["Up to €300 welcome package", "Weekly cashback on losses", "4,000+ slots from top studios"],
    payments: ["Visa", "Mastercard", "Skrill", "Paysafecard", "Bank transfer"],
    pros: ["Weekly cashback with no wagering", "Very large slot library"], cons: ["Welcome bonus split over three deposits"] },
  { name: "NovaSpin", slug: "novaspin", brandColor: "#3B2A8C", rating: 4.6, bonusLabel: "200 FS", bonusValue: 200, bonusDescription: "200 free spins with no wagering on winnings", established: 2021, minDeposit: "€20", withdrawalTime: "Under 12 hours",
    highlights: ["Free spins with zero wagering", "Same-day withdrawals", "Daily slot tournaments"],
    payments: ["Visa", "PayPal", "Apple Pay", "Google Pay", "Trustly"],
    pros: ["Winnings from free spins are paid as cash", "Modern, fast mobile site"], cons: ["Smaller table game selection"] },
  { name: "Golden Fjord", slug: "golden-fjord", brandColor: "#8A6A12", rating: 4.5, bonusLabel: "€1,000", bonusValue: 1000, bonusDescription: "100% up to €1,000 for high rollers", established: 2014, minDeposit: "€20", withdrawalTime: "1 to 3 days",
    highlights: ["Biggest welcome bonus on our list", "VIP programme with a personal manager", "High table limits"],
    payments: ["Visa", "Mastercard", "Neteller", "Skrill", "Bank transfer", "Bitcoin"],
    pros: ["Generous VIP rewards", "High limits for big players"], cons: ["35x wagering on the welcome bonus", "Slower bank transfers"] },
  { name: "Velvet Ace", slug: "velvet-ace", brandColor: "#6E1E3A", rating: 4.4, bonusLabel: "€100", bonusValue: 100, bonusDescription: "100% up to €100 + 50 free spins", established: 2018, minDeposit: "€10", withdrawalTime: "Under 48 hours",
    highlights: ["Low 20x wagering", "Blackjack and roulette specialists", "24/7 live chat"],
    payments: ["Visa", "Mastercard", "PayPal", "Paysafecard"],
    pros: ["Low wagering requirement", "Excellent table games"], cons: ["Modest bonus size"] },
  { name: "Starlight Slots", slug: "starlight-slots", brandColor: "#1F6F8B", rating: 4.3, bonusLabel: "€250", bonusValue: 250, bonusDescription: "Up to €250 + 100 free spins", established: 2020, minDeposit: "€15", withdrawalTime: "1 to 2 days",
    highlights: ["Jackpot slots with daily drops", "Up to €250 welcome bonus", "Loyalty points on every spin"],
    payments: ["Visa", "Mastercard", "Skrill", "Apple Pay", "Bank transfer"],
    pros: ["Great jackpot selection", "Loyalty points convert to cash"], cons: ["Live chat not available at night"] },
  { name: "Bluefin Casino", slug: "bluefin", brandColor: "#0B5D8F", rating: 4.1, bonusLabel: "€150", bonusValue: 150, bonusDescription: "100% up to €150", established: 2017, minDeposit: "€10", withdrawalTime: "2 to 3 days",
    highlights: ["Simple, no-nonsense bonus", "Clean mobile app", "Instant deposits"],
    payments: ["Visa", "Mastercard", "PayPal"],
    pros: ["Easy to use on mobile"], cons: ["Fewer payment methods", "Slower payouts"] },
  { name: "Crown & Clover", slug: "crown-and-clover", brandColor: "#1E6B3A", rating: 4.0, bonusLabel: "€20", bonusValue: 20, bonusDescription: "€20 free on sign-up, no deposit needed", established: 2022, minDeposit: "€10", withdrawalTime: "1 to 3 days",
    highlights: ["€20 no-deposit bonus", "New-player friendly", "Weekly free spins"],
    payments: ["Visa", "Mastercard", "Skrill", "Neteller"],
    pros: ["Try it without depositing"], cons: ["No-deposit winnings capped at €100"] },
];

const CASINO_EXTRAS = {
  "royal-harbor": { wagering: "30x bonus", gameCount: 2800, liveCasino: true },
  "lucky-ember": { wagering: "35x bonus", gameCount: 4200, liveCasino: true },
  novaspin: { wagering: "None on winnings", gameCount: 1900, liveCasino: false },
  "golden-fjord": { wagering: "35x bonus", gameCount: 3100, liveCasino: true },
  "velvet-ace": { wagering: "20x bonus", gameCount: 1200, liveCasino: true },
  "starlight-slots": { wagering: "30x bonus", gameCount: 3600, liveCasino: false },
  bluefin: { wagering: "25x bonus", gameCount: 1500, liveCasino: true },
  "crown-and-clover": { wagering: "40x winnings", gameCount: 1100, liveCasino: false },
};

const LAUNCHED = {
  "royal-harbor": "2016-03-01",
  "lucky-ember": "2019-05-01",
  "golden-fjord": "2014-02-01",
  bluefin: "2017-09-01",
  "velvet-ace": "2026-04-14",
  "starlight-slots": "2026-06-02",
  novaspin: "2026-08-20",
  "crown-and-clover": "2026-09-15",
};

const MARKET_BASE = {
  "royal-harbor": [118000, 121500],
  "lucky-ember": [96500, 102300],
  "golden-fjord": [71200, 68900],
  novaspin: [38400, 52700],
  "velvet-ace": [33100, 34800],
  "starlight-slots": [29900, 27400],
  bluefin: [24600, 23100],
  "crown-and-clover": [9800, 18200],
};

const EXTRA_ARTICLES = [
  { title: "Slot RTP explained: what the percentage really means", shortTitle: "Slot RTP explained", slug: "slot-rtp-explained", summary: "Why a 96% RTP does not mean you get €96 back, and how to use it to pick slots.", category: "guides",
    content: [["p", "RTP, or return to player, is the share of all money wagered on a slot that it pays back over millions of spins."], ["h", "What 96% means"], ["p", "Over a very long run, a 96% slot pays back €96 for every €100 staked. In one session anything can happen; volatility decides how bumpy the ride is."], ["h", "How to use it"], ["p", "Compare RTP between versions of the same slot: some casinos run a lower-RTP version of the same game. The game's info screen shows the figure."]] },
  { title: "Free spins explained: the terms that decide their value", shortTitle: "Free spins explained", slug: "free-spins-explained", summary: "Spin value, wagering on winnings and win caps: what to check before you claim.", category: "bonuses",
    content: [["p", "Two free spin offers with the same number of spins can be worth very different amounts."], ["h", "Check the spin value"], ["p", "200 spins at €0.10 are worth €20 in stakes; 50 spins at €0.50 are worth €25."], ["h", "Check wagering and caps"], ["p", "Free spins with no wagering on winnings are worth the most. A cap on winnings limits the upside of any offer."]] },
  { title: "Live casino guide: how live dealer games work", shortTitle: "Live casino guide", slug: "live-casino-guide", summary: "Streaming studios, table limits and game shows: what to expect before you sit down.", category: "guides",
    content: [["p", "Live casino games are dealt by real people in a studio and streamed to your screen in real time."], ["h", "Table limits"], ["p", "Minimum bets usually start at €0.50 to €1 on blackjack and roulette; VIP tables go much higher."], ["h", "Game shows"], ["p", "Wheel-based game shows mix casino odds with TV-style presentation. Check the RTP, which is often lower than classic table games."]] },
  { title: "Cashback vs welcome bonus: which is worth more?", shortTitle: "Cashback vs welcome bonus", slug: "cashback-vs-welcome-bonus", summary: "A one-off bonus or steady cashback? We compare the real value for casual and regular players.", category: "bonuses",
    content: [["p", "A welcome bonus is a one-off boost; cashback returns part of your losses every week or month."], ["h", "Casual players"], ["p", "A small welcome bonus with low wagering usually gives casual players the best value."], ["h", "Regular players"], ["p", "Cashback with no wagering adds up over time and is often worth more than a large welcome bonus with strict terms."]] },
  { title: "New casinos this autumn: four launches we tested", shortTitle: "New casinos this autumn", slug: "new-casinos-autumn", summary: "NovaSpin, Crown & Clover, Starlight Slots and Velvet Ace: first impressions from our tests.", category: "news",
    content: [["p", "Four new casinos launched in the last six months. We opened accounts at each and tested deposits, games and withdrawals."], ["h", "The standout"], ["p", "NovaSpin's no-wagering free spins and same-day withdrawals make it the strongest newcomer."], ["h", "One to watch"], ["p", "Crown & Clover's no-deposit offer is a low-risk way to try it, but its game library is still small."]] },
  { title: "Monthly market update: most searched casinos", shortTitle: "Monthly market update", slug: "monthly-market-update", summary: "Which casinos players searched for most last month, and the biggest movers.", category: "news",
    content: [["p", "Every month we track how often players search for each casino. The ranking on our homepage updates with the latest month."], ["h", "Biggest mover"], ["p", "NovaSpin grew fastest after its launch campaign, while established brands held steady."]] },
];

async function ensureDemoExtras() {
  const casinos = await api("GET", "/items/casinos?fields=id,slug&limit=-1");
  for (const c of casinos) {
    const patch = { ...(CASINO_EXTRAS[c.slug] ?? {}), ...(LAUNCHED[c.slug] ? { launched: LAUNCHED[c.slug] } : {}) };
    if (Object.keys(patch).length) await api("PATCH", `/items/casinos/${c.id}`, patch);
  }

  const existingStats = await api("GET", "/items/marketStats?limit=1&fields=id");
  if (existingStats.length === 0) {
    const now = new Date();
    const monthStart = (offset) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1)).toISOString().slice(0, 10);
    const rows = casinos.flatMap((c) =>
      MARKET_BASE[c.slug] ? [{ casino: c.id, month: monthStart(2), value: MARKET_BASE[c.slug][0] }, { casino: c.id, month: monthStart(1), value: MARKET_BASE[c.slug][1] }] : []
    );
    await api("POST", "/items/marketStats", rows);
    console.log(`  ${rows.length} market stats (demo numbers)`);
  }

  const categories = await api("GET", "/items/categories?fields=id,slug&limit=-1");
  let news = categories.find((c) => c.slug === "news");
  if (!news) news = await api("POST", "/items/categories", { status: "published", name: "News", slug: "news", description: "New casinos, market data and regulation changes." });
  const catId = (slug) => (slug === "news" ? news.id : categories.find((c) => c.slug === slug)?.id);
  const existing = new Set((await api("GET", "/items/articles?fields=slug&limit=-1")).map((a) => a.slug));
  let added = 0;
  for (const a of EXTRA_ARTICLES) {
    if (existing.has(a.slug) || !catId(a.category)) continue;
    const { nodes, content } = blocksDoc("articles_editor_node", [], a.content.map(([kind, value]) => (kind === "h" ? h(2, value) : p(value))));
    await api("POST", "/items/articles", {
      status: "published", index: true, showCta: true,
      title: a.title, shortTitle: a.shortTitle, slug: a.slug, summary: a.summary, metadescription: a.summary,
      content, articles_node: nodes, categories: [{ categories_id: catId(a.category) }],
    });
    added++;
  }
  if (added) console.log(`  ${added} more guides`);
}

const MEDIA_MENTIONS = ["The Ledger Review", "Gaming Insider Weekly", "Northbridge Times", "Play Report", "Digital Odds Daily"];

const REGULATION_TIMELINE = [
  { date: "2026-09-30", label: "New", title: "Silver Mirage licence suspended", body: "The regulator suspended Silver Mirage's licence after an audit of its player fund protection. We removed it from all rankings the same day. Players can still request withdrawals of their balance." },
  { date: "2026-09-15", title: "Crown & Clover receives its licence", body: "Crown & Clover joined the market with a no-deposit welcome offer. Our review is now live." },
  { date: "2026-07-01", title: "Deposit limits become mandatory at sign-up", body: "Every licensed casino must now ask new players to set a deposit limit during registration. Limits can be lowered instantly, while increases take effect after 24 hours." },
  { date: "2026-05-12", title: "New rules on bonus advertising", body: "Bonus adverts must now show the wagering requirement and expiry next to the headline offer, in the same font size." },
  { date: "2026-03-03", title: "National self-exclusion register goes live", body: "Players can now exclude themselves from every licensed casino at once through a single national register, for 6 months to 5 years." },
  { date: "2026-01-20", title: "Credit card deposits banned", body: "Licensed casinos can no longer accept credit cards. Debit cards, e-wallets and bank transfers remain available." },
  { date: "2025-11-04", title: "Quarterly market report published", body: "Online casino revenue grew 11% year on year, driven by live casino and mobile play." },
  { date: "2025-09-01", title: "Stricter identity checks before the first withdrawal", body: "Casinos must verify identity and address before paying out for the first time, which can add up to 48 hours to a first withdrawal." },
];

async function ensureRegulationContent() {
  const existing = await api("GET", "/items/casinos?fields=id,slug&limit=-1");
  let n = 101;
  for (const c of existing) {
    await api("PATCH", `/items/casinos/${c.id}`, { licence: `DEMO-${n++}`, licenceStatus: "active" });
  }
  if (!existing.some((c) => c.slug === "silver-mirage")) {
    await api("POST", "/items/casinos", {
      status: "published",
      sort: 99,
      name: "Silver Mirage",
      slug: "silver-mirage",
      brandColor: "#5B6170",
      rating: 2.1,
      licence: "DEMO-199",
      licenceStatus: "suspended",
      affiliateUrl: "https://example.com/?casino=silver-mirage&ref=demo",
      summary: "Licence suspended. Not recommended.",
      index: false,
    });
    console.log("  suspended demo casino for the licence register");
  }

  if ((await api("GET", "/items/mediaMentions?limit=1&fields=id")).length === 0) {
    await api("POST", "/items/mediaMentions", MEDIA_MENTIONS.map((name, i) => ({ name, sort: i + 1, url: "https://example.com" })));
    console.log(`  ${MEDIA_MENTIONS.length} media mentions (fictional outlets)`);
  }

  if ((await api("GET", "/items/pages?filter[slug][_eq]=licences-and-regulation&fields=id")).length === 0) {
    await createPage({
      slug: "licences-and-regulation",
      title: "Licences and regulation",
      template: "landing",
      metatitle: "Online Casino Licences and Regulation Updates",
      metadescription: "Check the licence status of every casino we track, and follow the latest regulation changes for online casinos.",
      blocks: [
        ["landingPageHeader", { eyebrow: "Licences and regulation", title: "Is your casino", titleAccent: "licensed?", description: "Every casino we track, with its licence number and current status, plus the regulation changes that affect players." }],
        ["licenceRegister", { eyebrow: "Licence register", title: "Licence status of every casino we track", lead: "Search by casino name or licence number. Casinos with a suspended or revoked licence are removed from our rankings immediately.", regulator: "demo regulator", footnote: "Demo data. Link each licence number to the regulator's public register." }],
        ["timeline", { eyebrow: "Regulation updates", title: "What changed, and when", lead: "The regulation changes and licence decisions that matter to players, newest first.", initialCount: 5, entries: REGULATION_TIMELINE }],
      ],
    });
  }

  const company = (await api("GET", "/items/menus?filter[key][_eq]=footer-menu-2&fields=id,entrys"))[0];
  if (company && !company.entrys?.some((e) => e.url === "/licences-and-regulation")) {
    await api("PATCH", `/items/menus/${company.id}`, { entrys: [...(company.entrys ?? []), { anchor: "Licences and regulation", url: "/licences-and-regulation" }] });
  }
}

async function createHomepage() {
  const year = new Date().getFullYear();
  const month = new Date().toLocaleString("en", { month: "long" });
  const casinos = await api("GET", "/items/casinos?fields=id,slug&limit=-1");
  const idOf = (slug) => casinos.find((c) => c.slug === slug)?.id;
  const pick = (slug, extra = {}) => ({ casinos_id: idOf(slug), ...extra });

  await createPage({
    slug: "homepage",
    title: "Home",
    template: "landing",
    metatitle: `Best Online Casinos ${year}: Licensed Sites Reviewed and Ranked`,
    metadescription: "Compare licensed online casinos on bonuses, wagering, payout speed and games. Every casino is tested with real money by our review team.",
    blocks: [
      ["hero", { variant: "compact", label: `Updated ${month} ${year}`, title: "Best Online Casinos", titleAccent: "reviewed and ranked.", description: "We test every licensed online casino with real money and compare bonuses, wagering, payout speed and games, so you can choose where to play with confidence.", chips: [{ label: "Licensed casinos only" }, { label: "Tested with real money" }, { label: "Independent ratings" }] }],
      ["casinoList", { licensedLabel: "Licensed casinos only", topBadge: "Our pick", showSort: true, initialCount: 6 }],
      ["casinoList", { variant: "compact", sortBy: "newest", limit: 4, eyebrow: "New casinos", title: "Newest licensed online casinos", description: "Casinos that launched in the last six months. New brands often compete with stronger bonuses, but check their payout record before you deposit.", showSort: false, licensedLabel: "", topBadge: "" }],
      ["casinoSpotlight", {
        eyebrow: "Our top 3",
        title: "Why these are the best online casinos right now",
        lead: "Royal Harbor, Lucky Ember and NovaSpin lead our ranking this month for fast payouts, fair bonus terms and the depth of their game libraries.",
        numbered: true,
        picks: [
          pick("royal-harbor", { label: "Best overall", text: "Royal Harbor combines the strongest all-round package we have tested: a 100% match up to €500 with 200 free spins, 30x wagering that is lower than the market average, and withdrawals that reached our e-wallet in under 24 hours in every test. The live casino runs more than 300 tables, including tables with a €1 minimum bet." }),
          pick("lucky-ember", { label: "Best for slots", text: "With more than 4,000 slots from over 60 studios, Lucky Ember has the largest game library on our list. Its welcome package is spread across three deposits, which suits players who prefer smaller deposits, and its weekly cashback is paid as real money with no wagering attached." }),
          pick("novaspin", { label: "Best free spins", text: "NovaSpin is the only casino on our list that pays free spin winnings as cash with no wagering at all. It is a newer brand with a smaller table game selection, but its mobile site is the fastest we have tested and same-day withdrawals were the norm across our tests." }),
        ],
      }],
      ["infoSection", {
        eyebrow: "Licensed online casinos",
        title: "Everything you need to know before you play",
        lead: "A licensed online casino is regulated by a government gambling authority, which means your money, your data and the fairness of the games are all checked by someone other than the casino itself.",
        columns: "3",
        items: [
          { icon: "shield", title: "Why play at a licensed casino?", body: "Licensed casinos must keep player funds separate from company money, verify your identity before paying out and use games that are independently tested for fairness. If something goes wrong, you can escalate a complaint to the regulator.\n\nUnlicensed sites offer none of this. Bigger bonuses on an unlicensed site are worthless if a withdrawal is never paid." },
          { icon: "search", title: "How to spot an unlicensed casino", body: "Scroll to the footer of any casino and look for the regulator's name and a licence number, then check that number on the regulator's own website.\n\n- No licence number, or one you cannot verify\n- Withdrawals only in cryptocurrency\n- Bonuses with no published terms\n- No identity check before your first withdrawal" },
          { icon: "dice", title: "Which games can you play legally?", body: "Licensed online casinos can offer slots, table games such as blackjack and roulette, live dealer games, video poker and crash games, as long as each game is certified.\n\nWhat a casino may offer varies by market, so check your regulator's rules. Every casino on our list only offers the games its licence covers." },
        ],
      }],
      ["infoSection", {
        eyebrow: "Our method",
        title: "How we rate online casinos",
        lead: "Every casino is scored on the same four tests, using our own real-money accounts. Casinos cannot pay for a higher position, and a casino that slows down payouts drops down the list.",
        columns: "2",
        band: true,
        items: [
          { icon: "shield", title: "Licence and safety (30%)", body: "We confirm the licence with the regulator, check how player funds are protected and look for independent game testing certificates. A casino without a valid licence is never listed, whatever else it offers." },
          { icon: "scale", title: "Bonus terms (25%)", body: "We read the full terms of every welcome offer: wagering requirement, maximum bet while wagering, game weighting, expiry and any cap on winnings. A smaller bonus with fair terms scores higher than a large one you are unlikely to clear." },
          { icon: "wallet", title: "Payments (25%)", body: "We deposit and withdraw real money with at least two methods and time every payout from request to arrival. We also record minimum deposits, fees and any verification steps that delay the first withdrawal." },
          { icon: "headset", title: "Games and support (20%)", body: "We count the games, check which studios supply them and test the site on mobile. Then we contact support by live chat and email with the same three questions and score the speed and accuracy of the answers." },
        ],
      }],
      ["casinoComparison", {
        eyebrow: "Payments",
        title: "Fastest-paying online casinos",
        lead: "These casinos paid our test withdrawals the fastest. Minimum deposits and wagering are shown so you can compare the full picture at a glance.",
        columns: ["withdrawalTime", "minDeposit", "paymentMethods", "wagering", "rating"],
        casinos: [pick("novaspin"), pick("royal-harbor"), pick("velvet-ace"), pick("lucky-ember"), pick("starlight-slots")],
        footnote: "Withdrawal times measured on our own accounts with e-wallets after identity verification. Times vary by payment method.",
      }],
      ["casinoSpotlight", {
        eyebrow: "Bonuses",
        title: "Best casino for each type of bonus",
        lead: "The best bonus depends on how you play. These are our picks for each type of offer, judged on terms as much as size.",
        numbered: false,
        picks: [
          pick("golden-fjord", { label: "Biggest deposit bonus", text: "Golden Fjord matches your first deposit 100% up to €1,000, the largest offer on our list. The 35x wagering means it suits regular players who deposit larger amounts; casual players will get more value from a smaller bonus with lower wagering." }),
          pick("novaspin", { label: "Free spins with no wagering", text: "NovaSpin's 200 free spins come with no wagering on winnings, so anything you win is paid as real money straight away. It is the simplest offer on our list to understand and to cash out." }),
          pick("crown-and-clover", { label: "No-deposit bonus", text: "Crown & Clover gives new players €20 to try the casino without depositing. Winnings are capped at €100 and carry 40x wagering, so treat it as a free trial rather than a way to win big." }),
          pick("lucky-ember", { label: "Cashback", text: "Lucky Ember returns a share of your weekly net losses as cash with no wagering. For regular players, steady cashback is often worth more than a one-off welcome bonus." }),
        ],
      }],
      ["marketRanking", {
        eyebrow: "Market data",
        title: "Most searched online casinos last month",
        lead: "How often players searched for each casino last month, and how that changed from the month before. Updated every month.",
        metricLabel: "Searches",
        limit: 8,
        footnote: "Demo data for layout only. Replace with monthly search volumes from your keyword tool and name the source here.",
      }],
      ["topicCards", {
        eyebrow: "Game guides",
        title: "Learn the games before you play",
        lead: "Short, practical guides to the most popular casino games: how they work, the odds and the mistakes to avoid.",
        items: [
          { icon: "star", title: "Slots", body: "How paylines, volatility and RTP work, and how to choose a slot that fits your budget and the way you like to play." },
          { icon: "dice", title: "Roulette", body: "European, American and French roulette compared, with the house edge of every bet and why the single-zero wheel matters." },
          { icon: "cards", title: "Blackjack", body: "Basic strategy in one table, when to split and double, and how table rules change the house edge." },
          { icon: "eye", title: "Live casino", body: "What to expect from live dealer tables, minimum bets, game shows and how live games are streamed and regulated." },
          { icon: "trophy", title: "Poker", body: "Video poker and live casino poker explained, from hand rankings to the pay tables that give the best return." },
          { icon: "bolt", title: "Crash games", body: "How crash games work, why they move so fast and how to set limits before you play a single round." },
        ],
      }],
      ["blogList", { eyebrow: "Guides and news", title: "Latest from our review team", description: "Practical guides to bonuses, payments and playing safely, plus news on new casinos and the market.", initialCount: 6, step: 3, limit: 9, showFilters: true, loadMoreLabel: "More guides", allLabel: "See all guides", allUrl: "/blog" }],
      ["infoSection", {
        eyebrow: "Why play online",
        title: "Advantages of online casinos",
        lead: "Online casinos give you more games, better odds on many of them and more control over your spending than most land-based venues.",
        columns: "2",
        items: [
          { icon: "gamepad", title: "Far more games", body: "A typical licensed online casino offers 1,000 to 4,000 games, from classic three-reel slots to live dealer game shows. A large land-based casino rarely has more than a few hundred machines and tables." },
          { icon: "chart", title: "Higher returns on many games", body: "Online slots commonly return 94% to 97% of stakes over time, published as RTP. Lower running costs mean online casinos can offer higher returns than physical machines, and the figure is public before you play." },
          { icon: "lock", title: "Built-in spending controls", body: "Licensed casinos let you set deposit, loss and session limits, take a break or exclude yourself entirely. Every bet is recorded in your account history, so you always know where you stand." },
          { icon: "gift", title: "Bonuses and rewards", body: "Welcome offers, free spins, cashback and loyalty programmes add value that land-based venues rarely match. Read the terms first: the wagering requirement decides how much a bonus is really worth." },
        ],
      }],
      ["infoSection", {
        eyebrow: "Play safely",
        title: "Keep gambling fun",
        lead: "Gambling should be entertainment you can afford, never a way to make money. These habits keep it that way.",
        columns: "3",
        band: true,
        items: [
          { icon: "wallet", title: "Set a budget first", body: "Decide how much you can afford to lose before you deposit, and set a deposit limit in your account to enforce it. Never use money meant for bills or savings." },
          { icon: "clock", title: "Watch the time", body: "Use the reality check in your casino account to remind you how long you have been playing, and stop when the timer goes off, whether you are winning or losing." },
          { icon: "heart", title: "Know the warning signs", body: "Chasing losses, hiding your gambling or borrowing to play are signs it has stopped being fun. Read our [responsible gambling guide](/responsible-gambling) and talk to someone you trust." },
        ],
      }],
      ["logoStrip", { title: "As seen in" }],
      ["landingTeam", { variant: "strip", eyebrow: "Our team", title: "Who writes our reviews", description: "Every review is written by a specialist and checked by an editor before it goes live.", linkLabel: "Meet the team", linkUrl: "/about#team" }],
      ["FAQ", { eyebrow: "FAQ", title: "Online casino questions", schema: true, entries: [
        { question: "Are online casinos legal?", answer: "Online casinos are legal when they hold a licence from your country's gambling regulator. Every casino on our list is licensed, and each review shows the licence number so you can verify it yourself." },
        { question: "Which online casino is the best?", answer: `Royal Harbor is our top-rated casino in ${month} ${year} for its fast payouts, fair bonus terms and large live casino. The best choice for you depends on how you play, so use the Bonus and Newest tabs to sort the list.` },
        { question: "Which casino pays out the fastest?", answer: "NovaSpin and Royal Harbor paid our test withdrawals the fastest, usually within 12 to 24 hours to an e-wallet. Bank transfers take longer at every casino." },
        { question: "What is a wagering requirement?", answer: "It is the number of times you must bet a bonus before you can withdraw it. A €100 bonus with 30x wagering means €3,000 in bets. Lower is better, and 20x or less is good." },
        { question: "Can I play online casino games on my phone?", answer: "Yes. Every casino on our list works in the mobile browser, and most offer an app. We test the mobile site as part of every review." },
        { question: "Do I have to verify my identity?", answer: "Yes. Licensed casinos must verify your age and identity, usually before your first withdrawal. Uploading your documents straight after sign-up avoids delays later." },
        { question: "Are casino winnings taxed?", answer: "It depends on where you live. In some countries casino winnings are tax-free for players, in others they must be declared. Check your local tax rules or ask an adviser." },
        { question: "How do you make money?", answer: "We may earn a commission when you sign up at a casino through our links, at no extra cost to you. It never changes our ratings, and we also review casinos we have no commercial relationship with." },
      ] }],
    ],
  });
}

async function rebuildHomepage() {
  const casinos = await api("GET", "/items/casinos?fields=id,slug&limit=-1");
  for (const c of casinos) {
    if (CASINO_EXTRAS[c.slug]) await api("PATCH", `/items/casinos/${c.id}`, CASINO_EXTRAS[c.slug]);
  }
  const current = await api("GET", "/items/pages?filter[slug][_eq]=homepage&fields=id");
  for (const page of current) {
    await api("PATCH", `/items/pages/${page.id}`, { slug: `homepage-archived-${Date.now()}`, status: "archived" });
  }
  console.log("Rebuilding the homepage (the previous one is kept as an archived page):");
  await ensureDemoExtras();
  await ensureRegulationContent();
  await createHomepage();
}

function reviewDoc(c) {
  return [
    h(2, `${c.name} at a glance`),
    p(`${c.name} has been running since ${c.established}. ${c.bonusDescription} is the headline offer, with a minimum deposit of ${c.minDeposit} and withdrawals typically processed in ${c.withdrawalTime.toLowerCase()}.`),
    h(2, "Welcome bonus"),
    p(`New players get ${c.bonusDescription.toLowerCase()}. Always check the wagering requirement, the maximum bet while playing with bonus money and which games count towards it before you opt in.`),
    h(2, "Payments"),
    p(`Deposit and withdraw with ${c.payments.slice(0, -1).join(", ")} or ${c.payments.at(-1)}. Withdrawals go back to the method you deposited with where possible.`),
    h(2, "Our verdict"),
    p(`${c.name} scores ${c.rating} out of 5 in our tests. ${c.pros[0]}, but keep in mind: ${c.cons[0].toLowerCase()}.`),
  ];
}

async function seed() {
  const existing = await api("GET", "/items/pages?limit=1&fields=id");
  if (existing.length && !args.has("--force-seed")) {
    console.log("Content already exists, seed skipped (use --force-seed to add the demo content anyway).");
    return;
  }

  console.log("Seeding demo content (fictional casinos, for layout only):");

  await api("PATCH", "/items/theme", {});
  await api("PATCH", "/items/footer", {
    disclaimer:
      "18+ only. Gambling can be addictive: play responsibly and only with money you can afford to lose. We are an independent comparison site and may earn a commission when you sign up through our links, at no extra cost to you. This never affects how we rate casinos. All offers are subject to the operator's terms and conditions. The casinos on this demo are fictional.",
  });

  let sort = 1;
  for (const c of CASINOS) {
    const { nodes, content } = blocksDoc("casinos_editor_node", [], reviewDoc(c));
    await api("POST", "/items/casinos", {
      status: "published",
      sort: sort++,
      name: c.name,
      slug: c.slug,
      brandColor: c.brandColor,
      rating: c.rating,
      affiliateUrl: `https://example.com/?casino=${c.slug}&ref=demo`,
      bonusLabel: c.bonusLabel,
      bonusValue: c.bonusValue,
      bonusDescription: c.bonusDescription,
      highlights: c.highlights.map((text) => ({ text })),
      paymentMethods: c.payments.map((name) => ({ name })),
      licence: "Demo licence 000",
      ...CASINO_EXTRAS[c.slug],
      established: c.established,
      minDeposit: c.minDeposit,
      withdrawalTime: c.withdrawalTime,
      summary: `${c.name} offers ${c.bonusDescription.toLowerCase()}, pays out in ${c.withdrawalTime.toLowerCase()} and accepts ${c.payments.slice(0, 3).join(", ")}.`,
      pros: c.pros.map((text) => ({ text })),
      cons: c.cons.map((text) => ({ text })),
      index: true,
      content,
      review_nodes: nodes,
    });
  }
  console.log(`  ${CASINOS.length} casinos`);

  const menus = [
    { key: "main-menu", title: "Main menu", entrys: [
      { anchor: "Casinos", url: "/casinos" }, { anchor: "Guides", url: "/blog" }, { anchor: "Responsible gambling", url: "/responsible-gambling" }, { anchor: "About", url: "/about" },
    ] },
    { key: "footer-menu-1", title: "Top casinos", entrys: CASINOS.slice(0, 4).map((c) => ({ anchor: `${c.name} review`, url: `/review/${c.slug}` })) },
    { key: "footer-menu-2", title: "Company", entrys: [
      { anchor: "About us", url: "/about" }, { anchor: "Guides", url: "/blog" }, { anchor: "Responsible gambling", url: "/responsible-gambling" }, { anchor: "Contact", url: "/contact" },
    ] },
    { key: "footer-menu-3", title: "Legal", entrys: [
      { anchor: "Privacy", url: "/privacy-policy" }, { anchor: "Terms", url: "/terms" }, { anchor: "Advertiser disclosure", url: "/advertiser-disclosure" },
    ] },
    { key: "footer-menu-4", title: "Social", entrys: [
      { anchor: "X", url: "https://x.com", target: "_BLANK", rel: "nofollow" },
      { anchor: "Instagram", url: "https://instagram.com", target: "_BLANK", rel: "nofollow" },
      { anchor: "YouTube", url: "https://youtube.com", target: "_BLANK", rel: "nofollow" },
    ] },
  ];
  await api("POST", "/items/menus", menus);
  console.log("  menus");

  const guides = await api("POST", "/items/categories", { status: "published", name: "Casino guides", slug: "guides", description: "How to pick a casino and play smarter." });
  const bonuses = await api("POST", "/items/categories", { status: "published", name: "Bonuses", slug: "bonuses", description: "Welcome offers, free spins and how wagering really works." });

  const articles = [
    { title: "How to choose a safe online casino", shortTitle: "Choosing a safe casino", slug: "choose-a-safe-casino", summary: "The five checks we run on every casino before it makes our list.", category: guides.id,
      content: [p("A good casino is licensed, pays on time and is upfront about its terms. Here is how to check all three in five minutes."), h(2, "1. Check the licence"), p("Scroll to the footer and look for the licence number. Look it up on the regulator's website."), h(2, "2. Read the bonus terms"), p("Wagering, maximum bet and game weighting matter more than the headline number."), h(2, "3. Test the support"), p("Open live chat before you deposit and ask a simple question about withdrawals.")] },
    { title: "Wagering requirements explained", shortTitle: "Wagering explained", slug: "wagering-requirements", summary: "What 35x actually means for your bonus, with worked examples.", category: bonuses.id,
      content: [p("A wagering requirement is how many times you must bet the bonus before you can withdraw it."), h(2, "A worked example"), p("A €100 bonus with 35x wagering means €3,500 in bets before the bonus turns into cash."), ul(["Lower is better: 20x or less is good", "Check which games count 100%", "Watch the time limit"])] },
    { title: "The fastest casino withdrawal methods", shortTitle: "Fastest withdrawals", slug: "fastest-withdrawals", summary: "E-wallets, cards and bank transfers compared on speed and fees.", category: guides.id,
      content: [p("Withdrawal speed depends on the casino's processing time and the payment method."), ul(["E-wallets such as PayPal and Skrill: usually same day", "Cards: one to three days", "Bank transfer: two to five days"])] },
  ];
  for (const a of articles) {
    const { nodes, content } = blocksDoc("articles_editor_node", [], a.content);
    await api("POST", "/items/articles", {
      status: "published", index: true, showCta: true,
      title: a.title, shortTitle: a.shortTitle, slug: a.slug, summary: a.summary, metadescription: a.summary,
      content, articles_node: nodes, categories: [{ categories_id: a.category }],
    });
  }
  console.log(`  ${articles.length} guides`);

  await ensureDemoExtras();
  await ensureRegulationContent();
  await createHomepage();
  const year = new Date().getFullYear();

  await createPage({
    slug: "casinos",
    title: "Online Casinos",
    template: "landing",
    backlight: "primary",
    metatitle: `All Licensed Online Casinos (${year})`,
    metadescription: "Every licensed online casino we have reviewed, with bonuses, payment methods and our rating.",
    blocks: [
      ["landingPageHeader", { eyebrow: "Casinos", title: "Every licensed casino,", titleAccent: "ranked.", description: "Sort by our recommendation, the newest casinos or the biggest bonus." }],
      ["casinoList", { licensedLabel: "Licensed casinos only", topBadge: "Our pick", showSort: true }],
    ],
  });

  await createPage({
    slug: "blog",
    title: "Guides",
    template: "landing",
    metadescription: "Casino guides on bonuses, payments and playing safely.",
    blocks: [["blogList", { headingLevel: "h1", eyebrow: "Guides", title: "Casino guides", description: "Bonuses, payments and playing safely, explained simply.", initialCount: 9, step: 6, showFilters: true, loadMoreLabel: "Load more" }]],
  });

  const authors = [
    { name: "Marta Silva", slug: "marta-silva", role: "Head of Reviews", experience: "9 years",
      bio: "Marta has reviewed more than 200 online casinos and leads the team that tests every operator on this site. Before that she worked in compliance for a licensed operator, so she reads bonus terms the way a regulator would.",
      expertise: "Licensing, bonus terms and player protection", favourite: "Live blackjack",
      tip: "Read the maximum bet rule before you play with bonus money. It is the term that voids the most winnings." },
    { name: "James Whitfield", slug: "james-whitfield", role: "Senior Editor", experience: "7 years",
      bio: "James edits every review and guide before it goes live. A former sports journalist, he turns dense terms and conditions into plain English and keeps our rankings honest and up to date.",
      expertise: "Editorial standards, guides and casino news", favourite: "European roulette",
      tip: "Set a deposit limit on day one, while you are calm, not after a losing session." },
    { name: "Inês Duarte", slug: "ines-duarte", role: "Payments Analyst", experience: "5 years",
      bio: "Inês makes the real-money deposits and withdrawals behind our payout ratings. She times every withdrawal and flags any casino that adds friction or hidden fees.",
      expertise: "Payment methods, withdrawal speed and fees", favourite: "Megaways slots",
      tip: "Withdraw to an e-wallet when you can. It is usually the fastest route back to your bank." },
    { name: "Tom Becker", slug: "tom-becker", role: "Responsible Gambling Lead", experience: "6 years",
      bio: "Tom checks that every casino we list offers proper safer-gambling tools, and writes our responsible gambling guides. He has worked with support charities on player protection campaigns.",
      expertise: "Safer gambling tools and player wellbeing", favourite: "Video poker",
      tip: "Treat gambling as the cost of entertainment, never as a way to make money." },
  ];
  let authorSort = 1;
  for (const a of authors) {
    await api("POST", "/items/authors", { ...a, status: "published", sort: authorSort++, links: [{ label: "LinkedIn", url: "https://www.linkedin.com" }] });
  }
  console.log(`  ${authors.length} authors`);

  await createPage({
    slug: "about",
    title: "About us",
    template: "landing",
    backlight: "primary",
    metatitle: "About Us: Meet the Team Behind Our Casino Reviews",
    metadescription: "Who we are, how we review online casinos, the experts behind every rating and how we make money.",
    blocks: [
      ["landingPageHeader", { eyebrow: "About us", title: "Casino reviews you can", titleAccent: "actually trust.", description: "We are an independent team of casino reviewers, editors and analysts. Since 2019 we have tested licensed online casinos with real money so you can choose where to play with confidence." }],
      ["landingManifesto", { eyebrow: "In numbers", title: "Tested, not", titleAccent: "copied.", facts: [{ label: "200+ casinos tested" }, { label: "1,500+ real-money withdrawals" }, { label: "Rankings updated monthly" }] }],
      ["landingFeatureCards", { eyebrow: "What we publish", title: "Three kinds of content,", titleAccent: "one standard.", description: "Everything we publish is researched by our own team and checked by an editor before it goes live.", items: [
        { icon: "target", title: "Casino reviews", description: "In-depth reviews based on our own deposits, games and withdrawals at every licensed casino." },
        { icon: "layers", title: "Guides", description: "Plain-English guides to bonuses, wagering, payments and the games themselves, for beginners and regulars." },
        { icon: "spark", title: "News and analysis", description: "Regulation changes, new casinos and market trends, explained for players." },
      ] }],
      ["landingSteps", { eyebrow: "How we review", title: "The same four tests for every casino.", steps: [
        { title: "Licence and safety", description: "We verify the licence with the regulator and check security and fair-play certification." },
        { title: "Bonus terms", description: "Wagering, max bet, game weighting and expiry, read line by line." },
        { title: "Real-money payments", description: "We deposit, play and withdraw, and time every payout." },
        { title: "Games and support", description: "Game variety, mobile experience and how fast live chat really answers." },
      ] }],
      ["landingTeam", { eyebrow: "Our team", title: "Meet the experts behind every rating.", description: "Our content is written by people with years of experience in online casinos, payments and player protection, and every piece is reviewed by an editor." }],
      ["logoStrip", { title: "Our reviews have been featured in" }],
      ["landingProse", { eyebrow: "Our business model", title: "How we make money", band: true, body: "Our content is free. We earn a commission when you sign up at a casino through some of our links, at no extra cost to you. That income keeps the site running.\n\nIt never buys a better rating. We also review casinos we have no commercial relationship with, because you deserve the full picture. Read the full [advertiser disclosure](/advertiser-disclosure)." }],
      ["landingPageCta", { eyebrow: "Still have questions?", title: "Talk to the team.", description: "Spotted an outdated bonus, or had a problem with a casino we list? Tell us.", buttonLabel: "Contact us", buttonUrl: "/contact", secondaryLabel: "", variant: "statement" }],
    ],
  });

  const prosePage = (slug, title, eyebrow, metadescription, body) =>
    createPage({ slug, title, template: "landing", metadescription, blocks: [["landingPageHeader", { eyebrow, title }], ["landingProse", { body }]] });

  await prosePage("responsible-gambling", "Responsible gambling", "Play safe", "Tips and tools to keep gambling fun, and where to get help.",
    "## Gambling should be fun\n\nSet a budget before you play and never chase losses. Gambling is entertainment, not a way to make money.\n\n## Tools every licensed casino offers\n\n- Deposit, loss and session limits\n- Reality checks that remind you how long you've played\n- Time-outs and self-exclusion\n\n## Getting help\n\nIf gambling stops being fun, talk to someone. Replace this paragraph with the helplines for your market.");
  await prosePage("advertiser-disclosure", "Advertiser disclosure", "Legal", "How we make money and how that does not affect our ratings.",
    "## How we make money\n\nSome links on this site are affiliate links. If you sign up through them we may earn a commission, at no extra cost to you.\n\n## How that affects our ratings\n\nIt doesn't. Casinos cannot pay for a higher position. Rankings come from our own tests.");
  await prosePage("privacy-policy", "Privacy Policy", "Legal", "How we collect, use and protect your data.",
    "## Placeholder\n\nReplace this with your own privacy policy before going live.");
  await prosePage("terms", "Terms of Service", "Legal", "The terms that apply when you use this website.",
    "## Placeholder\n\nReplace this with your own terms before going live.");

  await api("POST", "/items/redirects", { from: "/home", to: "/" });
  console.log("  redirect /home -> /");
}

await login();
await grantPublicPermissions();
await repairDisplayTemplates();
await setupRevalidationFlow();
if (args.has("--rebuild-homepage")) await rebuildHomepage();
else if (!args.has("--no-seed")) await seed();
console.log("Done.");
