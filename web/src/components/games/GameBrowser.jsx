"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";
import GameCard from "./GameCard";

const SORTS = {
  newest: (list) => list,
  rtp: (list) => [...list].sort((a, b) => (b.rtp ?? 0) - (a.rtp ?? 0)),
  maxWin: (list) => [...list].sort((a, b) => (b.maxWin ?? 0) - (a.maxWin ?? 0)),
  name: (list) => [...list].sort((a, b) => a.name.localeCompare(b.name)),
};

const pill = (active) =>
  cn(
    "flex h-9 items-center rounded-md border px-3 text-[13px] font-medium transition-colors",
    active ? "border-grey-600 bg-grey-800 text-white" : "border-grey-800 text-grey-300 hover:text-white"
  );

const control = "h-9 rounded-md border border-grey-700 bg-grey-950 px-2.5 text-[13px] font-medium text-white";

const options = (games, id, name) =>
  [...new Map(games.filter((g) => g[id] != null).map((g) => [g[id], g[name]])).entries()].sort((a, b) => String(a[1]).localeCompare(String(b[1])));

function Select({ label, value, onChange, all, items }) {
  return (
    <label className="flex items-center">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={control}>
        <option value="">{all}</option>
        {items.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function GameBrowser({ games, initialCount = site.games.initialCount, filters = true, sortBy = "newest" }) {
  const labels = site.games;
  const [query, setQuery] = useState("");
  const [volatility, setVolatility] = useState("");
  const [type, setType] = useState("");
  const [provider, setProvider] = useState("");
  const [bonusBuy, setBonusBuy] = useState(false);
  const [sortKey, setSortKey] = useState(SORTS[sortBy] ? sortBy : "newest");
  const [limit, setLimit] = useState(Number(initialCount) || games.length);

  const types = useMemo(() => options(games, "typeId", "type"), [games]);
  const providers = useMemo(() => options(games, "providerId", "provider"), [games]);
  const volatilities = Object.keys(labels.volatility).filter((v) => games.some((g) => g.volatility === v));
  const hasBonusBuy = games.some((g) => g.bonusBuy) && games.some((g) => !g.bonusBuy);

  const { ordered, matches } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const isMatch = (g) =>
      (!q || g.name.toLowerCase().includes(q)) &&
      (!volatility || g.volatility === volatility) &&
      (!type || String(g.typeId) === type) &&
      (!provider || String(g.providerId) === provider) &&
      (!bonusBuy || g.bonusBuy);
    const sorted = SORTS[sortKey](games);
    const hits = sorted.filter(isMatch);
    return { ordered: [...hits, ...sorted.filter((g) => !isMatch(g))], matches: hits.length };
  }, [games, query, volatility, type, provider, bonusBuy, sortKey]);

  return (
    <div className="flex flex-col gap-4">
      {filters && (
        <div className="flex flex-col gap-3 rounded-2xl border border-grey-800 bg-grey-900 p-3 lg:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block flex-1">
              <span className="sr-only">{labels.searchPlaceholder}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="h-10 w-full rounded-md border border-grey-700 bg-grey-950 pl-9 pr-3 text-[14px] text-white placeholder:text-fg-muted focus-visible:border-primary/60 focus-visible:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-[13px] text-fg-muted">
              {labels.sortLabel}
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className={control}>
                {Object.entries(labels.sortOptions).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {types.length > 1 && <Select label={labels.typeLabel} value={type} onChange={setType} all={labels.allTypes} items={types} />}
            {providers.length > 1 && (
              <Select label={labels.providerLabel} value={provider} onChange={setProvider} all={labels.allProviders} items={providers} />
            )}
            {volatilities.length > 1 && (
              <div role="group" aria-label={labels.stats.volatility} className="flex flex-wrap items-center gap-1">
                {["", ...volatilities].map((v) => (
                  <button key={v || "all"} type="button" aria-pressed={volatility === v} onClick={() => setVolatility(v)} className={pill(volatility === v)}>
                    {v ? labels.volatility[v] : `${labels.stats.volatility}: ${labels.allVolatility}`}
                  </button>
                ))}
              </div>
            )}
            {hasBonusBuy && (
              <button type="button" aria-pressed={bonusBuy} onClick={() => setBonusBuy((b) => !b)} className={pill(bonusBuy)}>
                {labels.bonusBuyFilter}
              </button>
            )}
            <span className="ml-auto text-[13px] text-fg-muted" aria-live="polite">
              {labels.resultsLabel.replace("{count}", matches)}
            </span>
          </div>
        </div>
      )}

      {matches === 0 && <p className="m-0 rounded-xl border border-grey-800 bg-grey-900 p-6 text-[15px] text-fg-muted">{labels.empty}</p>}

      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {ordered.map((game, i) => (
          <li key={game.id} hidden={i >= Math.min(matches, limit)}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>

      {matches > limit && (
        <button
          type="button"
          onClick={() => setLimit((n) => n + Number(initialCount || 24) * 2)}
          className="mx-auto mt-1 flex h-10 items-center rounded-md border border-grey-700 px-5 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
        >
          {labels.showMoreLabel}
        </button>
      )}
    </div>
  );
}
