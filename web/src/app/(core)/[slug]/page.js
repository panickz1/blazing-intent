import { getPageMetaData, getStaticParams, getGeneralThemeData, getPageData } from "@/helpers/api";
import ContentRenderer from "@/helpers/content/ContentRenderer";
import extractHeadings from "@/helpers/content/extractHeadings";
import ArticleLayout from "@/components/Article/ArticleLayout";
import PageShell from "@/components/Layout/PageShell";
import { PageBacklight } from "@/components/Layout/PageBacklight";

const APICollectionKeys = { type: "pages", node: "page_nodes" };

const PAGE_FIELDS = ["template", "backlight", "title", "image.filename_disk", "date_created", "date_updated"];

export const generateMetadata = async (props) => await getPageMetaData(APICollectionKeys.type, (await props.params).slug);
export const generateStaticParams = async () => await getStaticParams(APICollectionKeys.type);

export default async function Page(props) {
  const [generalData, pageData] = await Promise.all([
    getGeneralThemeData(),
    getPageData(APICollectionKeys.type, APICollectionKeys.node, (await props.params).slug, PAGE_FIELDS),
  ]);

  if (pageData?.template === "article") {
    const headings = extractHeadings(pageData?.content);
    return (
      <PageShell>
        <ArticleLayout
          data={pageData}
          content={pageData?.content}
          nodes={pageData?.page_nodes}
          generalData={generalData}
          headings={headings}
          showCta={false}
          showAuthor={false}
          dateLabel="Last updated"
          backFallback="/"
        />
      </PageShell>
    );
  }

  const content = <ContentRenderer content={pageData?.content} nodes={pageData?.page_nodes} generalData={generalData} />;

  if (pageData?.template === "landing") {
    return (
      <div className="relative">
        <PageBacklight tone={pageData?.backlight} />
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  return <PageShell>{content}</PageShell>;
}
