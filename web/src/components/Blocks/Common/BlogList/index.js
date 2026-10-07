import { getBlogIndex } from "@/lib/blog";
import { num, pick } from "@/lib/cms";
import Schema from "@/helpers/SEO/Schema";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { BlogListClient } from "./BlogListClient";

export default async function BlogList(props) {
  const only = (props.categories ?? [])
    .map((row) => row?.categories_id?.slug ?? row?.slug ?? null)
    .filter(Boolean);

  const { cards, chips } = await getBlogIndex(only);

  const eyebrow = pick(props.eyebrow, "The blog");
  const title = pick(props.title, "Latest articles");
  const description = props.description;
  const Heading = props.headingLevel === "h1" ? "h1" : "h2";

  const limit = num(props.limit, 0);
  const shownCards = limit > 0 ? cards.slice(0, limit) : cards;
  const shownChips = chips
    .map((c) => ({ ...c, count: shownCards.filter((card) => card.category?.slug === c.slug).length }))
    .filter((c) => c.count > 0);
  const allUrl = props.allUrl;
  const allLabel = props.allLabel;

  return (
    <section className="landing-container py-14 lg:py-20">
      <Schema
        type="itemList"
        data={{ name: title, items: shownCards.map((c) => ({ name: c.title, url: c.href })) }}
      />

      {Heading === "h1" ? (
        <div className="max-w-[62ch]">
          {eyebrow && <p className="m-0 text-[13px] font-semibold text-primary">{eyebrow}</p>}
          <h1 className="m-0 mt-2 font-heading text-[clamp(30px,4vw,48px)] font-bold leading-[1.08] tracking-[-0.02em] text-white [text-wrap:balance]">
            {title}
          </h1>
          {description && <p className="m-0 mt-3 text-[16px] leading-relaxed text-grey-200">{description}</p>}
        </div>
      ) : (
        <SectionHeader eyebrow={eyebrow} title={title} lead={description} />
      )}

      <div className="mt-8">
        <BlogListClient
          cards={shownCards}
          chips={shownChips}
          initialCount={num(props.initialCount, 9)}
          step={num(props.step, 9)}
          showFilters={props.showFilters !== false}
          loadMoreLabel={pick(props.loadMoreLabel, "Load more")}
        />
      </div>

      {allUrl && allLabel && (
        <Link
          href={allUrl}
          className="mt-8 inline-flex h-10 items-center gap-1.5 rounded-md border border-grey-700 px-4 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
        >
          {allLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </section>
  );
}
