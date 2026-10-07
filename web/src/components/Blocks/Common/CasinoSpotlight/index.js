import Link from "next/link";
import { getCasinoCards } from "@/lib/casinos";
import { SectionHeader } from "@/components/ui/section-header";
import CasinoLogo from "@/components/casino/CasinoLogo";
import Rating from "@/components/casino/Rating";
import { BonusCell, ReviewButton, VisitButton } from "@/components/casino/parts";

export default async function CasinoSpotlight({ eyebrow, title, lead, picks, numbered = true }) {
  const rowsIn = (Array.isArray(picks) ? picks : []).filter((p) => p?.casinos_id);
  const ids = rowsIn.map((p) => p.casinos_id?.id ?? p.casinos_id);
  const extras = new Map(rowsIn.map((p) => [p.casinos_id?.id ?? p.casinos_id, p]));
  const cards = await getCasinoCards({ ids, limit: ids.length ? undefined : 3 });
  if (cards.length === 0) return null;

  return (
    <section className="py-14 lg:py-20">
      <div className="landing-container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <ol className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
          {cards.map((casino, i) => {
            const extra = extras.get(casino.id) ?? {};
            const text = extra.text || casino.summary;
            return (
              <li key={casino.id}>
                <article className="grid gap-5 rounded-xl border border-grey-800 bg-grey-900 p-4 md:grid-cols-[120px_minmax(0,1fr)] lg:grid-cols-[120px_minmax(0,1fr)_210px] lg:p-5">
                  <Link href={casino.reviewHref} aria-label={`${casino.name} review`} className="self-start">
                    <CasinoLogo casino={casino} className="h-[80px]" />
                  </Link>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="m-0 font-heading text-[19px] font-bold text-white">
                        {numbered && <span className="mr-1.5 text-fg-muted">{i + 1}. </span>}
                        <Link href={casino.reviewHref} className="hover:underline">
                          {casino.name}
                        </Link>
                      </h3>
                      {extra.label && (
                        <span className="rounded border border-primary/40 px-1.5 py-0.5 text-[12px] font-semibold text-primary">{extra.label}</span>
                      )}
                    </div>
                    <Rating value={casino.rating} size="sm" className="mt-1.5" />
                    {text && <p className="m-0 mt-3 text-[15px] leading-relaxed text-grey-200">{text}</p>}
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
                    <BonusCell casino={casino} />
                    <div className="grid grid-cols-2 gap-2">
                      <VisitButton casino={casino} />
                      <ReviewButton casino={casino} />
                    </div>
                    <p className="m-0 text-[12px] text-grey-400">{casino.terms}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
