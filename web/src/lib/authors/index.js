import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import assetUrl from "@/helpers/functions/assetUrl";

const FIELDS = ["id", "name", "slug", "role", "experience", "bio", "expertise", "favourite", "tip", "links", "photo.filename_disk"];

export async function getAuthors() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
  cacheTag("authors");
  return fetchWithCache(
    "authors:all",
    () => apiClient().request(readItems("authors", { fields: FIELDS, filter: { status: { _eq: "published" } }, sort: ["sort", "name"], limit: -1 })),
    { fallback: [] }
  );
}

export async function getAuthorCards(ids = []) {
  const all = (await getAuthors()).map((a) => ({
    ...a,
    photo: assetUrl(a.photo),
    links: (Array.isArray(a.links) ? a.links : []).filter((l) => l?.url),
  }));
  if (!ids.length) return all;
  const byId = new Map(all.map((a) => [a.id, a]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}
