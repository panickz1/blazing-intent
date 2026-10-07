import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import { getBlogData } from "@/lib/blog";
import { getHelpData, hasPage } from "@/lib/help";
import { getCasinoCards } from "@/lib/casinos";
import { site } from "@/site.config";

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

const line = (title, url, desc) => `- [${clean(title)}](${url})${desc ? `: ${clean(desc)}` : ""}`;

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function buildBody() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  cacheTag("pages", "categories", "articles", "help_articles", "casinos");

  const [pages, blog, help, casinos] = await Promise.all([
    safe(
      () =>
        apiClient().request(
          readItems("pages", {
            fields: ["title", "slug", "index", "metadescription"],
            filter: { status: { _neq: "archived" } },
            limit: -1,
          })
        ),
      []
    ),
    getBlogData(),
    getHelpData(),
    getCasinoCards(),
  ]);

  const home = pages.find((p) => p.slug === "homepage");
  const parts = [`# ${site.name}`, `> ${clean(home?.metadescription) || site.description}`];

  const casinoLines = casinos.map((c) =>
    line(`${c.name} review`, `${site.url}${c.reviewHref}`, [c.rating ? `Rated ${c.rating.toFixed(1)}/5` : "", c.bonusDescription].filter(Boolean).join(". "))
  );
  if (casinoLines.length) parts.push(`## Casino reviews\n\n${casinoLines.join("\n")}`);

  const pageLines = pages
    .filter((p) => p.slug && p.slug !== "homepage" && p.index !== false)
    .map((p) => line(p.title, `${site.url}/${p.slug}`, p.metadescription));
  if (pageLines.length) parts.push(`## Pages\n\n${pageLines.join("\n")}`);

  const blogLines = blog.articles
    .map((a) => ({ a, c: a.categories?.[0]?.categories_id }))
    .filter(({ a, c }) => a.slug && c?.slug && a.index !== false)
    .map(({ a, c }) => line(a.shortTitle || a.title, `${site.url}/blog/${c.slug}/${a.slug}`, a.summary));
  if (blogLines.length) parts.push(`## Blog\n\n${blogLines.join("\n")}`);

  const helpLines = help.articles
    .filter((a) => hasPage(a) && a.slug && !a.linkUrl?.trim())
    .map((a) => line(a.question, `${site.url}/help-center/${a.slug}`, a.lede || a.answer));
  if (helpLines.length) parts.push(`## Help centre\n\n${helpLines.join("\n")}`);

  return parts.join("\n\n") + "\n";
}

export async function GET() {
  return new Response(await buildBody(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
