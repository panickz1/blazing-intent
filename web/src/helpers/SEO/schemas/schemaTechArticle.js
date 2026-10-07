import { getOrganizationSchema } from "./getOrganizationSchema";
import { site } from "@/site.config";

export default function schemaTechArticle(data) {
  const base = site.url || "";
  const url = /^https?:\/\//i.test(data?.url ?? "") ? data.url : `${base}${data?.url ?? ""}`;
  const modified = data?.lastModified ? new Date(data.lastModified).toISOString() : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: data?.title,
    description: data?.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: process.env.SITE_LANGUAGE,
    ...(data?.section ? { articleSection: data.section } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: getOrganizationSchema(),
    publisher: getOrganizationSchema(),
  };
}
