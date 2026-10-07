import { cacheLife, cacheTag } from "next/cache";
import assetUrl from "@/helpers/functions/assetUrl";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";

const ARTICLE_FIELDS = [
  "id", "title", "shortTitle", "slug", "summary",
  "date_created", "date_updated", "status", "index",
  "image.filename_disk", "image.description",
  "author.first_name", "author.last_name",
  "categories.categories_id.id",
  "categories.categories_id.name",
  "categories.categories_id.slug",
];

export async function getBlogData() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("articles", "categories");
  return fetchWithCache(
    "blog:all",
    async () => {
      const client = apiClient();
      const [articles, categories] = await Promise.all([
        client.request(
          readItems("articles", {
            fields: ARTICLE_FIELDS,
            filter: { status: { _eq: "published" } },
            sort: ["-date_created"],
            limit: -1,
          })
        ),
        client.request(
          readItems("categories", {
            fields: ["id", "name", "slug", "description", "sort"],
            sort: ["sort", "name"],
            limit: -1,
          })
        ),
      ]);
      return { articles: articles ?? [], categories: categories ?? [] };
    },
    { fallback: { articles: [], categories: [] } }
  );
}

function toCard(a) {
  const category = a.categories?.[0]?.categories_id ?? null;
  return {
    id: a.id,
    title: a.shortTitle || a.title,
    slug: a.slug,
    summary: a.summary,
    date: a.date_created ?? a.date_updated ?? null,
    imageUrl: assetUrl(a.image),
    imageAlt: a.image?.description || a.shortTitle || a.title || "",
    category: category ? { name: category.name, slug: category.slug } : null,
    href: category?.slug && a.slug ? `/blog/${category.slug}/${a.slug}` : null,
    author: [a.author?.first_name, a.author?.last_name].filter(Boolean).join(" ") || null,
  };
}

export async function getBlogIndex(only = []) {
  const { articles, categories } = await getBlogData();
  const wanted = new Set(only.filter(Boolean));

  const inScope = (c) => wanted.size === 0 || wanted.has(c.slug);

  const cards = articles
    .map(toCard)
    .filter((c) => c.href && c.category && inScope(c.category));

  const used = new Set(cards.map((c) => c.category.slug));
  const chips = categories
    .filter((c) => inScope(c) && used.has(c.slug))
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
      count: cards.filter((x) => x.category.slug === c.slug).length,
    }));

  return { cards, chips };
}

export async function getBlogCategory(slug) {
  const { articles, categories } = await getBlogData();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return null;

  const cards = articles.map(toCard).filter((c) => c.category?.slug === slug && c.href);
  return { category, cards };
}

const PLACEHOLDER = "__none__";

export async function getBlogParams() {
  const { articles } = await getBlogData();
  const params = articles
    .map(toCard)
    .filter((c) => c.href)
    .map((c) => ({ category: c.category.slug, slug: c.slug }));
  return params.length ? params : [{ category: PLACEHOLDER, slug: PLACEHOLDER }];
}

export async function getBlogCategoryParams() {
  const { articles, categories } = await getBlogData();
  const used = new Set(articles.map(toCard).map((c) => c.category?.slug).filter(Boolean));
  const params = categories.filter((c) => used.has(c.slug)).map((c) => ({ category: c.slug }));
  return params.length ? params : [{ category: PLACEHOLDER }];
}

