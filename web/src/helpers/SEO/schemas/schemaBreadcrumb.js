import { site } from "@/site.config";
export default function schemaBreadcrumb(data) {
  const base = site.url || "";
  const items = data?.items ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: /^https?:\/\//i.test(item.url) ? item.url : `${base}${item.url}`,
    })),
  };
}
