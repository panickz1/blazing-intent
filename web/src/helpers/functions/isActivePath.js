export default function isActivePath(pathname, url) {
  if (!pathname || !url) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) return false;

  const trim = (p) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
  const base = trim(url);
  const here = trim(pathname);

  if (here === base) return true;
  if (base === "/") return false;
  return here.startsWith(`${base}/`);
}
