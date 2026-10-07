import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";

const NODE_FIELDS = [
  "article_nodes.id",
  "article_nodes.collection",
  "article_nodes.item.*",
  "article_nodes.item.image.filename_disk",
  "article_nodes.item.image.description",
];

export async function getHelpData() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("help_articles", "help_categories", "blocks");
  return fetchWithCache(
    "help:all",
    async () => {
      const client = apiClient();
      const [categories, articles] = await Promise.all([
        client.request(
          readItems("help_categories", {
            fields: ["id", "name", "slug", "icon", "description", "sort"],
            sort: ["sort", "name"],
            limit: -1,
          })
        ),
        client.request(
          readItems("help_articles", {
            fields: [
              "id", "question", "slug", "answer", "lede", "content",
              "type", "status", "sub", "popular",
              "linkLabel", "linkUrl", "sort",
              "metatitle", "metadescription",
              "category.id", "category.slug", "category.name",
              "related.sort",
              "related.related_help_articles_id.question",
              "related.related_help_articles_id.slug",
              "related.related_help_articles_id.type",
              "related.related_help_articles_id.linkUrl",
              "related.related_help_articles_id.category.slug",
              "related.related_help_articles_id.category.name",
              "related.related_help_articles_id.status",
              ...NODE_FIELDS,
            ],
            filter: { status: { _neq: "archived" } },
            sort: ["sort", "question"],
            limit: -1,
          })
        ),
      ]);
      return { categories: categories ?? [], articles: articles ?? [] };
    },
    { fallback: { categories: [], articles: [] } }
  );
}

export function hasPage(article) {
  return article?.type === "article";
}

function moreHref(article) {
  if (article?.linkUrl?.trim()) return article.linkUrl.trim();
  if (hasPage(article) && article?.slug) return `/help-center/${article.slug}`;
  return null;
}

function toRow(a) {
  return {
    id: a.id,
    question: a.question,
    slug: a.slug,
    answer: a.answer,
    sub: a.sub,
    status: a.status ?? "ready",
    type: hasPage(a) ? "article" : "faq",
    href: hasPage(a) ? moreHref(a) : null,
    more: hasPage(a) ? null : moreHref(a),
    linkLabel: a.linkLabel,
    category: a.category?.name,
    categorySlug: a.category?.slug,
  };
}

export async function getHelpCategories() {
  const { categories, articles } = await getHelpData();

  return categories
    .map((c) => ({
      ...c,
      articles: articles.filter((a) => a.category?.slug === c.slug).map(toRow),
    }))
    .filter((c) => c.articles.length > 0);
}

export async function getHelpArticle(slug) {
  const { categories, articles } = await getHelpData();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;

  const categorySlug = article.category?.slug;
  const category = categories.find((c) => c.slug === categorySlug) ?? article.category;

  const curated = (article.related ?? [])
    .map((r) => r.related_help_articles_id)
    .filter((r) => r && r.status !== "archived")
    .map((r) => ({
      question: r.question,
      href: moreHref(r),
      category: r.category?.name,
    }))
    .filter((r) => r.href);

  const related = curated.length
    ? curated
    : articles
        .filter((a) => a.category?.slug === categorySlug && a.slug !== slug && hasPage(a))
        .slice(0, 3)
        .map((a) => ({ question: a.question, href: moreHref(a), category: a.category?.name }))
        .filter((r) => r.href);

  return { article, category, related };
}

export async function getHelpArticleParams() {
  const { articles } = await getHelpData();
  const params = articles
    .filter((a) => hasPage(a) && !a.linkUrl?.trim() && a.slug)
    .map((a) => ({ slug: a.slug }));
  return params.length ? params : [{ slug: "__none__" }];
}
