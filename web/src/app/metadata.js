import { site } from "@/site.config";

export function metadata() {
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    manifest: "/manifest.webmanifest",
    authors: [{ name: site.name, url: site.url }],
    openGraph: {
      type: "website",
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      ...(site.twitter ? { site: site.twitter, creator: site.twitter } : {}),
    },
  };
}
