import { cacheLife, cacheTag } from "next/cache";
import apiClient from "@/helpers/functions/apiClient";
import { readItems } from "@directus/sdk";
import fetchWithCache from "@/helpers/functions/fetchWithCache";

const getStaticParams = async (CollectionNodeNamespace) => {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag(CollectionNodeNamespace);
    const cacheKey = `staticParams:${CollectionNodeNamespace}`;
    return fetchWithCache(cacheKey, async () => {
        let params;
        try {
            params = await apiClient().request(
                readItems(CollectionNodeNamespace, {
                    fields: ["slug", "categories.categories_id.name"],
                    filter: { status: { _neq: "archived" } },
                }),
            );
        } catch (error) {
            console.warn(`getStaticParams: skipping "${CollectionNodeNamespace}": ${error?.errors?.[0]?.message || error?.message || "request failed"}`);
            params = [];
        }

        const paths = (params || [])
            .map((data) => ({
                category: data.categories?.[0]?.categories_id?.name,
                slug: data.slug,
            }))
            .filter((path) => path.slug !== "homepage");
        return paths.length ? paths : [{ slug: "__none__" }];
    });
};

export default getStaticParams;
