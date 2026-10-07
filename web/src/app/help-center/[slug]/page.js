import Link from "next/link";
import { notFound } from "next/navigation";
import HelpContent from "@/components/Help/HelpContent";
import TableOfContents from "@/components/Article/TableOfContents";
import MobileTableOfContents from "@/components/Article/MobileTableOfContents";
import BackButton from "@/components/Article/BackButton";
import HelpContact from "@/components/Blocks/Common/HelpContact";
import Schema from "@/helpers/SEO/Schema";
import slugify from "@/helpers/functions/slugify";
import { getHelpArticle, getHelpArticleParams } from "@/lib/help";
import { site } from "@/site.config";

export async function generateStaticParams() {
  return getHelpArticleParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const found = await getHelpArticle(slug);
  if (!found) return {};

  const { article } = found;
  const title = article.metatitle?.trim() || { absolute: `${article.question} | ${site.name} Help` };
  const description = article.metadescription?.trim() || article.lede || article.answer;
  const url = `/help-center/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function tableOfContents(content) {
  return (content?.content ?? [])
    .filter((n) => n.type === "heading" && (n.attrs?.level ?? 2) === 2 && n.content?.[0]?.text)
    .map((n) => ({ id: slugify(n.content[0].text), text: n.content[0].text, level: 2 }));
}

export default async function HelpArticlePage({ params }) {
  const { slug } = await params;
  const found = await getHelpArticle(slug);

  if (!found || found.article.type !== "article") notFound();

  const { article, category, related } = found;
  const body = article.content?.content?.length ? article.content : null;
  const toc = tableOfContents(article.content);
  const withToc = toc.length > 2;
  const lede = article.lede?.trim() || article.answer?.trim();

  return (
    <>
      {withToc && <MobileTableOfContents headings={toc} contentSelector=".help-article-body" />}
      <article
        className={`help-article mx-auto grid w-full max-w-[1000px] gap-[clamp(28px,5vw,64px)] px-5 pb-[clamp(40px,5vw,66px)] pt-[clamp(30px,4vw,48px)] lg:px-12 ${
          withToc ? "lg:grid-cols-[minmax(0,1fr)_216px]" : "grid-cols-[minmax(0,1fr)]"
        }`}
      >
        <div>
          <div className="mb-[18px] flex flex-wrap items-center gap-x-4 gap-y-3">
            <BackButton fallback="/help-center" />
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-grey-400">
              <Link href="/help-center" className="transition-colors hover:text-white">Help Center</Link>
              <span aria-hidden>/</span>
              <Link href={`/help-center#${category?.slug}`} className="transition-colors hover:text-white">
                {category?.name}
              </Link>
            </nav>
          </div>

          <h1 className="font-heading text-[clamp(30px,4.4vw,50px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white [text-wrap:balance]">
            {article.question}
          </h1>

          {lede && (
            <p className="mt-3.5 max-w-[54ch] text-[clamp(16.5px,1.9vw,19.5px)] leading-[1.5] text-fg-muted [text-wrap:pretty]">
              {lede}
            </p>
          )}

          {body && (
            <div className="help-article-body mt-[clamp(26px,3.4vw,42px)]">
              <HelpContent content={body} nodes={article.article_nodes} />
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-[clamp(38px,4.6vw,58px)]">
              <h2 className="mb-[clamp(14px,1.8vw,20px)] font-heading text-[clamp(21px,2.4vw,28px)] font-extrabold tracking-[-0.03em] text-white">
                Related topics
              </h2>
              <div className="flex flex-col overflow-hidden rounded-[18px] border border-grey-800 bg-grey-900">
                {related.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="group flex items-center justify-between gap-3.5 border-t border-grey-800 px-[22px] py-[19px] font-heading text-[16px] font-semibold tracking-[-0.012em] text-white transition-colors first:border-t-0 hover:bg-grey-800 hover:text-primary"
                  >
                    {r.question}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                         strokeLinecap="round" strokeLinejoin="round"
                         className="size-[15px] shrink-0 text-grey-400 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden>
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {withToc && (
          <aside className="sticky top-24 hidden self-start lg:block">
            <TableOfContents headings={toc} />
          </aside>
        )}
      </article>

      <HelpContact width="article" />

      <Schema
        type="techArticle"
        data={{
          title: article.question,
          description: article.metadescription?.trim() || lede,
          url: `/help-center/${slug}`,
          section: category?.name,
        }}
      />
    </>
  );
}
