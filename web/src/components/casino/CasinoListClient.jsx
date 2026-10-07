"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";
import CasinoCard from "./CasinoCard";

const SORTS = [
  { key: "recommended", sort: (list) => list },
  { key: "new", sort: (list) => [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) },
  { key: "bonus", sort: (list) => [...list].sort((a, b) => b.bonusValue - a.bonusValue) },
];

export default function CasinoListClient({ casinos, topBadge, licensedLabel, showSort, initialCount }) {
  const [sortKey, setSortKey] = useState("recommended");
  const [expanded, setExpanded] = useState(false);
  const visible = !expanded && Number(initialCount) > 0 ? Number(initialCount) : casinos.length;
  const { affiliate } = site;
  const topId = casinos[0]?.id;

  const ordered = useMemo(() => SORTS.find((s) => s.key === sortKey).sort(casinos), [casinos, sortKey]);

  return (
    <div className="flex flex-col gap-3">
      {(licensedLabel || showSort) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {licensedLabel ? (
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-grey-200">
              <Check className="size-4 text-primary" strokeWidth={3} aria-hidden />
              {licensedLabel}
            </span>
          ) : (
            <span />
          )}
          {showSort && (
            <div role="group" aria-label={affiliate.sortLabel} className="flex items-center gap-1">
              <span className="mr-1 hidden text-[13px] text-fg-muted sm:inline">{affiliate.sortLabel}</span>
              {SORTS.map(({ key }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={sortKey === key}
                  onClick={() => setSortKey(key)}
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[13px] font-medium transition-colors",
                    sortKey === key ? "border-grey-600 bg-grey-800 text-white" : "border-transparent text-grey-300 hover:text-white"
                  )}
                >
                  {affiliate.sortOptions[key]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {ordered.map((casino, i) => (
          <li key={casino.id} hidden={i >= visible}>
            <CasinoCard casino={casino} badge={topBadge && sortKey === "recommended" && casino.id === topId ? topBadge : null} />
          </li>
        ))}
      </ol>

      {visible < casinos.length && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mx-auto mt-1 flex h-10 items-center rounded-md border border-grey-700 px-5 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
        >
          {affiliate.showAllLabel.replace("{count}", casinos.length)}
        </button>
      )}
    </div>
  );
}
