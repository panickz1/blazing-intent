import Link from "next/link";
import { site, isExternalUrl } from "@/site.config";

export default function AppCtaCard() {
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
