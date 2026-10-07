"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

function Card({ card, priority }) {
  const src = card.imageUrl;

  return (
    <Link
      href={card.href}
      className={cn("group flex h-full flex-col", !src && "rounded-xl border border-grey-800 bg-grey-900 p-5 transition-colors hover:border-grey-600")}
    >
      {src && (
        <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-grey-800 bg-grey-900">
          <Image
            src={src}
            alt={card.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-[12.5px] text-fg-muted">
          {card.category && <span className="font-semibold text-primary">{card.category.name}</span>}
          {card.date && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={card.date}>{formatDate(card.date)}</time>
            </>
          )}
        </div>

        <h3 className="m-0 mt-2 font-heading text-[18px] font-bold leading-snug text-white transition-colors group-hover:text-primary [text-wrap:balance]">
          {card.title}
        </h3>

        {card.summary && <p className="m-0 mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-grey-200">{card.summary}</p>}
      </div>
    </Link>
  );
}

export function BlogListClient({ cards, chips, initialCount = 9, step = 9, showFilters = true, loadMoreLabel = "Load more" }) {
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

  const remaining = Math.max(0, filtered.length - shown);

  if (cards.length === 0) {
    return (
      <p className="text-[15.5px] text-fg-muted">
        Nothing published yet. Check back shortly.
      </p>
    );
  }

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

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((card, i) => (
          <div key={card.id ?? card.href} className={i < shown ? "contents" : "hidden"}>
            <Card card={card} priority={i < 3} />
          </div>
        ))}
      </div>

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
            {Math.min(shown, filtered.length)} of {filtered.length}
          </p>
        </div>
      )}
    </>
  );
}
