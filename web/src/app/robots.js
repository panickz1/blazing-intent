import { site } from "@/site.config";

export default function robots() {
  return {
    rules: [{ userAgent: "*", disallow: ["/api/", `${site.affiliate.goPath}/`] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
