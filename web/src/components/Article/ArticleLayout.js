import ContentRenderer from "@/helpers/content/ContentRenderer";
import ArticleProgressBar from "@/components/ui/readProgress";
import ArticleHeader from "./ArticleHeader";
import ArticleHero from "./ArticleHero";
import ArticleSidebar from "./ArticleSidebar";
import MobileTableOfContents from "./MobileTableOfContents";

export default function ArticleLayout({
  data,
  content,
  nodes,
  generalData,
  headings = [],
  category = null,
  showCta = true,
  showAuthor = true,
  dateLabel = null,
  backFallback = "/blog",
}) {
  const heroSrc = data?.image?.filename_disk;
  const hasSidebar = showCta || headings.length > 0;

  return (
    <>
      <ArticleProgressBar />
      <MobileTableOfContents headings={headings} />
      <article className="flex flex-col gap-6 pb-16 lg:pb-24">
        <ArticleHeader
          article={data}
          category={category}
          showAuthor={showAuthor}
          dateLabel={dateLabel}
          backFallback={backFallback}
        />

        <div className={`grid grid-cols-1 gap-8 ${hasSidebar ? "lg:grid-cols-[260px_minmax(0,1fr)]" : ""}`}>
          {hasSidebar && <ArticleSidebar headings={headings} showCta={showCta} />}
          <div className="min-w-0 flex flex-col gap-6">
            {heroSrc && <ArticleHero src={heroSrc} alt={data?.title || data?.shortTitle} />}
            <div className="article-prose">
              <ContentRenderer content={content} nodes={nodes} generalData={generalData} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
