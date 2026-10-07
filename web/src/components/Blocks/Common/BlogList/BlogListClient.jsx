"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import formatDate from "@/helpers/functions/formatDate";

function Chip({ active, children, onClick, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-[13px] font-medium transition-colors",
        active ? "border-grey-600 bg-grey-800 text-white" : "border-transparent text-grey-300 hover:text-white"
      )}
    >
      {children}
      <span className="text-[12px] text-fg-muted">{count}</span>
    </button>
  );
}

function Meta({ card, className }) {
  return (
    <div className={cn("flex items-center gap-2 text-[12.5px] text-fg-muted", className)}>
      {card.category && <span className="font-semibold text-primary">{card.category.name}</span>}
      {card.date && (
        <>
          <span aria-hidden>·</span>
          <time dateTime={card.date}>{formatDate(card.date)}</time>
        </>
      )}
    </div>
  );
}

function Media({ card, sizes, priority, className, iconClassName = "size-6" }) {
  return (
    <div className={cn("relative overflow-hidden bg-grey-800", className)}>
      {card.imageUrl ? (
        <Image
          src={card.imageUrl}
          alt={card.imageAlt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-grey-800 to-grey-900">
          <Newspaper className={cn("text-primary/70", iconClassName)} aria-hidden />
        </div>
      )}
    </div>
  );
}

function CompactCard({ card, priority }) {
  return (
    <Link
      href={card.href}
      className="group flex h-full items-center gap-4 rounded-xl border border-grey-800 bg-grey-900 p-3 transition-colors hover:border-grey-600"
    >
      <Media
        card={card}
        priority={priority}
        sizes="128px"
        iconClassName="size-5"
        className="aspect-square w-24 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <Meta card={card} className="text-[12px]" />
        <h3 className="m-0 mt-1.5 line-clamp-2 font-heading text-[16px] font-bold leading-snug text-white transition-colors group-hover:text-primary">
          {card.title}
        </h3>
        {card.summary && <p className="m-0 mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-grey-300">{card.summary}</p>}
      </div>
    </Link>
  );
}

function FeaturedCard({ card, readLabel }) {
  return (
    <Link
      href={card.href}
      className="group grid overflow-hidden rounded-2xl border border-grey-800 bg-grey-900 transition-colors hover:border-grey-600 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
    >
      <Media
        card={card}
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        iconClassName="size-12"
        className="aspect-[2/1] lg:order-2 lg:aspect-auto lg:min-h-[320px]"
      />
      <div className="flex flex-col justify-center p-6 lg:p-9">
        <Meta card={card} />
        <h2 className="m-0 mt-3 font-heading text-[clamp(22px,2.6vw,32px)] font-bold leading-[1.15] tracking-[-0.01em] text-white transition-colors group-hover:text-primary [text-wrap:balance]">
          {card.title}
        </h2>
        {card.summary && <p className="m-0 mt-3 line-clamp-3 text-[15.5px] leading-relaxed text-grey-200">{card.summary}</p>}
        <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
          {readLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function GridCard({ card }) {
  return (
    <Link
      href={card.href}
      className="group flex h-full items-center gap-4 overflow-hidden rounded-xl border border-grey-800 bg-grey-900 p-3 transition-colors hover:border-grey-600 sm:flex-col sm:items-stretch sm:gap-0 sm:p-0"
    >
      <Media
        card={card}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 128px"
        iconClassName="size-5 sm:size-6"
        className="aspect-square w-24 shrink-0 rounded-lg sm:aspect-[2/1] sm:w-full sm:rounded-none"
      />
      <div className="flex min-w-0 flex-1 flex-col py-0.5 sm:self-stretch sm:p-5">
        <Meta card={card} className="text-[12px] sm:text-[12.5px]" />
        <h3 className="m-0 mt-1.5 line-clamp-2 font-heading text-[16px] sm:mt-2 sm:text-[17px] font-bold leading-snug text-white transition-colors group-hover:text-primary [text-wrap:balance]">
          {card.title}
        </h3>
        {card.summary && <p className="m-0 mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-grey-300">{card.summary}</p>}
      </div>
    </Link>
  );
}

function Window({ items, shown, className, render }) {
  return (
    <div className={className}>
      {items.map((card, i) => (
        <div key={card.id ?? card.href} className={i < shown ? "contents" : "hidden"}>
          {render(card, i)}
        </div>
      ))}
    </div>
  );
}

export function BlogListClient({
  cards,
  chips,
  layout = "compact",
  initialCount = 9,
  step = 9,
  showFilters = true,
  loadMoreLabel = "Load more",
  readLabel = "Read article",
}) {
  const [active, setActive] = useState(null);
  const [shown, setShown] = useState(initialCount);

  const filtered = useMemo(
    () => (active ? cards.filter((c) => c.category?.slug === active) : cards),
    [active, cards]
  );

  const select = (slug) => {
    setActive(slug);
    setShown(initialCount);
  };

  if (cards.length === 0) {
    return (
      <p className="text-[15.5px] text-fg-muted">
        Nothing published yet. Check back shortly.
      </p>
    );
  }

  const magazine = layout === "magazine";
  const featured = filtered.find((c) => c.imageUrl) ?? filtered[0];
  const rest = filtered.filter((c) => c !== featured);
  const pool = magazine ? rest : filtered;
  const remaining = Math.max(0, pool.length - shown);

  return (
    <>
      {showFilters && chips.length > 1 && (
        <div className="flex flex-wrap gap-1">
          <Chip active={active === null} onClick={() => select(null)} count={cards.length}>
            All
          </Chip>
          {chips.map((c) => (
            <Chip key={c.slug} active={active === c.slug} onClick={() => select(c.slug)} count={c.count}>
              {c.name}
            </Chip>
          ))}
        </div>
      )}

      {magazine ? (
        <>
          {featured && (
            <div className="mt-5">
              <FeaturedCard card={featured} readLabel={readLabel} />
            </div>
          )}
          <Window
            items={rest}
            shown={shown}
            className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            render={(card) => <GridCard card={card} />}
          />
        </>
      ) : (
        <Window
          items={filtered}
          shown={shown}
          className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3"
          render={(card, i) => <CompactCard card={card} priority={i < 3} />}
        />
      )}

      {remaining > 0 && (
        <div className="mt-[clamp(32px,4vw,52px)] flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShown((n) => n + step)}
            className="inline-flex h-10 items-center rounded-md border border-grey-700 px-5 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
          >
            {loadMoreLabel}
          </button>
          <p className="m-0 text-[12.5px] text-fg-muted">
            {Math.min(shown, pool.length)} of {pool.length}
          </p>
        </div>
      )}
    </>
  );
}
