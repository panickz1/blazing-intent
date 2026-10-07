import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { site } from "@/site.config";

const SPONSORED = "nofollow sponsored noopener";

function facts(bonus) {
  const l = site.bonuses;
  return [
    [l.columns.wagering, bonus.wagering],
    [l.columns.deposit, bonus.minDeposit],
    [l.code, bonus.code],
    [l.freeSpins, bonus.freeSpins],
    [l.maxWin, bonus.maxWin],
    [l.minOdds, bonus.minOdds],
    [l.validUntil, bonus.validUntil && new Date(bonus.validUntil).toLocaleDateString(site.locale, { day: "numeric", month: "long", year: "numeric" })],
  ].filter(([, value]) => value);
}

export default function BonusDetails({ bonus, casino, showActions = true }) {
  const l = site.bonuses;
  const list = facts(bonus);
  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      {bonus.steps.length > 0 && (
        <div className="rounded-lg border border-grey-800 bg-grey-950 p-4">
          <h4 className="m-0 text-[12px] font-semibold uppercase tracking-widest text-fg-muted">{l.howToClaim}</h4>
          <ol className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
            {bonus.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] leading-snug text-grey-100">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-[12px] font-bold text-primary">{i + 1}</span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-lg border border-grey-800 bg-grey-950 p-4">
        <h4 className="m-0 text-[12px] font-semibold uppercase tracking-widest text-fg-muted">{l.info}</h4>
        {bonus.info && (
          <div className="text-[14px] leading-relaxed text-grey-200 [&>*:first-child]:mt-0 [&_p]:mt-2 [&_p]:text-[14px] [&_p]:leading-relaxed">
            <Markdown>{bonus.info}</Markdown>
          </div>
        )}
        {list.length > 0 && (
          <dl className="m-0 grid grid-cols-2 gap-2">
            {list.map(([label, value]) => (
              <div key={label} className="rounded-md border border-grey-800 px-3 py-2">
                <dt className="text-[11px] text-fg-muted">{label}</dt>
                <dd className="m-0 text-[14px] font-semibold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="m-0 text-[11.5px] leading-snug text-grey-400">{bonus.terms}</p>
        {showActions && casino && (
          <div className="mt-auto flex gap-2">
            <a
              href={casino.visitHref}
              target="_blank"
              rel={SPONSORED}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
            >
              {site.affiliate.claimLabel}
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <Link
              href={casino.reviewHref}
              className="flex h-10 items-center justify-center rounded-md border border-grey-700 px-4 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
            >
              {site.affiliate.reviewLabel}
              <span className="sr-only"> of {casino.name}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
