import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import assetUrl from "@/helpers/functions/assetUrl";
import { site } from "@/site.config";

const ITEM_FIELDS = ["id", "name", "slug", "description", "body", "metatitle", "metadescription", "index", "date_updated", "logo.filename_disk", "logo.width", "logo.height"];

const sections = () => Object.entries(site.catalog.sections).filter(([, s]) => s.enabled);

export function getSection(path) {
  const section = site.catalog.sections[path];
  return section?.enabled ? { path, ...section } : null;
}

const pathFor = new Map(sections().map(([path, s]) => [s.collection, path]));

function catalogHref(collection, slug) {
  const path = pathFor.get(collection);
  return path && slug ? `/${path}/${slug}` : null;
}

export function toAttribute(collection, row) {
  if (!row?.name) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? null,
    logo: row.logo ? { src: assetUrl(row.logo), width: row.logo.width ?? null, height: row.logo.height ?? null } : null,
    href: catalogHref(collection, row.slug),
  };
}

export async function getCatalogItems(collection) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos", collection);
  return fetchWithCache(
    `catalog:${collection}`,
    () =>
      apiClient().request(
        readItems(collection, {
          fields: ITEM_FIELDS,
          filter: { status: { _eq: "published" }, slug: { _nnull: true } },
          sort: ["sort", "name"],
          limit: -1,
        })
      ),
    { fallback: [] }
  );
}

export async function getCatalogItem(collection, slug) {
  const items = await getCatalogItems(collection);
  return items.find((i) => i.slug === slug) ?? null;
}

export async function getCatalogCasinoIds(section, id) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos", section.collection);
  const filter = section.single
    ? { [section.field]: { _eq: id } }
    : { [section.field]: { [`${section.collection}_id`]: { _eq: id } } };
  const rows = await fetchWithCache(
    `catalog:${section.collection}:${id}:casinos`,
    () => apiClient().request(readItems("casinos", { fields: ["id"], filter, limit: -1 })),
    { fallback: [] }
  );
  return rows.map((r) => r.id);
}

export async function getEditorialSlugs() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("pages");
  const rows = await fetchWithCache(
    "catalog:editorial",
    () => apiClient().request(readItems("pages", { fields: ["slug"], filter: { status: { _eq: "published" } }, limit: -1 })),
    { fallback: [] }
  );
  return rows.map((r) => r.slug).filter(Boolean);
}

export async function getCatalogParams() {
  const params = [];
  for (const [path, section] of sections()) {
    const items = await getCatalogItems(section.collection);
    for (const item of items) params.push({ slug: path, item: item.slug });
  }
  return params.length ? params : [{ slug: "__none__", item: "__none__" }];
}
