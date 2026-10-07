import { site } from "@/site.config";

export function viewport() {
  return {
    themeColor: site.backgroundColor,
    colorScheme: "dark light",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  };
}
