import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

const SPONSORED = "nofollow sponsored noopener";

export function BonusCell({ casino, className }) {
  if (!casino.bonusLabel) return null;
  return (
    <a
      href={casino.visitHref}
      target="_blank"
      rel={SPONSORED}
      className={cn("block min-w-0 rounded-lg border border-grey-800 bg-grey-950 px-3 py-2", className)}
    >
      <span className="block text-[12px] text-fg-muted">{site.affiliate.bonusLabel}</span>
      <span className="block truncate text-[17px] font-bold leading-tight text-white">{casino.bonusLabel}</span>
      {casino.bonusDescription && (
        <span className="block truncate text-[12px] text-fg-muted" title={casino.bonusDescription}>
          {casino.bonusDescription}
        </span>
      )}
    </a>
  );
}

export function VisitButton({ casino, className }) {
  return (
    <a
      href={casino.visitHref}
      target="_blank"
      rel={SPONSORED}
      className={cn(
        "flex h-10 items-center justify-center rounded-md bg-primary px-4 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/85",
        className
      )}
    >
      {site.affiliate.visitLabel}
      <span className="sr-only"> {casino.name}</span>
    </a>
  );
}

export function ReviewButton({ casino, className }) {
  return (
    <Link
      href={casino.reviewHref}
      className={cn(
        "flex h-10 items-center justify-center rounded-md border border-grey-700 px-4 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white",
        className
      )}
    >
      {site.affiliate.reviewLabel}
      <span className="sr-only"> of {casino.name}</span>
    </Link>
  );
}

function PaymentTile({ payment }) {
  const label = site.catalog.sections.payments.title.replace("{name}", payment.name);
  const logo = payment.logo?.src;
  const classes = cn(
    "flex h-6 items-center justify-center rounded border border-grey-700 bg-grey-950 text-[11px] font-semibold text-grey-100",
    logo ? "w-[34px] px-1" : "px-1.5",
    payment.href && "transition-colors hover:border-primary/60 hover:bg-primary/[0.06]"
  );
  const body = logo ? (
    <Image src={logo} alt={payment.name} width={payment.logo.width || 32} height={payment.logo.height || 16} className="h-3.5 w-auto max-w-full object-contain" />
  ) : (
    payment.name
  );
  return payment.href ? (
    <Link href={payment.href} title={label} className={classes}>
      {body}
    </Link>
  ) : (
    <span title={payment.name} className={classes}>
      {body}
    </span>
  );
}

export function PaymentLogos({ payments, max = 5, moreHref, className }) {
  if (payments.length === 0) return null;
  const shown = payments.slice(0, max);
  const extra = payments.length - shown.length;
  const more = `+${extra}`;
  return (
    <ul className={cn("m-0 flex list-none flex-wrap items-center gap-1 p-0", className)}>
      {shown.map((p) => (
        <li key={p.id}>
          <PaymentTile payment={p} />
        </li>
      ))}
      {extra > 0 && (
        <li className="px-0.5 text-[12px] text-fg-muted">
          {moreHref ? (
            <Link
              href={moreHref}
              title={payments.slice(max).map((p) => p.name).join(", ")}
              aria-label={`${extra} more ${site.catalog.sections.payments.label.toLowerCase()}`}
              className="transition-colors hover:text-white"
            >
              {more}
            </Link>
          ) : (
            more
          )}
        </li>
      )}
    </ul>
  );
}
