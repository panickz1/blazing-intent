import extractHeadings from "@/helpers/content/extractHeadings";
import { getPageMetaData, getGeneralThemeData, getPageData } from "@/helpers/api";
import ArticleLayout from "@/components/Article/ArticleLayout";
import Schema from "@/helpers/SEO/Schema";
import PageShell from "@/components/Layout/PageShell";
import { getBlogParams, getBlogCategory } from "@/lib/blog";
import { getCtaCasino } from "@/lib/casinos";
import { site } from "@/site.config";

const APICollectionKeys = { type: "articles", node: "articles_node" };

const ARTICLE_FIELDS = [
  "title",
  "shortTitle",
  "summary",
  "slug",
  "date_created",
  "date_updated",
  "image.filename_disk",
  "author.first_name",
  "author.last_name",
  "author.title",
  "author.linkedin",
  "author.avatar.filename_disk",
  "showCta",
  "ctaCasino",
  "categories.categories_id.name",
  "categories.categories_id.slug",
];

export const generateMetadata = async (props) => {
  const { category, slug } = await props.params;
  return getPageMetaData(APICollectionKeys.type, slug, `/blog/${category}/${slug}`);
};
export const generateStaticParams = async () => await getBlogParams();

export default async function Article(props) {
  const { slug, category } = await props.params;
  const [generalData, item] = await Promise.all([
    getGeneralThemeData(),
    getPageData(APICollectionKeys.type, APICollectionKeys.node, slug, ARTICLE_FIELDS),
  ]);

  const headings = extractHeadings(item?.content);
  const found = await getBlogCategory(category);
  const url = `${site.url}/blog/${category}/${slug}`;
  const showCta = item?.showCta !== false;
  const ctaCasino = showCta ? await getCtaCasino([item?.ctaCasino, generalData?.featuredCasino]) : null;

  return (
    <PageShell>
      <Schema type="blogPost" data={{ ...item, url }} />
      <ArticleLayout
        data={item}
        content={item?.content}
        nodes={item?.articles_node}
        generalData={generalData}
        headings={headings}
        category={found?.category ? { name: found.category.name, slug: found.category.slug } : null}
        showCta={showCta}
        ctaCasino={ctaCasino}
        showAuthor
        backFallback={category ? `/blog/${category}` : "/blog"}
      />
    </PageShell>
  );
}
