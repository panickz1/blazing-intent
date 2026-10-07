"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

export default function BonusTableClient({ rows, showSearch, searchPlaceholder, initialCount }) {
  const l = site.bonuses;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set());
  const [expanded, setExpanded] = useState(false);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => new Set(rows.filter((r) => !q || r.search.includes(q)).map((r) => r.id)), [rows, q]);
  const limit = !expanded && !q && Number(initialCount) > 0 ? Number(initialCount) : rows.length;

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  let shown = 0;

  return (
    <div className="flex flex-col gap-3">
      {showSearch && rows.length > 4 && (
        <label className="flex h-11 max-w-sm items-center gap-2 rounded-md border border-grey-700 bg-grey-900 px-3 text-grey-300 focus-within:border-grey-500">
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="sr-only">{l.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder || l.searchPlaceholder}
            className="h-full w-full bg-transparent text-[14px] text-white outline-none placeholder:text-grey-400"
          />
        </label>
      )}

      <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px_170px_44px] items-center gap-4 rounded-lg bg-grey-900 px-4 py-2.5 text-[12px] font-semibold text-fg-muted lg:grid">
        <span>{l.columns.casino}</span>
        <span>{l.columns.wagering}</span>
        <span>{l.columns.deposit}</span>
        <span>{l.columns.bonus}</span>
        <span className="sr-only">{l.detailsLabel}</span>
      </div>

      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {rows.map((r) => {
          const visible = matches.has(r.id) && shown++ < limit;
          const isOpen = open.has(r.id);
          return (
            <li key={r.id} hidden={!visible} className="rounded-xl border border-grey-800 bg-grey-900">
              <div className="relative p-3 lg:px-4">
                <div className="lg:pr-[60px]">{r.row}</div>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`bonus-${r.id}`}
                  onClick={() => toggle(r.id)}
                  className="absolute right-3 top-3 grid size-10 place-items-center rounded-md border border-grey-700 text-grey-200 transition-colors hover:border-grey-500 hover:text-white lg:right-4 lg:top-1/2 lg:-translate-y-1/2"
                >
                  <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
                  <span className="sr-only">{l.detailsLabel}</span>
                </button>
              </div>
              <div id={`bonus-${r.id}`} hidden={!isOpen} className="border-t border-grey-800 p-3 lg:p-4">
                {r.details}
              </div>
            </li>
          );
        })}
      </ol>

      {matches.size === 0 && <p className="m-0 py-6 text-center text-[14px] text-fg-muted">{l.empty}</p>}

      {!q && limit < rows.length && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mx-auto mt-1 flex h-10 items-center rounded-md border border-grey-700 px-5 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
        >
          {l.showAllLabel.replace("{count}", rows.length)}
        </button>
      )}
    </div>
  );
}
