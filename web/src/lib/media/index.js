import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import assetUrl from "@/helpers/functions/assetUrl";

export async function getMediaMentions() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  cacheTag("mediaMentions");
  const rows = await fetchWithCache(
    "mediaMentions:all",
    () => apiClient().request(readItems("mediaMentions", { fields: ["id", "name", "url", "logo.filename_disk", "logo.width", "logo.height"], sort: ["sort", "name"], limit: -1 })),
    { fallback: [] }
  );
  return rows.map((m) => ({ ...m, logo: m.logo ? { src: assetUrl(m.logo), width: m.logo.width || 160, height: m.logo.height || 48 } : null }));
}
