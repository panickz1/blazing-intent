import { site } from "@/site.config";

export default function manifest() {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    theme_color: site.themeColor,
    background_color: site.backgroundColor,
    start_url: "/",
    display: "standalone",
  };
}
