import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import { getBlogData } from "@/lib/blog";
import { getHelpData, hasPage } from "@/lib/help";
import { getCasinos } from "@/lib/casinos";
import { getSection, getEditorialSlugs, getCatalogItems, getCatalogCasinoIds } from "@/lib/catalog";
import { getBonusRows } from "@/lib/bonuses";
import { site } from "@/site.config";

const iso = (...dates) => new Date(dates.find(Boolean) || Date.now()).toISOString();

async function getIndexablePages() {
  try {
    return await apiClient().request(
      readItems("pages", {
        fields: ["slug", "index", "date_created", "date_updated"],
        filter: { status: { _neq: "archived" } },
        limit: -1,
      })
    );
  } catch {
    return [];
  }
}

async function getCatalogUrls(activeIds) {
  const urls = [];
  const editorial = new Set(await getEditorialSlugs());
  for (const path of Object.keys(site.catalog.sections)) {
    const section = getSection(path);
    if (!section) continue;
    for (const item of await getCatalogItems(section.collection)) {
      if (item.index === false || editorial.has(item.slug)) continue;
      const count =
        section.collection === "bonusTypes"
          ? (await getBonusRows({ type: item.id })).length
          : (await getCatalogCasinoIds(section, item.id)).filter((id) => activeIds.has(id)).length;
      if (!item.body?.trim() && count < site.catalog.minCasinosToIndex) continue;
      urls.push({ url: `${site.url}/${path}/${item.slug}`, lastModified: iso(item.date_updated), changeFrequency: "weekly", priority: 0.7 });
    }
  }
  return urls;
}

export default async function sitemap() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  cacheTag("pages", "categories", "articles", "help_articles", "help_categories", "casinos");

  const [pages, blog, help, casinos] = await Promise.all([getIndexablePages(), getBlogData(), getHelpData(), getCasinos()]);

  const urls = [{ url: site.url, lastModified: iso(), changeFrequency: "weekly", priority: 1 }];

  for (const page of pages) {
    if (!page.slug || page.slug === "homepage" || page.index === false) continue;
    urls.push({
      url: `${site.url}/${page.slug}`,
      lastModified: iso(page.date_updated, page.date_created),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const casino of casinos) {
    if (!casino.slug) continue;
    urls.push({
      url: `${site.url}${site.affiliate.reviewPath}/${casino.slug}`,
      lastModified: iso(casino.date_created),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  urls.push(...(await getCatalogUrls(new Set(casinos.map((c) => c.id)))));

  for (const article of blog.articles) {
    const category = article.categories?.[0]?.categories_id;
    if (!article.slug || !category?.slug || article.index === false) continue;
    urls.push({
      url: `${site.url}/blog/${category.slug}/${article.slug}`,
      lastModified: iso(article.date_updated, article.date_created),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const article of help.articles) {
    if (!hasPage(article) || !article.slug || article.linkUrl?.trim()) continue;
    urls.push({
      url: `${site.url}/help-center/${article.slug}`,
      lastModified: iso(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return urls;
}
