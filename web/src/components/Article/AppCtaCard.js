import Link from "next/link";
import { site, isExternalUrl } from "@/site.config";
import CasinoLogo from "@/components/casino/CasinoLogo";
import Rating from "@/components/casino/Rating";
import { ReviewButton, VisitButton } from "@/components/casino/parts";

function SiteCta() {
  const external = isExternalUrl(site.cta.url);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-5 text-primary-foreground shadow-lg">
      <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
      <div className="relative flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
          {site.name}
        </span>
        <h3 className="!mb-0 !mt-0 text-lg font-black leading-tight">{site.tagline}</h3>
        <Link
          href={site.cta.url}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-grey-950 transition hover:brightness-90"
        >
          {site.cta.label}
        </Link>
      </div>
    </div>
  );
}

export default function AppCtaCard({ casino }) {
  if (!casino) return <SiteCta />;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-grey-800 bg-grey-900 p-4">
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />
      <div className="relative flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">{site.affiliate.pickLabel}</span>
        <div className="mt-3 flex items-center gap-3">
          <Link href={casino.reviewHref} aria-label={`${casino.name} review`} className="shrink-0">
            <CasinoLogo casino={casino} className="h-12 w-16 [&>span]:text-[12px]" />
          </Link>
          <div className="min-w-0">
            <p className="m-0 truncate font-heading text-[16px] font-bold text-white">{casino.name}</p>
            <Rating value={casino.rating} size="sm" className="mt-0.5" />
          </div>
        </div>
        {casino.bonusLabel && (
          <div className="mt-3 rounded-lg border border-grey-800 bg-grey-950 px-3 py-2">
            <span className="block text-[11.5px] text-fg-muted">{site.affiliate.bonusLabel}</span>
            <span className="block text-[17px] font-bold leading-tight text-white">{casino.bonusLabel}</span>
          </div>
        )}
        <VisitButton casino={casino} className="mt-3" />
        <ReviewButton casino={casino} className="mt-2 h-9 border-transparent text-[13px] text-grey-300" />
        <p className="m-0 mt-2 text-[11.5px] leading-snug text-grey-400">{casino.terms}</p>
      </div>
    </div>
  );
}
