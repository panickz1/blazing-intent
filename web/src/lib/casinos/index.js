import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import { site } from "@/site.config";
import assetUrl from "@/helpers/functions/assetUrl";
import { toAttribute } from "@/lib/catalog";

const LOGO = ["logo.filename_disk", "logo.width", "logo.height"];
const related = (field, collection = field, extra = [], itemExtra = []) => [
  ...extra.map((f) => `${field}.${f}`),
  ...["id", "name", "slug", "status", ...LOGO, ...itemExtra].map((f) => `${field}.${collection}_id.${f}`),
];

const WITH_CODE = new Set(["regions", "languages"]);

const ATTRIBUTE_FIELDS = ["licences", "providers", "games", "sports", "support", "regions", "languages"];

const BONUS_FIELDS = ["id", "status", "sort", "name", "headline", "amount", "description", "terms", "wagering", "minDeposit", "code", "freeSpins", "maxWin", "minOdds", "validUntil", "howToClaim", "info", "bonusTypes.bonusTypes_id.name", "bonusTypes.bonusTypes_id.slug"];

const DEEP = {
  bonuses: { _filter: { status: { _eq: "published" } }, _sort: ["sort", "id"] },
  paymentMethods: { _sort: ["sort", "id"] },
};

const CARD_FIELDS = [
  "id", "name", "slug", "brandColor", "rating", "sort", "date_created",
  "highlights", "licence",
  "logo.filename_disk", "logo.width", "logo.height",
  ...["headline", "amount", "description", "terms", "wagering", "status", "sort"].map((f) => `bonuses.${f}`),
  ...related("paymentMethods", "paymentMethods", ["minDeposit", "withdrawalTime"]),
  "summary", "gameCount", "liveCasino", "minDeposit", "withdrawalTime", "established", "launched",
];

const REVIEW_FIELDS = [
  ...CARD_FIELDS,
  "licenceUrl", "pros", "cons", "content", "date_updated",
  ...BONUS_FIELDS.map((f) => `bonuses.${f}`),
  ...ATTRIBUTE_FIELDS.flatMap((f) => related(f, f, [], WITH_CODE.has(f) ? ["code"] : [])),
  "organization.name", "organization.slug", "organization.status", "organization.website", ...LOGO.map((f) => `organization.${f}`),
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

const published = (row) => row && (!row.status || row.status === "published");

function relatedItems(rows, collection) {
  return (Array.isArray(rows) ? rows : [])
    .map((r) => {
      const item = r?.[`${collection}_id`];
      if (!published(item)) return null;
      const attribute = toAttribute(collection, item);
      return attribute && { ...attribute, minDeposit: r.minDeposit || null, withdrawalTime: r.withdrawalTime || null };
    })
    .filter(Boolean);
}

export function toBonus(b) {
  return {
    id: b.id,
    name: b.name,
    headline: b.headline || null,
    amount: Number(b.amount) || 0,
    description: b.description || null,
    terms: b.terms || site.compliance.defaultTerms,
    wagering: b.wagering || null,
    minDeposit: b.minDeposit || null,
    code: b.code || null,
    freeSpins: Number(b.freeSpins) || null,
    maxWin: b.maxWin || null,
    minOdds: b.minOdds || null,
    validUntil: b.validUntil || null,
    steps: texts(b.howToClaim, "text"),
    info: b.info || null,
    types: (Array.isArray(b.bonusTypes) ? b.bonusTypes : [])
      .map((t) => t?.bonusTypes_id)
      .filter((t) => t?.name)
      .map((t) => toAttribute("bonusTypes", t)),
  };
}

export function toCard(c) {
  const bonus = (Array.isArray(c.bonuses) ? c.bonuses : []).filter(published)[0] ?? null;
  const payments = relatedItems(c.paymentMethods, "paymentMethods");
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    brandColor: c.brandColor || null,
    rating: Number(c.rating) || 0,
    sort: c.sort ?? 0,
    createdAt: c.launched ?? c.date_created ?? null,
    launched: c.launched ?? null,
    bonusLabel: bonus?.headline || null,
    bonusValue: Number(bonus?.amount) || 0,
    bonusDescription: bonus?.description || null,
    terms: bonus?.terms || site.compliance.defaultTerms,
    highlights: texts(c.highlights, "text").slice(0, 3),
    paymentMethods: payments.map((p) => p.name),
    payments,
    licence: c.licence || null,
    summary: c.summary || null,
    wagering: bonus?.wagering || null,
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

export function toReviewDetails(c) {
  const { sections } = site.catalog;
  const organization = published(c.organization) ? toAttribute("organizations", c.organization) : null;
  return {
    bonuses: (Array.isArray(c.bonuses) ? c.bonuses : []).filter(published).map(toBonus),
    groups: [
      { key: "licences", label: sections.licences.label, items: relatedItems(c.licences, "licences") },
      { key: "providers", label: sections.providers.label, items: relatedItems(c.providers, "providers") },
      { key: "games", label: sections.games.label, items: relatedItems(c.games, "games") },
      { key: "sports", label: sections.sports.label, items: relatedItems(c.sports, "sports") },
      { key: "support", label: sections.support.label, items: relatedItems(c.support, "support") },
      { key: "languages", label: sections.languages.label, items: relatedItems(c.languages, "languages") },
      { key: "regions", label: sections.regions.label, items: relatedItems(c.regions, "regions") },
      { key: "operators", label: sections.operators.label, items: organization ? [organization] : [] },
    ].filter((g) => g.items.length > 0),
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
          deep: DEEP,
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

export async function getCtaCasino(candidates = []) {
  const all = await getCasinos();
  const ids = candidates.map((c) => c?.id ?? c).filter((id) => id != null);
  const found = ids.map((id) => all.find((c) => c.id === id)).find(Boolean) ?? all[0];
  return found ? toCard(found) : null;
}

export async function getCasino(slug) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos", "blocks");
  const rows = await apiClient().request(
    readItems("casinos", {
      fields: REVIEW_FIELDS,
      deep: DEEP,
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
