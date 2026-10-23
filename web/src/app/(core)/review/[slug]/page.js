import { notFound } from "next/navigation";
import ContentRenderer from "@/helpers/content/ContentRenderer";
import extractHeadings from "@/helpers/content/extractHeadings";
import Breadcrumbs from "@/components/Layout/Breadcrumbs";
import { PAGE_TOP } from "@/components/Layout/PageIntro";
import Schema from "@/helpers/SEO/Schema";
import CasinoList from "@/components/Blocks/Common/CasinoList";
import BonusDetails from "@/components/bonus/BonusDetails";
import AttributeChip from "@/components/catalog/AttributeChip";
import TableOfContents from "@/components/Article/TableOfContents";
import MobileTableOfContents from "@/components/Article/MobileTableOfContents";
import ReviewLayout from "@/components/review/ReviewLayout";
import ProsCons from "@/components/review/ProsCons";
import PaymentList from "@/components/review/PaymentList";
import SpecSheet from "@/components/review/SpecSheet";
import ReviewStickyCta from "@/components/review/ReviewStickyCta";
import ReviewSideCta from "@/components/review/ReviewSideCta";
import { getGeneralThemeData } from "@/helpers/api";
import { getCasino, getCasinoParams, toCard, toReviewDetails } from "@/lib/casinos";
import { site } from "@/site.config";

const texts = (rows) => (Array.isArray(rows) ? rows : []).map((r) => r?.text).filter(Boolean);

export const generateStaticParams = getCasinoParams;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) return {};
  const title = casino.metatitle ? { absolute: casino.metatitle } : `${casino.name} review`;
  const description = casino.metadescription || casino.summary;
  const url = `${site.affiliate.reviewPath}/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    ...(casino.index === false ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CasinoReview({ params }) {
  const { slug } = await params;
  const [casino, generalData] = await Promise.all([getCasino(slug), getGeneralThemeData()]);
  if (!casino) notFound();

  const card = toCard(casino);
  const details = toReviewDetails(casino);
  const r = site.review;
  const pros = texts(casino.pros);
  const cons = texts(casino.cons);
  const [bonus] = details.bonuses;
  const bonusesHeading = r.bonusesHeading.replace("{name}", casino.name);

  const headings = [
    pros.length + cons.length > 0 && { id: "pros-cons", text: r.prosCons, level: 2 },
    ...extractHeadings(casino.content).filter((h) => h.level === 2),
    details.bonuses.length > 0 && { id: "bonuses", text: bonusesHeading, level: 2 },
    card.payments.length > 0 && { id: "payment-methods", text: site.catalog.sections.payments.label, level: 2 },
  ].filter(Boolean);

  return (
    <>
      <Schema type="casinoReview" data={casino} />
      <MobileTableOfContents headings={headings} contentSelector=".review-body" />
      <section className={`landing-container pb-24 lg:pb-16 ${PAGE_TOP}`}>
        <Breadcrumbs
          items={[
            { name: site.breadcrumbs.casinos, url: "/casinos" },
            { name: casino.name, url: card.reviewHref },
          ]}
          className="mb-4 lg:mb-5"
        />

        <ReviewLayout
          casino={casino}
          card={card}
          details={details}
          aside={
            <>
              <SpecSheet groups={details.groups} licence={casino.licence} licenceUrl={casino.licenceUrl} />
              <div className="hidden lg:sticky lg:top-[92px] lg:flex lg:max-h-[calc(100vh-108px)] lg:flex-col lg:gap-6 lg:overflow-y-auto">
                <TableOfContents headings={headings} />
                <ReviewSideCta card={card} bonus={bonus} />
              </div>
            </>
          }
        >
          <ProsCons pros={pros} cons={cons} />

          <article className="article-prose">
            <ContentRenderer content={casino.content} nodes={casino.review_nodes} generalData={generalData} />
          </article>

          {details.bonuses.length > 0 && (
            <section id="bonuses" className="scroll-mt-28">
              <h2 className="m-0 font-heading text-[22px] font-black text-white">{bonusesHeading}</h2>
              <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                {details.bonuses.map((b) => (
                  <li key={b.id} className="rounded-2xl border border-grey-800 bg-grey-900 p-4 lg:p-5">
                    <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {b.headline && <span className="font-heading text-[24px] font-black leading-none text-accent-2">{b.headline}</span>}
                      <h3 className="m-0 font-heading text-[17px] font-bold text-white">{b.name}</h3>
                      {b.description && <p className="m-0 w-full text-[14px] text-grey-200">{b.description}</p>}
                      {b.types.length > 0 && (
                        <div className="flex w-full flex-wrap gap-1.5 pt-1">
                          {b.types.map((t) => (
                            <AttributeChip key={t.slug ?? t.name} item={t} className="py-0.5 text-[11px] uppercase tracking-wide" />
                          ))}
                        </div>
                      )}
                    </div>
                    <BonusDetails bonus={b} casino={card} showReview={false} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <PaymentList payments={card.payments} />
        </ReviewLayout>
      </section>

      <CasinoList title={r.otherCasinos} topBadge="" showSort={false} licensedLabel="" limit={3} exclude={slug} />

      <ReviewStickyCta
        casino={card}
        title={bonus ? [bonus.headline, bonus.description].filter(Boolean).join(" · ") : casino.name}
        subtitle={card.terms}
        label={site.affiliate.visitLabel}
      />
    </>
  );
}
