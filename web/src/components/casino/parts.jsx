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

export function PaymentLogos({ payments, max = 3, className }) {
  if (payments.length === 0) return null;
  const shown = payments.slice(0, max);
  const extra = payments.length - shown.length;
  const all = payments.map((p) => p.name).join(", ");
  if (!shown.some((p) => p.logo?.src)) {
    return (
      <p className={cn("m-0 truncate text-[13px] text-grey-100", className)} title={all}>
        {shown.map((p) => p.name).join(", ")}
        {extra > 0 && <span className="text-fg-muted"> +{extra}</span>}
      </p>
    );
  }
  return (
    <ul className={cn("m-0 flex list-none flex-wrap items-center gap-1.5 p-0", className)} title={all}>
      {shown.map((p) => (
        <li key={p.id} className="flex h-7 items-center rounded border border-grey-700 bg-grey-950 px-1.5">
          {p.logo?.src ? (
            <Image src={p.logo.src} alt={p.name} width={p.logo.width || 48} height={p.logo.height || 24} className="h-4 w-auto max-w-12 object-contain" />
          ) : (
            <span className="text-[11.5px] font-semibold text-grey-100">{p.name}</span>
          )}
        </li>
      ))}
      {extra > 0 && <li className="text-[12px] text-fg-muted">+{extra}</li>}
    </ul>
  );
}
