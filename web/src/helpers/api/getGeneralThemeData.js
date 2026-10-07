import { cacheLife, cacheTag } from "next/cache";
import { readSingleton } from "@directus/sdk";
import { themeQuery } from "@/queries/theme-query";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";

const getGeneralThemeData = async () => {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
  cacheTag("theme");
    const cacheKey = "general:theme";
    return fetchWithCache(cacheKey, async () => {
        return apiClient().request(
            readSingleton("theme", {
                fields: themeQuery(),
            }),
        );
    }, { fallback: {} });
};

export default getGeneralThemeData;
