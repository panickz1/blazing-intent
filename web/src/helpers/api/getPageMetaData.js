import { cacheLife, cacheTag } from "next/cache";
import apiClient from "@/helpers/functions/apiClient";
import { readItems } from "@directus/sdk";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import { site } from "@/site.config";

const getPageMetaData = async (CollectionNodeNamespace, CollectionItemSlug, path) => {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag(CollectionNodeNamespace);
    const cacheKey = `metadata:${CollectionNodeNamespace}:${CollectionItemSlug}:${path ?? ""}`;

    return fetchWithCache(cacheKey, async () => {
        const result = await apiClient().request(
            readItems(CollectionNodeNamespace, {
                filter: { slug: { _eq: CollectionItemSlug }},
                fields: ["metatitle", "metadescription", "title", "index"],
            }),
        );

        const page = result[0];

        return {
            title: page?.metatitle ? { absolute: page.metatitle } : CollectionItemSlug === "homepage" ? { absolute: `${site.name} | ${site.tagline}` } : page?.title,
            description: page?.metadescription,
            alternates: { canonical: path ?? (CollectionItemSlug === "homepage" ? "/" : `/${CollectionItemSlug}`) },
            ...(page && page.index === false
                ? { robots: { index: false, follow: true } }
                : {}),
        };
    });
};

export default getPageMetaData;
