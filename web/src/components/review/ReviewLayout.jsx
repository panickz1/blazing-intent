import { ShieldCheck, Zap } from "lucide-react";
import { titleClass } from "@/components/Layout/PageIntro";
import CasinoLogo from "@/components/casino/CasinoLogo";
import AttributeChip from "@/components/catalog/AttributeChip";
import { isFastPayout } from "@/lib/casinos";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";
import OfferTicket from "./OfferTicket";
import ScoreRing, { gradeFor } from "./ScoreRing";

const PILLS_MOBILE = 4;
const PILLS_DESKTOP = 6;

const SEGMENT = "border border-grey-800 bg-grey-900 rounded-2xl lg:-mt-px lg:rounded-none";
const LABEL = "m-0 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-fg-muted";

function FastBadge() {
  return (
    <span className="inline-flex h-[18px] items-center gap-0.5 rounded-full bg-primary/15 px-1.5 text-[10.5px] font-bold text-primary">
      <Zap aria-hidden className="size-3 fill-current" strokeWidth={0} />
      {site.review.fast}
    </span>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(site.locale, { day: "numeric", month: "short", year: "numeric" }) : null;
}

function facts(casino, card, bonus) {
  const f = site.review.facts;
  return [
    casino.withdrawalTime && { label: f.payout, value: casino.withdrawalTime, fast: isFastPayout(casino.withdrawalTime) },
    casino.minDeposit && { label: f.deposit, value: casino.minDeposit },
    bonus?.wagering && { label: f.wagering, value: bonus.wagering },
    card.gameCount && { label: f.games, value: `${card.gameCount.toLocaleString(site.locale)}+`, sub: card.liveCasino ? f.live : null },
  ].filter(Boolean);
}

export default function ReviewLayout({ casino, card, details, aside, children }) {
  const r = site.review;
  const [bonus, ...otherBonuses] = details.bonuses;
  const licences = details.groups.find((g) => g.key === "licences")?.items ?? [];
  const operator = details.groups.find((g) => g.key === "operators")?.items[0];
  const updated = formatDate(details.updated);
  const factList = facts(casino, card, bonus);
  const payments = card.payments;
  const hiddenMobile = Math.max(0, payments.length - PILLS_MOBILE);
  const hiddenDesktop = Math.max(0, payments.length - PILLS_DESKTOP);
  const last = payments.length ? "payments" : factList.length ? "facts" : "score";
  const end = (key) => last === key && "lg:rounded-b-3xl";

  return (
    <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-6 lg:gap-y-0">
      <div
        className="order-1 overflow-hidden rounded-2xl border border-grey-800 lg:col-start-1 lg:row-start-1 lg:rounded-b-none lg:rounded-t-3xl"
        style={{ backgroundColor: `color-mix(in srgb, ${card.brandColor || "hsl(var(--grey-800))"} 22%, hsl(var(--grey-900)))` }}
      >
        <div className="flex items-center gap-4 p-4 pb-3 lg:gap-5 lg:px-7 lg:pb-4 lg:pt-6">
          <CasinoLogo casino={card} className="size-16 shrink-0 rounded-2xl ring-4 ring-white/5 lg:size-[92px]" />
          <div className="min-w-0">
            <p className="m-0 mb-1.5 text-[12px] font-semibold text-fg-muted lg:text-[13px]">
              <span className="max-sm:hidden">{r.eyebrow} · </span>
              {updated && r.updated.replace("{date}", updated)}
            </p>
            <h1 className={titleClass("md")}>{casino.name} review</h1>
          </div>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 px-4 pb-4 lg:px-7 lg:pb-6">
          <li className="lg:hidden">
            <a
              href="#score"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-[12.5px] font-black text-white"
            >
              {card.rating.toFixed(1)}
              <span className="text-[10.5px] font-extrabold uppercase tracking-[0.05em] text-primary">{gradeFor(card.rating)}</span>
            </a>
          </li>
          {licences.map((l) => (
            <li key={l.id}>
              <AttributeChip item={l} icon={ShieldCheck} className="border-primary/35 bg-primary/[0.08]" />
            </li>
          ))}
          {licences.length === 0 && casino.licence && (
            <li>
              <AttributeChip item={{ name: casino.licence }} icon={ShieldCheck} />
            </li>
          )}
          {casino.established && (
            <li>
              <AttributeChip item={{ name: r.since.replace("{year}", casino.established) }} />
            </li>
          )}
          {operator && (
            <li className="max-sm:hidden">
              <AttributeChip item={operator} />
            </li>
          )}
        </ul>
      </div>

      <div className="contents lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:flex lg:flex-col lg:gap-6">
        <OfferTicket bonus={bonus} card={card} extraOffers={otherBonuses.length} className="order-2" />
        {aside && <div className="order-7 mt-7 flex flex-col gap-6 lg:mt-0 lg:flex-1">{aside}</div>}
      </div>

      <div id="score" className={cn(SEGMENT, end("score"), "order-5 scroll-mt-28 p-4 lg:col-start-1 lg:row-start-2 lg:px-7 lg:py-6")}>
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="flex items-center gap-4 lg:gap-6">
            <ScoreRing value={card.rating} className="size-[76px] lg:size-28" valueClassName="text-[24px] lg:text-[32px]" gradeClassName="max-lg:hidden" />
            {details.verdict && (
              <div className="min-w-0">
                <p className={cn(LABEL, "mb-1.5")}>{r.verdict}</p>
                <p className="m-0 max-w-[60ch] text-[14.5px] leading-normal text-grey-100 lg:text-[16px]">{details.verdict}</p>
              </div>
            )}
          </div>
          {details.scores.length > 0 && (
            <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-2.5 p-0 sm:grid-cols-3 lg:gap-x-7 lg:gap-y-3">
              {details.scores.map((s) => (
                <li key={s.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1.5 text-[12.5px] lg:text-[13px]">
                  <span className="font-medium text-grey-200">{s.label}</span>
                  <span className="text-right font-bold tabular-nums text-white">{s.value.toFixed(1)}</span>
                  <span aria-hidden className="col-span-2 h-1.5 overflow-hidden rounded-full bg-grey-700">
                    <span
                      className={cn("block h-full rounded-full", s.value >= site.review.grades[0].min ? "bg-primary" : "bg-accent-2")}
                      style={{ width: `${(s.value / 5) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {factList.length > 0 && (
        <dl
          className={cn(
            SEGMENT,
            end("facts"),
            "order-3 m-0 grid grid-cols-2 gap-px overflow-hidden bg-grey-800 lg:col-start-1 lg:row-start-3 lg:auto-cols-fr lg:grid-flow-col"
          )}
        >
          {factList.map((f, i) => (
            <div
              key={f.label}
              className={cn("bg-grey-900 px-4 py-3 lg:px-6 lg:py-4", i === factList.length - 1 && factList.length % 2 === 1 && "col-span-2 lg:col-span-1")}
            >
              <dt className={cn(LABEL, "mb-1")}>{f.label}</dt>
              <dd className="m-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[15px] font-extrabold text-white lg:text-[18px]">
                {f.value}
                {f.fast && <FastBadge />}
                {f.sub && <span className="text-[12px] font-semibold text-fg-muted lg:text-[13px]">{f.sub}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {payments.length > 0 && (
        <div className="order-4 flex items-baseline gap-4 lg:col-start-1 lg:row-start-4 lg:-mt-px lg:rounded-b-3xl lg:border lg:border-grey-800 lg:bg-grey-900 lg:px-7 lg:py-5">
          <p className={cn(LABEL, "shrink-0 max-lg:sr-only")}>{r.payWith}</p>
          <ul className="m-0 flex min-w-0 flex-1 list-none flex-wrap items-center gap-1.5 p-0">
            {payments.slice(0, PILLS_DESKTOP).map((m, i) => (
              <li key={m.id} className={cn(i >= PILLS_MOBILE && "max-lg:hidden")}>
                <AttributeChip item={m} className="h-8 px-2.5 text-[13px]">
                  {isFastPayout(m.withdrawalTime) && <FastBadge />}
                </AttributeChip>
              </li>
            ))}
            {hiddenMobile > 0 && (
              <li className="lg:hidden">
                <a href="#payment-methods" className="px-1 text-[13px] font-bold text-primary hover:underline">
                  {r.more.replace("{count}", hiddenMobile)}
                </a>
              </li>
            )}
            {hiddenDesktop > 0 && (
              <li className="max-lg:hidden">
                <a href="#payment-methods" className="px-1 text-[13px] font-bold text-primary hover:underline">
                  {r.more.replace("{count}", hiddenDesktop)}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="review-body order-6 mt-7 flex min-w-0 flex-col gap-10 lg:col-start-1 lg:row-start-5 lg:mt-10">{children}</div>
    </section>
  );
}
