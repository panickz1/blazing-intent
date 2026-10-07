"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn, toParagraphs } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { HelpIcon } from "./icons";

function Chevron({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Arrow({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function StatusTag({ status }) {
  if (status !== "partial" && status !== "pending") return null;
  const pending = status === "pending";
  return (
    <span
      className={cn(
        "inline-flex h-[18px] shrink-0 items-center rounded-[5px] px-[7px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.09em]",
        pending ? "bg-warning/[0.12] text-warning" : "bg-white/[0.07] text-grey-300"
      )}
    >
      {pending ? "Pending" : "Draft"}
    </span>
  );
}

const slugOf = (row) => row.slug || row.question.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function HelpCenterClient({ categories }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug);
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fromHash = () => {
      const raw = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!raw) return;
      const [cat, question] = raw.split("/");
      if (!categories.some((c) => c.slug === cat)) return;
      setActiveSlug(cat);
      setQuery("");
      setOpen(question || null);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [categories]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const active = categories.find((c) => c.slug === activeSlug) ?? categories[0];

  const term = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return null;
    const seen = new Set();
    const hits = [];
    for (const c of categories) {
      for (const row of c.articles) {
        const key = `${c.slug}/${slugOf(row)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (`${row.question} ${row.answer ?? ""}`.toLowerCase().includes(term)) hits.push(row);
      }
    }
    return hits;
  }, [term, categories]);

  if (!active) return null;

  const select = (slug) => {
    setActiveSlug(slug);
    setOpen(null);
    setQuery("");
    if (typeof window !== "undefined") window.history.replaceState(null, "", `#${slug}`);
  };

  const toggle = (row) => {
    const slug = slugOf(row);
    const next = open === slug ? null : slug;
    setOpen(next);
    if (typeof window !== "undefined" && !term) {
      window.history.replaceState(null, "", next ? `#${active.slug}/${next}` : `#${active.slug}`);
    }
  };

  const rows = results ?? active.articles;

  return (
    <>
      <label className="group mb-[clamp(20px,2.4vw,28px)] flex items-center gap-3 rounded-2xl border border-grey-800 bg-grey-900 px-[18px] py-[13px] transition-colors focus-within:border-primary/50 focus-within:bg-white/[0.07]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             className="size-4 shrink-0 text-grey-300" aria-hidden>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for answers…"
          aria-label="Search help"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[15.5px] font-medium text-white outline-none placeholder:text-grey-300 [&::-webkit-search-cancel-button]:appearance-none"
        />
        <kbd className="hidden shrink-0 rounded-[5px] border border-grey-800 bg-white/[0.05] px-[7px] py-0.5 font-mono text-[11px] text-grey-300 group-focus-within:invisible sm:block">
          /
        </kbd>
      </label>

      <Drawer open={pickerOpen} onOpenChange={setPickerOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-2xl border border-grey-800 bg-grey-900 px-[18px] py-[13px] text-left transition-opacity sm:hidden",
              term && "pointer-events-none opacity-40"
            )}
          >
            <HelpIcon name={active.icon} className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-[15.5px] font-semibold text-white">{active.name}</span>
            <Chevron className="size-4 shrink-0 text-grey-300" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="px-5 pb-[max(24px,env(safe-area-inset-bottom))] sm:hidden">
          <DrawerTitle className="m-0 -mt-3 mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.09em] text-grey-300">
            Help topics
          </DrawerTitle>
          <div className="flex flex-col gap-2">
            {categories.map((c) => {
              const on = c.slug === active.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-current={on || undefined}
                  onClick={() => {
                    select(c.slug);
                    setPickerOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                    on ? "border-primary/45 bg-primary-200" : "border-grey-800 bg-grey-900"
                  )}
                >
                  <HelpIcon name={c.icon} className={cn("size-4 shrink-0", on ? "text-primary" : "text-grey-300")} />
                  <span className={cn("text-[15.5px] font-semibold", on ? "text-white" : "text-grey-200")}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>

      <div
        role="tablist"
        aria-label="Help topics"
        className={cn("hidden flex-wrap gap-2 transition-opacity sm:flex", term && "pointer-events-none opacity-40")}
      >
        {categories.map((c) => {
          const on = c.slug === active.slug && !term;
          return (
            <button
              key={c.slug}
              role="tab"
              aria-selected={on}
              onClick={() => select(c.slug)}
              className={cn(
                "inline-flex items-center gap-2.5 rounded-full border py-2.5 pl-3.5 pr-4 transition-colors",
                on ? "border-primary/45 bg-primary-200" : "border-grey-800 bg-grey-900 hover:border-grey-700"
              )}
            >
              <HelpIcon name={c.icon} className={cn("size-4 shrink-0", on ? "text-primary" : "text-grey-300")} />
              <span className={cn("text-[14.5px] font-semibold", on ? "text-white" : "text-grey-200")}>
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p className="mt-10 text-[15.5px] text-grey-300">
          No answers matched that. Try a different word, or email us below.
        </p>
      )}

      <div className="mt-[clamp(30px,3.6vw,46px)] flex flex-col border-t border-grey-800">
        {rows.map((row, i) => {
          const slug = slugOf(row);

          if (row.type === "article" && row.href) {
            return (
              <div key={row.id ?? i} className="group border-b border-grey-800">
                <Link
                  href={row.href}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="min-w-0 flex-1 font-heading text-[clamp(16px,1.7vw,19px)] font-bold tracking-[-0.01em] text-white transition-colors group-hover:text-primary">
                    {row.question}
                  </span>
                  <StatusTag status={row.status} />
                  {row.sub && (
                    <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.09em] text-grey-300 sm:block">
                      {row.sub}
                    </span>
                  )}
                  {term && row.category && (
                    <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.09em] text-grey-400 sm:block">
                      {row.category}
                    </span>
                  )}
                  <Arrow className="size-4 shrink-0 text-grey-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </div>
            );
          }

          const isOpen = open === slug;
          const id = `help-${active.slug}-${slug}`;
          return (
            <div key={row.id ?? i} className="border-b border-grey-800">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => toggle(row)}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <span
                  className={cn(
                    "min-w-0 flex-1 font-heading text-[clamp(16px,1.7vw,19px)] font-bold tracking-[-0.01em] transition-colors",
                    isOpen ? "text-primary" : "text-white"
                  )}
                >
                  {row.question}
                </span>
                <StatusTag status={row.status} />
                {term && row.category && (
                  <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.09em] text-grey-400 sm:block">
                    {row.category}
                  </span>
                )}
                <Chevron
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    isOpen ? "rotate-180 text-primary" : "text-grey-300"
                  )}
                />
              </button>

              <div
                id={id}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex max-w-[62ch] flex-col gap-3 pb-6 pr-11 text-[16px] leading-[1.62] text-fg-muted [text-wrap:pretty]">
                    {toParagraphs(row.answer).map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                  {row.more && (
                    <Link
                      href={row.more}
                      className="group/more -mt-1 inline-flex items-center gap-1.5 pb-6 text-[14px] font-semibold text-primary hover:underline"
                    >
                      {row.linkLabel?.trim() || "Learn more"}
                      <Arrow className="size-4 transition-transform group-hover/more:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
