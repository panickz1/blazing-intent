import { getBonusRows } from "@/lib/bonuses";
import BonusTable from "@/components/bonus/BonusTable";
import { cn } from "@/lib/utils";

export default async function BonusList({
  headingLevel = "h2",
  eyebrow,
  title,
  titleAccent,
  description,
  bonusType,
  sortBy = "recommended",
  showSearch = true,
  searchPlaceholder,
  initialCount,
  limit,
}) {
  const bonuses = await getBonusRows({ type: bonusType, sortBy, limit });
  if (bonuses.length === 0) return null;
  const Heading = headingLevel === "h1" ? "h1" : "h2";
  const isTitle = Heading === "h1";

  return (
    <section className={cn("landing-container", isTitle ? "pb-14 pt-12 lg:pb-20 lg:pt-20" : "py-14 lg:py-20")}>
      {(eyebrow || title || description) && (
        <header className="mb-8 max-w-[64ch]">
          {eyebrow && <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
          {title && (
            <Heading
              className={cn(
                "m-0 mt-3 font-heading font-black leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance]",
                isTitle ? "text-[clamp(32px,5vw,56px)]" : "text-[clamp(28px,4vw,44px)]"
              )}
            >
              {title} {titleAccent && <span className="text-primary">{titleAccent}</span>}
            </Heading>
          )}
          {description && <p className="m-0 mt-4 text-[17px] leading-relaxed text-fg-muted">{description}</p>}
        </header>
      )}
      <BonusTable bonuses={bonuses} showSearch={showSearch} searchPlaceholder={searchPlaceholder} initialCount={initialCount} />
    </section>
  );
}
