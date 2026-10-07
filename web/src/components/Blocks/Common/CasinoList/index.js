import { getCasinoCards } from "@/lib/casinos";
import Schema from "@/helpers/SEO/Schema";
import CasinoListClient from "@/components/casino/CasinoListClient";
import CasinoCompactCard from "@/components/casino/CasinoCompactCard";
import { SectionHeader } from "@/components/ui/section-header";
import { site } from "@/site.config";

export default async function CasinoList({
  eyebrow,
  title,
  description,
  licensedLabel = "Licensed casinos only",
  topBadge = "Our pick",
  showSort = true,
  limit,
  initialCount,
  variant = "ranked",
  sortBy,
  casinos,
  exclude,
}) {
  const ids = (Array.isArray(casinos) ? casinos : [])
    .map((row) => row?.casinos_id?.id ?? row?.casinos_id)
    .filter((id) => typeof id === "number" || typeof id === "string");
  const cards = await getCasinoCards({ ids, limit, exclude, sortBy });
  if (cards.length === 0) return null;

  if (variant === "compact") {
    return (
      <section className="landing-container py-14 lg:py-20">
        <SectionHeader eyebrow={eyebrow} title={title || site.affiliate.listHeading} lead={description} />
        <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((casino) => (
            <li key={casino.id}>
              <CasinoCompactCard casino={casino} showLaunched={sortBy === "newest"} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section id="top-casinos" className="landing-container scroll-mt-24 pb-10 pt-5 lg:pb-14">
      <Schema
        type="itemList"
        data={{ name: title || "Casinos", items: cards.map((c) => ({ name: c.name, url: c.reviewHref })) }}
      />
      {!title && <h2 className="sr-only">{site.affiliate.listHeading}</h2>}
      {(eyebrow || title || description) && (
        <div className="mb-6 max-w-[62ch]">
          {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
          {title && (
            <h2 className="m-0 mt-3 font-heading text-[clamp(28px,4vw,44px)] font-black leading-[1.05] tracking-[-0.03em] text-white">{title}</h2>
          )}
          {description && <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">{description}</p>}
        </div>
      )}
      <CasinoListClient casinos={cards} topBadge={topBadge} licensedLabel={licensedLabel} showSort={showSort} initialCount={initialCount} />
    </section>
  );
}
