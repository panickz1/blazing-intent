import { site } from "@/site.config";
export default function schemaItemList(data) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(data?.name ? { name: data.name } : {}),
    itemListElement: (data?.items || []).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: site.url + item.url,
    })),
  };
}
