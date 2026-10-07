import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import { site } from "@/site.config";
import assetUrl from "@/helpers/functions/assetUrl";

const CARD_FIELDS = [
  "id", "name", "slug", "brandColor", "rating", "sort", "date_created",
  "bonusLabel", "bonusValue", "bonusDescription", "terms",
  "highlights", "paymentMethods", "licence",
  "logo.filename_disk", "logo.width", "logo.height",
  "summary", "wagering", "gameCount", "liveCasino", "minDeposit", "withdrawalTime", "established", "launched",
];

const REVIEW_FIELDS = [
  ...CARD_FIELDS,
  "licenceUrl", "pros", "cons", "content", "date_updated",
  "metatitle", "metadescription", "index",
  "review_nodes.id", "review_nodes.collection", "review_nodes.item.*",
  "review_nodes.item.image.filename_disk", "review_nodes.item.image.width", "review_nodes.item.image.height",
];

const INACTIVE = ["suspended", "revoked"];

const ACTIVE_FILTER = {
  status: { _eq: "published" },
  _or: [{ licenceStatus: { _null: true } }, { licenceStatus: { _nin: INACTIVE } }],
};

const texts = (rows, key) =>
  (Array.isArray(rows) ? rows : [])
    .map((r) => (typeof r === "string" ? r : r?.[key]))
    .filter((t) => typeof t === "string" && t.trim() !== "");

export function toCard(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    brandColor: c.brandColor || null,
    rating: Number(c.rating) || 0,
    sort: c.sort ?? 0,
    createdAt: c.launched ?? c.date_created ?? null,
    launched: c.launched ?? null,
    bonusLabel: c.bonusLabel || null,
    bonusValue: Number(c.bonusValue) || 0,
    bonusDescription: c.bonusDescription || null,
    terms: c.terms || site.compliance.defaultTerms,
    highlights: texts(c.highlights, "text").slice(0, 3),
    paymentMethods: texts(c.paymentMethods, "name"),
    licence: c.licence || null,
    summary: c.summary || null,
    wagering: c.wagering || null,
    gameCount: Number(c.gameCount) || null,
    liveCasino: typeof c.liveCasino === "boolean" ? c.liveCasino : null,
    minDeposit: c.minDeposit || null,
    withdrawalTime: c.withdrawalTime || null,
    established: c.established || null,
    logo: c.logo ? { src: assetUrl(c.logo), width: c.logo.width ?? null, height: c.logo.height ?? null } : null,
    reviewHref: `${site.affiliate.reviewPath}/${c.slug}`,
    visitHref: `${site.affiliate.goPath}/${c.slug}`,
  };
}

export async function getCasinos() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos");
  return fetchWithCache(
    "casinos:all",
    () =>
      apiClient().request(
        readItems("casinos", {
          fields: CARD_FIELDS,
          filter: ACTIVE_FILTER,
          sort: ["sort", "name"],
          limit: -1,
        })
      ),
    { fallback: [] }
  );
}

export async function getCasinoCards({ ids = [], limit, exclude, sortBy } = {}) {
  const loaded = (await getCasinos()).map(toCard);
  const all = sortBy === "newest" ? [...loaded].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) : loaded;
  const byId = new Map(all.map((c) => [c.id, c]));
  const picked = ids.length ? ids.map((id) => byId.get(id)).filter(Boolean) : all;
  const filtered = exclude ? picked.filter((c) => c.slug !== exclude) : picked;
  return Number(limit) > 0 ? filtered.slice(0, Number(limit)) : filtered;
}

export async function getCasino(slug) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos", "blocks");
  const rows = await apiClient().request(
    readItems("casinos", {
      fields: REVIEW_FIELDS,
      filter: { ...ACTIVE_FILTER, slug: { _eq: slug } },
      limit: 1,
    })
  );
  return rows?.[0] ?? null;
}

export async function getCasinoParams() {
  const params = (await getCasinos()).filter((c) => c.slug).map((c) => ({ slug: c.slug }));
  return params.length ? params : [{ slug: "__none__" }];
}

export async function getAffiliateUrl(slug) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos");
  try {
    const rows = await apiClient().request(
      readItems("casinos", { fields: ["affiliateUrl"], filter: { ...ACTIVE_FILTER, slug: { _eq: slug } }, limit: 1 })
    );
    return rows?.[0]?.affiliateUrl?.trim() || null;
  } catch {
    return null;
  }
}

export async function getLicenceRegister() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos");
  const rows = await fetchWithCache(
    "casinos:register",
    () =>
      apiClient().request(
        readItems("casinos", {
          fields: ["id", "name", "slug", "brandColor", "licence", "licenceUrl", "licenceStatus", "logo.filename_disk", "logo.width", "logo.height"],
          filter: { status: { _eq: "published" } },
          sort: ["name"],
          limit: -1,
        })
      ),
    { fallback: [] }
  );
  return rows.map((c) => {
    const status = c.licenceStatus || "active";
    return {
      id: c.id,
      name: c.name,
      brandColor: c.brandColor || null,
      logo: c.logo ? { src: assetUrl(c.logo), width: c.logo.width ?? null, height: c.logo.height ?? null } : null,
      licence: c.licence || null,
      licenceUrl: c.licenceUrl || null,
      status,
      reviewHref: INACTIVE.includes(status) ? null : `${site.affiliate.reviewPath}/${c.slug}`,
    };
  });
}
