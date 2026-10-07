const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";
const CMS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || "";

export default function assetUrl(file) {
  const name = typeof file === "string" ? file : file?.filename_disk;
  if (!name) return null;
  if (/^(https?:)?\/\//i.test(name) || name.startsWith("/")) return name;
  if (CDN_URL) return CDN_URL.replace(/\/?$/, "/") + name;
  if (CMS_URL) return `${CMS_URL.replace(/\/$/, "")}/assets/${name.replace(/\.[^.]+$/, "")}`;
  return null;
}
