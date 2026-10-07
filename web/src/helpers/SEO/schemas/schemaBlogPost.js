import assetUrl from "@/helpers/functions/assetUrl";
import { getOrganizationSchema } from "./getOrganizationSchema";

export default function schemaBlogPost(data) {
  const authorName = data?.author
    ? `${data.author.first_name || ""} ${data.author.last_name || ""}`.trim()
    : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data?.title,
    description: data?.summary,
    url: data?.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data?.url,
    },
    inLanguage: process.env.SITE_LANGUAGE,
    datePublished: data?.date_created,
    dateModified: data?.date_updated || data?.date_created,
    publisher: getOrganizationSchema(),
  };

  if (data?.image?.filename_disk) {
    schema.image = assetUrl(data.image);
  }

  if (authorName) {
    schema.author = {
      "@type": "Person",
      name: authorName,
      ...(data.author.title ? { jobTitle: data.author.title } : {}),
      ...(data.author.linkedin ? { sameAs: [data.author.linkedin] } : {}),
    };
  }

  return schema;
}
