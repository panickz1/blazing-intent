import { readSheet } from "read-excel-file/node";

const BASE = (process.env.SETUP_DIRECTUS_URL || process.env.PUBLIC_URL || "http://localhost:8055").replace(/\/$/, "");
const argv = process.argv.slice(2);
const option = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const FILE = argv.find((a) => !a.startsWith("--")) || "data/pragmatic-slots.xlsx";
const PROVIDER = option("provider", "pragmatic-play");
const GAME_TYPE = option("type", "slots");
const DRY_RUN = argv.includes("--dry-run");
const SKIP_IMAGES = argv.includes("--no-images");
const THUMBNAIL_URL = "https://common-static.ppgames.net/game_pic/rec/325/{symbol}.png";
const STATS_FIELDS = [
  "numericId", "releaseDate", "countryExclusive", "rtp", "rtpVariants", "volatility", "payType", "reels", "rows", "paylines",
  "symbolPays", "minBet", "maxBet", "defaultBet", "maxBetAnte", "maxWin", "hasBuyFeature", "maxBonusBuy", "hasAnteBet",
  "hasInstantBonus", "hasReplay", "isJackpot", "jackpot", "themes", "mechanics", "jurisdictions", "sourceDescription",
];

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
  token = (await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD })).access_token;
}

const clean = (v) => (v == null ? "" : String(v).trim());
const yes = (v) => /^yes$/i.test(clean(v));
const list = (v) => clean(v).split(/\s*,\s*/).filter(Boolean);
const number = (v) => {
  const n = Number.parseFloat(clean(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};
const positive = (v) => {
  const n = number(v);
  return n && n > 0 ? n : null;
};

const slugify = (name) =>
  name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function payInfo(raw) {
  const text = clean(raw);
  const type = text.match(/Pay Type\s*:\s*([^\n]+)/i)?.[1].trim().toLowerCase() ?? "";
  const value = text.match(/(?:Pay Lines|Lines|Max Ways|Symbol Pays)\s*:\s*([^\n]+)/i)?.[1].trim() ?? "";
  const payType = { lines: "lines", ways: "ways", megaways: "megaways", "cluster pays": "cluster", "pay anywhere": "anywhere" }[type] ?? null;
  const counted = payType === "lines" || payType === "ways" || payType === "megaways";
  const count = counted ? Number.parseInt(value.match(/[\d,]+/g)?.pop()?.replace(/,/g, "") ?? "", 10) : NaN;
  return {
    payType,
    paylines: Number.isFinite(count) ? count : null,
    symbolPays: counted ? null : value.replace(/\s*-\s*/g, "-") || null,
  };
}

function toGame(row) {
  const rtps = clean(row["RTPs"])
    .split(/\s+/)
    .map(number)
    .filter((n) => n != null)
    .sort((a, b) => b - a);
  const [reels, rows] = clean(row["Game Format"]).split(/\s*x\s*/i).map((n) => Number.parseInt(n, 10));
  const released = row["Release Date"] instanceof Date ? row["Release Date"] : null;
  return {
    name: clean(row["Game Name"]).replace(/\s*–\s*/g, " - "),
    symbol: clean(row["Game ID"]),
    numericId: clean(row["Numeric ID"]) || null,
    releaseDate: released ? released.toISOString().slice(0, 10) : null,
    countryExclusive: yes(row["Country Exclusive"]),
    rtp: rtps[0] ?? null,
    rtpVariants: rtps.map((n) => n.toFixed(2)),
    volatility: clean(row["Volatility"]).toLowerCase() || null,
    ...payInfo(row["Pay Type"]),
    reels: Number.isFinite(reels) ? reels : null,
    rows: Number.isFinite(rows) ? rows : null,
    minBet: positive(row["Minimum Total Bet"]),
    maxBet: positive(row["Maximum Total Bet"]),
    defaultBet: positive(row["Default Bet"]),
    maxBetAnte: positive(row["Maximum Total Bet With Ante"]),
    maxWin: positive(row["Max Multiplier"]),
    hasBuyFeature: yes(row["Buy Feature \n(where allowed)"]),
    maxBonusBuy: positive(row["Max Bonus Buy"]),
    hasAnteBet: yes(row["Ante Bet"]),
    hasInstantBonus: yes(row["Has Instant Bonus"]),
    hasReplay: yes(row["Pragmatic Replay"]),
    isJackpot: yes(row["Is Jackpot Game"]) || Boolean(clean(row["Jackpots"])),
    jackpot: clean(row["Jackpots"]) || null,
    themes: list(row["Game Themes"]),
    mechanics: list(row["Game Mechanics"]),
    jurisdictions: list(row["Jurisdiction"]),
    sourceDescription: clean(row["Game Description"]).replace(/\n{3,}/g, "\n\n") || null,
  };
}

async function readGames(file) {
  const [header, ...rows] = await readSheet(file);
  return rows
    .map((cells) => Object.fromEntries(header.map((h, i) => [h, cells[i]])))
    .filter((row) => clean(row["Game ID"]) && clean(row["Game Name"]))
    .map(toGame);
}

async function idBySlug(collection, slug) {
  const rows = await api("GET", `/items/${collection}?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=id&limit=1`);
  if (!rows?.length) throw new Error(`No ${collection} with slug "${slug}". Create it in Directus first.`);
  return rows[0].id;
}

async function importThumbnail(game) {
  const file = await api("POST", "/files/import", {
    url: THUMBNAIL_URL.replace("{symbol}", game.symbol),
    data: { title: game.name, filename_download: `${slugify(game.name)}.png` },
  });
  return file.id;
}

async function inBatches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(fn));
}

async function main() {
  await login();
  const [provider, gameType] = await Promise.all([idBySlug("providers", PROVIDER), idBySlug("games", GAME_TYPE)]);
  const today = new Date().toISOString().slice(0, 10);
  const all = await readGames(FILE);
  const released = all.filter((g) => !g.releaseDate || g.releaseDate <= today);
  const existing = await api("GET", "/items/gameTitles?fields=id,symbol,slug,thumbnail&limit=-1");
  const bySymbol = new Map(existing.filter((g) => g.symbol).map((g) => [g.symbol, g]));
  const slugs = new Set(existing.map((g) => g.slug));
  const counts = { created: 0, updated: 0, thumbnails: 0, failed: 0, upcoming: all.length - released.length };

  await inBatches(released, 6, async (game) => {
    const current = bySymbol.get(game.symbol);
    try {
      if (current) {
        const patch = Object.fromEntries(STATS_FIELDS.map((f) => [f, game[f]]));
        if (!current.thumbnail && !SKIP_IMAGES && !DRY_RUN) {
          patch.thumbnail = await importThumbnail(game).catch(() => null);
          if (patch.thumbnail) counts.thumbnails++;
        }
        if (!DRY_RUN) await api("PATCH", `/items/gameTitles/${current.id}`, patch);
        counts.updated++;
        return;
      }
      let slug = slugify(game.name);
      if (slugs.has(slug)) slug = `${slug}-${slugify(game.symbol)}`;
      slugs.add(slug);
      const thumbnail = SKIP_IMAGES || DRY_RUN ? null : await importThumbnail(game).catch(() => null);
      if (thumbnail) counts.thumbnails++;
      if (!DRY_RUN) {
        await api("POST", "/items/gameTitles", { ...game, slug, provider, gameType, thumbnail, status: "published", demo: true, index: true });
      }
      counts.created++;
    } catch (error) {
      counts.failed++;
      console.error(`${game.symbol}: ${error.message}`);
    }
  });

  console.log(
    `${DRY_RUN ? "Dry run: " : ""}${counts.created} created, ${counts.updated} updated, ${counts.thumbnails} thumbnails, ` +
      `${counts.upcoming} not released yet (skipped), ${counts.failed} failed.`
  );
}

await main();
