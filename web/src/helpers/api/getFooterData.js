import { cacheLife, cacheTag } from "next/cache";
import { readSingleton } from "@directus/sdk";
import { footerQuery } from "@/queries/footer-query";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";

const getFooterData = async () => {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
  cacheTag("footer");
    const cacheKey = "general:footer";
    return fetchWithCache(cacheKey, async () => {
        return apiClient().request(
            readSingleton("footer", {
                fields: footerQuery(),
            }),
        );
    }, { fallback: {} });
};

export default getFooterData;
