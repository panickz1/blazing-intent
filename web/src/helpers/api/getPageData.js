import { cacheLife, cacheTag } from "next/cache";
import { pageQuery } from "@/queries/page-query";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import { notFound } from "next/navigation";

const getPageData = async (
    collectionType,
    CollectionNodeNamespace,
    CollectionItemSlug,
    extraQueryFields = [],
) => {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag(collectionType, "blocks");
    const fields = [...pageQuery(CollectionNodeNamespace), ...extraQueryFields];
    const result = await apiClient().request(
        readItems(collectionType, {
            filter: {
                slug: { _eq: CollectionItemSlug },
                status: { _neq: "archived" },
            },
            fields,
        }),
    );
    return (!result || result?.length == 0 ) ?   notFound() : result[0];
};

export default getPageData;
