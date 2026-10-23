import { ArrowRight, Gift } from "lucide-react";
import CopyCode from "@/components/bonus/CopyCode";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

const SPONSORED = "nofollow sponsored noopener";

export default function OfferTicket({ bonus, card, extraOffers = 0, className }) {
  const l = site.bonuses;
  const r = site.review;
  const terms = bonus
    ? [
        [l.columns.wagering, bonus.wagering],
        [l.columns.deposit, bonus.minDeposit],
        [l.maxBet, bonus.maxBet],
        [l.freeSpins, bonus.freeSpins],
        [l.maxWin, bonus.maxWin],
      ]
        .filter(([, value]) => value)
        .slice(0, 3)
    : [];

  return (
    <aside id="review-offer" className={cn("overflow-hidden rounded-3xl border border-accent-2/35 bg-grey-900", className)}>
      {bonus && (
        <div className="border-b border-dashed border-accent-2/40 bg-accent-2/[0.07] px-4 pb-4 pt-4 lg:px-6 lg:pb-5 lg:pt-5">
          <p className="m-0 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-accent-2">
            <Gift className="size-4" aria-hidden />
            {r.offer}
          </p>
          <p className="m-0 mt-2 font-heading text-[34px] font-black leading-none text-accent-2 lg:text-[44px]">{bonus.headline}</p>
          {bonus.description && <p className="m-0 mt-2 text-[14px] leading-snug text-grey-200">{bonus.description}</p>}
        </div>
      )}
      <div className="flex flex-col gap-3 p-4 lg:px-6 lg:pb-6">
        {terms.length > 0 && (
          <dl className="m-0 divide-y divide-grey-800 rounded-xl bg-grey-950 px-3.5">
            {terms.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-3 py-2">
                <dt className="text-[13px] text-fg-muted">{label}</dt>
                <dd className="m-0 text-right text-[14.5px] font-extrabold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {bonus?.code && <CopyCode code={bonus.code} />}
        <a
          id="review-offer-cta"
          href={card.visitHref}
          target="_blank"
          rel={SPONSORED}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-heading text-[16px] font-black text-primary-foreground transition-opacity hover:opacity-90"
        >
          {bonus ? site.affiliate.claimLabel : site.affiliate.visitLabel}
          <ArrowRight className="size-4" aria-hidden />
        </a>
        <p className="m-0 flex items-center justify-between gap-3 text-[11px] leading-snug text-grey-400">
          <span>{card.terms}</span>
          {extraOffers > 0 && (
            <a href="#bonuses" className="shrink-0 font-bold text-primary hover:underline">
              {extraOffers === 1 ? r.moreOffer : r.moreOffers.replace("{count}", extraOffers)}
            </a>
          )}
        </p>
      </div>
    </aside>
  );
}
