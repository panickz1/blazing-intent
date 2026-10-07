import ContentRenderer from "@/helpers/content/ContentRenderer";
import ArticleProgressBar from "@/components/ui/readProgress";
import ArticleHeader from "./ArticleHeader";
import readingTime from "@/helpers/content/readingTime";
import ArticleSidebar from "./ArticleSidebar";
import MobileTableOfContents from "./MobileTableOfContents";

export default function ArticleLayout({
  data,
  content,
  nodes,
  generalData,
  headings = [],
  breadcrumbs = [],
  showCta = true,
  showAuthor = true,
  dateLabel = null,
  ctaCasino = null,
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
          breadcrumbs={breadcrumbs}
          showAuthor={showAuthor}
          dateLabel={dateLabel}
          image={heroSrc}
          minutes={showAuthor ? readingTime(content) : null}
        />

        <div className={`grid grid-cols-1 gap-8 ${hasSidebar ? "lg:grid-cols-[260px_minmax(0,1fr)]" : ""}`}>
          {hasSidebar && <ArticleSidebar headings={headings} showCta={showCta} ctaCasino={ctaCasino} />}
          <div className="min-w-0 flex flex-col gap-6">
            <div className="article-prose">
              <ContentRenderer content={content} nodes={nodes} generalData={generalData} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
