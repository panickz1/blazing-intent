import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Boxes, Building2, Check, Gamepad2, Gift, Globe, Headset, Languages, ShieldCheck, Trophy, X } from "lucide-react";
import ContentRenderer from "@/helpers/content/ContentRenderer";
import Schema from "@/helpers/SEO/Schema";
import CasinoLogo from "@/components/casino/CasinoLogo";
import Rating from "@/components/casino/Rating";
import CasinoList from "@/components/Blocks/Common/CasinoList";
import AttributeChip from "@/components/catalog/AttributeChip";
import BonusDetails from "@/components/bonus/BonusDetails";
import { getGeneralThemeData } from "@/helpers/api";
import { getCasino, getCasinoParams, toCard, toReviewDetails } from "@/lib/casinos";
import { site } from "@/site.config";

const SPONSORED = "nofollow sponsored noopener";

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

function Fact({ label, children }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-grey-800 bg-grey-900 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">{label}</dt>
      <dd className="m-0 text-[15px] font-semibold text-white">{children}</dd>
    </div>
  );
}

function ProConList({ title, items, positive }) {
  if (items.length === 0) return null;
  const Icon = positive ? Check : X;
  return (
    <div className="rounded-2xl border border-grey-800 bg-grey-900 p-5">
      <h2 className="m-0 font-heading text-[17px] font-black text-white">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-grey-100">
            <Icon
              className={`mt-0.5 size-4 shrink-0 rounded-full p-0.5 ${positive ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}
              strokeWidth={3}
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const GROUP_STYLE = {
  licences: { icon: ShieldCheck },
  providers: { icon: Boxes },
  games: { icon: Gamepad2 },
  sports: { icon: Trophy },
  support: { icon: Headset },
  languages: { icon: Languages, cue: "code" },
  regions: { icon: Globe, cue: "flag" },
  operators: { icon: Building2 },
};

function PaymentTable({ payments }) {
  const hasDetails = payments.some((p) => p.minDeposit || p.withdrawalTime);
  if (!hasDetails) {
    return (
      <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
        {payments.map((m) => (
          <li key={m.id}>
            <AttributeChip item={m} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-grey-800">
      <table className="w-full min-w-[420px] border-collapse text-left text-[14px] text-grey-100">
        <thead className="bg-grey-900">
          <tr>
            <th scope="col" className="px-4 py-2.5 text-[12px] font-semibold text-fg-muted">{site.catalog.sections.payments.label}</th>
            <th scope="col" className="px-4 py-2.5 text-[12px] font-semibold text-fg-muted">{site.bonuses.columns.deposit}</th>
            <th scope="col" className="px-4 py-2.5 text-[12px] font-semibold text-fg-muted">Withdrawals</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((m) => (
            <tr key={m.id} className="border-t border-grey-800">
              <td className="px-4 py-2.5">
                <AttributeChip item={m} />
              </td>
              <td className="px-4 py-2.5">{m.minDeposit || "-"}</td>
              <td className="px-4 py-2.5">{m.withdrawalTime || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function CasinoReview({ params }) {
  const { slug } = await params;
  const [casino, generalData] = await Promise.all([getCasino(slug), getGeneralThemeData()]);
  if (!casino) notFound();

  const card = toCard(casino);
  const details = toReviewDetails(casino);
  const { affiliate } = site;

  return (
    <>
      <Schema type="casinoReview" data={casino} />
      <Schema
        type="breadcrumb"
        data={{
          items: [
            { name: "Home", url: "/" },
            { name: "Casinos", url: "/casinos" },
            { name: casino.name, url: card.reviewHref },
          ],
        }}
      />

      <section className="landing-container pb-24 pt-8 lg:pb-16 lg:pt-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-fg-muted">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/casinos" className="hover:text-white">Casinos</Link>
          <span aria-hidden>/</span>
          <span className="text-grey-200">{casino.name}</span>
        </nav>

        <div className="grid gap-6 rounded-3xl border border-grey-800 bg-grey-900 p-5 lg:grid-cols-[220px_minmax(0,1fr)_300px] lg:items-center lg:gap-8 lg:p-7">
          <CasinoLogo casino={card} size="lg" className="h-[110px] lg:h-[150px]" />

          <div className="min-w-0">
            <h1 className="m-0 font-heading text-[clamp(30px,4.2vw,48px)] font-black leading-[1.02] tracking-[-0.03em] text-white">
              {casino.name} review
            </h1>
            <Rating value={card.rating} className="mt-3" />
            {casino.licence && (
              <p className="mb-0 mt-3 flex items-center gap-1.5 text-[13px] text-fg-muted">
                <ShieldCheck className="size-4 text-primary" aria-hidden />
                {casino.licenceUrl ? (
                  <a href={casino.licenceUrl} target="_blank" rel="nofollow noopener" className="underline-offset-4 hover:text-white hover:underline">
                    {casino.licence}
                  </a>
                ) : (
                  casino.licence
                )}
              </p>
            )}
            {casino.summary && <p className="mb-0 mt-4 max-w-[60ch] text-[16px] leading-relaxed text-grey-200">{casino.summary}</p>}
          </div>

          <div className="flex flex-col gap-3">
            {card.bonusLabel && (
              <div className="rounded-xl border border-dashed border-accent-2/60 bg-accent-2/[0.06] px-4 py-3">
                <span className="flex items-center gap-2">
                  <Gift className="size-4 text-accent-2" aria-hidden />
                  <span className="font-heading text-[26px] font-black leading-none text-accent-2">{card.bonusLabel}</span>
                </span>
                {card.bonusDescription && <p className="mb-0 mt-1.5 text-[13px] leading-snug text-grey-200">{card.bonusDescription}</p>}
              </div>
            )}
            <a
              href={card.visitHref}
              target="_blank"
              rel={SPONSORED}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-heading text-[16px] font-black text-primary-foreground transition-opacity hover:opacity-90"
            >
              {affiliate.claimLabel}
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <p className="m-0 text-center text-[11px] leading-snug text-grey-400">{card.terms}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Fact label="Our rating">{card.rating.toFixed(1)}/5</Fact>
          {card.bonusLabel && <Fact label={site.affiliate.bonusLabel}>{card.bonusLabel}</Fact>}
          {casino.minDeposit && <Fact label="Min. deposit">{casino.minDeposit}</Fact>}
          {casino.withdrawalTime && <Fact label="Withdrawals">{casino.withdrawalTime}</Fact>}
          {casino.established && <Fact label="Established">{casino.established}</Fact>}
          <Fact label={site.catalog.sections.payments.label}>{card.paymentMethods.length}</Fact>
        </dl>

        {details.groups.length > 0 && (
          <div className="mt-6 grid gap-x-8 gap-y-5 rounded-2xl border border-grey-800 bg-grey-900 p-5 md:grid-cols-2 lg:p-6">
            {details.groups.map((g) => {
              const { icon: Icon, cue } = GROUP_STYLE[g.key] ?? {};
              return (
                <div key={g.key} className="flex min-w-0 items-start gap-3">
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    {Icon && <Icon className="size-[18px]" strokeWidth={2} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
                      {g.label}
                      <span className="font-medium normal-case tracking-normal text-grey-500">{g.items.length}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.items.map((item) => (
                        <AttributeChip key={item.id} item={item} cue={cue} icon={g.key === "licences" ? ShieldCheck : undefined} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {card.payments.length > 0 && (
          <section id="payment-methods" className="mt-8 scroll-mt-28">
            <h2 className="m-0 font-heading text-[22px] font-black text-white">{site.catalog.sections.payments.label}</h2>
            <PaymentTable payments={card.payments} />
          </section>
        )}

        {details.bonuses.length > 0 && (
          <section className="mt-8">
            <h2 className="m-0 font-heading text-[22px] font-black text-white">{casino.name} bonuses</h2>
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
                          <AttributeChip key={t.id} item={t} className="py-0.5 text-[11px] uppercase tracking-wide" />
                        ))}
                      </div>
                    )}
                  </div>
                  <BonusDetails bonus={b} casino={card} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ProConList title="What we like" items={texts(casino.pros)} positive />
          <ProConList title="What could be better" items={texts(casino.cons)} />
        </div>

        <article className="article-prose mt-10 max-w-[72ch]">
          <ContentRenderer content={casino.content} nodes={casino.review_nodes} generalData={generalData} />
        </article>
      </section>

      <CasinoList title="Other top casinos" topBadge="" showSort={false} licensedLabel="" limit={3} exclude={slug} />

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-grey-800 bg-grey-950/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[14px] font-black text-white">{casino.name}</p>
          {card.bonusLabel && <p className="m-0 truncate text-[12px] font-semibold text-accent-2">{card.bonusLabel}</p>}
        </div>
        <a
          href={card.visitHref}
          target="_blank"
          rel={SPONSORED}
          className="flex h-11 items-center gap-1.5 rounded-xl bg-primary px-5 font-heading text-[15px] font-black text-primary-foreground"
        >
          {affiliate.visitLabel}
          <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>
    </>
  );
}
