import { getOrganizationSchema } from "./getOrganizationSchema";
import { site } from "@/site.config";

export default function schemaWebPage(data) {
  const base = site.url || "";
  const abs = (u) => (!u ? undefined : /^https?:\/\//i.test(u) ? u : `${base}${u}`);

  const image = typeof data?.image === "string" ? { url: data.image } : data?.image;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data?.name,
    url: abs(data?.url),
    description: data?.description,
    inLanguage: process.env.SITE_LANGUAGE,
    datePublished: data?.datePublished,
    dateModified: data?.dateModified,
    primaryImageOfPage: image?.url
      ? {
          "@type": "ImageObject",
          url: abs(image.url),
          ...(image.width ? { width: image.width } : {}),
          ...(image.height ? { height: image.height } : {}),
        }
      : undefined,
    publisher: getOrganizationSchema(),
  };

  for (const key of Object.keys(schema)) {
    const v = schema[key];
    if (v === undefined || v === null || v === "") delete schema[key];
  }

  return schema;
}
