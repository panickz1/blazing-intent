import Link from "next/link";
import { notFound } from "next/navigation";
import HelpContent from "@/components/Help/HelpContent";
import TableOfContents from "@/components/Article/TableOfContents";
import MobileTableOfContents from "@/components/Article/MobileTableOfContents";
import Breadcrumbs from "@/components/Layout/Breadcrumbs";
import { PAGE_TOP, titleClass } from "@/components/Layout/PageIntro";
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
        className={`help-article landing-container grid gap-[clamp(28px,5vw,64px)] pb-[clamp(40px,5vw,66px)] ${PAGE_TOP} ${
          withToc ? "lg:grid-cols-[minmax(0,760px)_216px] lg:justify-between" : "grid-cols-[minmax(0,760px)]"
        }`}
      >
        <div>
          <Breadcrumbs
            items={[
              { name: site.breadcrumbs.help, url: "/help-center" },
              category?.name && { name: category.name, url: `/help-center#${category.slug}` },
              { name: article.question, url: `/help-center/${slug}` },
            ].filter(Boolean)}
            className="mb-5"
          />

          <h1 className={titleClass("md")}>
            {article.question}
          </h1>

          {lede && (
            <p className="mb-0 mt-3.5 max-w-[64ch] text-[16.5px] leading-relaxed text-grey-200 [text-wrap:pretty]">
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
