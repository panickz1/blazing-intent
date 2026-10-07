import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";

const getMenus = async () => {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
  cacheTag("menus");
    const cacheKey = "general:menus";
    return fetchWithCache(cacheKey, async () => {
        return apiClient().request(readItems("menus"));
    }, { fallback: [] });
};

export default getMenus;
