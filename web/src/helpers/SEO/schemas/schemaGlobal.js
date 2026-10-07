import { getOrganizationSchema } from "./getOrganizationSchema";
import { site } from "@/site.config";

export default function schemaGlobal() {
  return {
    "@context": "http://schema.org",
    "@graph": [
        getOrganizationSchema(),
      {
        "@type": "WebSite",
        url: site.url,
        name: site.name,
      }
    ],
  };
}
