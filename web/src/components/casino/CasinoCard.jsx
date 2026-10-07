import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";
import { BonusCell, PaymentLogos, ReviewButton, VisitButton } from "./parts";
import CasinoLogo from "./CasinoLogo";
import Rating from "./Rating";

export default function CasinoCard({ casino, badge }) {
  const { affiliate } = site;

  return (
    <article
      className={cn(
        "relative rounded-xl border bg-grey-900 px-3 pb-2 pt-3 lg:px-4",
        badge ? "border-primary/60" : "border-grey-800"
      )}
    >
      {badge && (
        <span className="absolute -top-2.5 left-3 rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold uppercase leading-none tracking-wide text-primary-foreground">
          {badge}
        </span>
      )}

      <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 lg:grid-cols-[112px_minmax(0,170px)_minmax(0,1fr)_minmax(0,150px)_minmax(0,150px)_120px] lg:gap-x-5">
        <Link href={casino.reviewHref} aria-label={`${casino.name} ${affiliate.reviewLabel.toLowerCase()}`}>
          <CasinoLogo casino={casino} className="h-[64px] lg:h-[76px]" />
        </Link>

        <div className="min-w-0">
          <h3 className="m-0 truncate font-heading text-[17px] font-bold text-white">
            <Link href={casino.reviewHref} className="hover:underline">
              {casino.name}
            </Link>
          </h3>
          <Rating value={casino.rating} size="sm" className="mt-1" />
          {casino.licence && <p className="m-0 mt-1 truncate text-[12px] text-fg-muted">{casino.licence}</p>}
        </div>

        {casino.highlights.length > 0 && (
          <ul className="col-span-2 m-0 flex min-w-0 flex-col gap-1 lg:col-span-1">
            {casino.highlights.map((h) => (
              <li key={h} title={h} className="flex min-w-0 items-center gap-2 text-[13.5px] text-grey-100">
                <Check className="size-3.5 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                <span className="truncate">{h}</span>
              </li>
            ))}
          </ul>
        )}

        {casino.paymentMethods.length > 0 && (
          <div className="hidden min-w-0 lg:block">
            <p className="m-0 text-[12px] text-fg-muted">{affiliate.paymentMethodsLabel}</p>
            <PaymentLogos payments={casino.payments} className="mt-1" />
          </div>
        )}

        <BonusCell casino={casino} className="col-span-2 lg:col-span-1" />

        <div className="col-span-2 grid grid-cols-2 gap-2 lg:col-span-1 lg:grid-cols-1 lg:gap-1.5">
          <VisitButton casino={casino} />
          <ReviewButton casino={casino} className="lg:h-9" />
        </div>
      </div>

      {casino.terms && <p className="m-0 mt-2 border-t border-grey-800 pt-1.5 text-[12px] text-grey-400">{casino.terms}</p>}
    </article>
  );
}
