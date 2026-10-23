import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import assetUrl from "@/helpers/functions/assetUrl";
import { sectionPath } from "@/lib/catalog";
import { num } from "@/lib/cms";
import { site } from "@/site.config";

const CARD_FIELDS = [
  "id", "name", "slug", "symbol", "rtp", "volatility", "maxWin", "releaseDate", "demo", "index",
  "themes", "mechanics", "hasBuyFeature",
  "thumbnail.filename_disk", "thumbnail.width", "thumbnail.height",
  "provider.id", "provider.name", "provider.slug", "provider.status",
  "gameType.id", "gameType.name", "gameType.slug", "gameType.status",
];

const PAGE_FIELDS = [
  ...CARD_FIELDS,
  "rtpVariants", "payType", "reels", "rows", "paylines", "symbolPays", "minBet", "maxBet", "maxBetAnte",
  "maxBonusBuy", "hasAnteBet", "hasInstantBonus", "hasReplay", "isJackpot", "jackpot",
  "description", "body", "metatitle", "metadescription", "date_updated",
];

const jurisdictionFilter = () => {
  const list = site.games.jurisdictions;
  return list.length ? { _or: list.map((j) => ({ jurisdictions: { _contains: j } })) } : {};
};

const FILTER = () => ({
  status: { _eq: "published" },
  slug: { _nnull: true },
  provider: { status: { _eq: "published" } },
  gameType: { status: { _eq: "published" } },
  ...jurisdictionFilter(),
});

const gamesPath = () => sectionPath("games");

export function gameHref(game) {
  const path = gamesPath();
  return path && game?.gameType?.slug && game.slug ? `/${path}/${game.gameType.slug}/${game.slug}` : null;
}

export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

const formatNumber = (n) => (n == null ? null : new Intl.NumberFormat(site.locale).format(n));

export function gameValues(game) {
  return {
    name: game.name,
    provider: game.provider?.name ?? "",
    type: game.gameType?.name?.toLowerCase() ?? "",
    rtp: game.rtp != null ? num(game.rtp).toFixed(2) : "",
    volatility: site.games.volatility[game.volatility]?.toLowerCase() ?? "",
    maxWin: formatNumber(game.maxWin) ?? "",
  };
}

export function demoUrl(game) {
  const template = site.games.demo.urls[game.provider?.slug];
  if (!game.demo || !game.symbol || !template) return null;
  const { lang, currency } = site.games.demo;
  return fill(template, {
    symbol: encodeURIComponent(game.symbol),
    lang: encodeURIComponent(lang),
    currency: encodeURIComponent(currency),
    lobbyUrl: encodeURIComponent(`${site.url}${gameHref(game) ?? ""}`),
  });
}

export function toGameCard(game) {
  return {
    id: game.id,
    name: game.name,
    href: gameHref(game),
    thumbnail: game.thumbnail?.filename_disk
      ? { src: assetUrl(game.thumbnail), width: game.thumbnail.width || 325, height: game.thumbnail.height || 234 }
      : null,
    provider: game.provider?.name ?? null,
    providerId: game.provider?.id ?? null,
    type: game.gameType?.name ?? null,
    typeId: game.gameType?.id ?? null,
    bonusBuy: Boolean(game.hasBuyFeature),
    rtp: num(game.rtp, null),
    volatility: game.volatility ?? null,
    maxWin: game.maxWin ?? null,
    releaseDate: game.releaseDate ?? null,
    tags: [...(game.themes ?? []), ...(game.mechanics ?? [])],
  };
}

export async function getGames() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("gameTitles");
  return fetchWithCache(
    "games:all",
    () =>
      apiClient().request(
        readItems("gameTitles", { fields: CARD_FIELDS, filter: FILTER(), sort: ["-releaseDate", "name"], limit: -1 })
      ),
    { fallback: [] }
  );
}

export async function getGameCards({ type, provider, exclude, limit } = {}) {
  const cards = (await getGames()).map(toGameCard).filter((g) => g.href);
  const filtered = cards.filter(
    (g) => (!type || g.typeId === type) && (!provider || g.providerId === provider) && g.id !== exclude
  );
  return Number(limit) > 0 ? filtered.slice(0, Number(limit)) : filtered;
}

export async function getGame(typeSlug, slug) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("gameTitles");
  const rows = await fetchWithCache(
    `games:${typeSlug}:${slug}`,
    () =>
      apiClient().request(
        readItems("gameTitles", {
          fields: PAGE_FIELDS,
          filter: { ...FILTER(), slug: { _eq: slug }, gameType: { slug: { _eq: typeSlug }, status: { _eq: "published" } } },
          limit: 1,
        })
      ),
    { fallback: [] }
  );
  return rows[0] ?? null;
}

export async function getSimilarGames(game, limit = 8) {
  const own = new Set([...(game.themes ?? []), ...(game.mechanics ?? [])]);
  const cards = await getGameCards({ provider: game.provider?.id, exclude: game.id });
  return cards
    .map((card, i) => ({ card, score: card.tags.filter((t) => own.has(t)).length * 100 - i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.card);
}

export async function getGameParams() {
  const path = gamesPath();
  const params = path
    ? (await getGames()).filter((g) => g.gameType?.slug).map((g) => ({ slug: path, item: g.gameType.slug, game: g.slug }))
    : [];
  return params.length ? params : [{ slug: "__none__", item: "__none__", game: "__none__" }];
}
