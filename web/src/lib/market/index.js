import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import { getCasinoCards } from "@/lib/casinos";

async function getMarketStats() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  cacheTag("marketStats", "casinos");
  return fetchWithCache(
    "marketStats:all",
    () => apiClient().request(readItems("marketStats", { fields: ["month", "value", "casino.id"], sort: ["-month"], limit: -1 })),
    { fallback: [] }
  );
}

const monthKey = (iso) => String(iso).slice(0, 7);

export async function getMarketRanking(limit = 10) {
  const [stats, casinos] = await Promise.all([getMarketStats(), getCasinoCards()]);
  const months = [...new Set(stats.map((s) => monthKey(s.month)))].sort().reverse();
  if (months.length === 0) return null;

  const [current, previous] = months;
  const valueFor = (month, casinoId) =>
    stats.find((s) => monthKey(s.month) === month && (s.casino?.id ?? s.casino) === casinoId)?.value ?? null;
  const byId = new Map(casinos.map((c) => [c.id, c]));

  const rows = stats
    .filter((s) => monthKey(s.month) === current && byId.has(s.casino?.id ?? s.casino))
    .map((s) => {
      const casino = byId.get(s.casino?.id ?? s.casino);
      const before = previous ? valueFor(previous, casino.id) : null;
      return {
        casino,
        value: s.value,
        change: before ? ((s.value - before) / before) * 100 : null,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  const label = new Date(`${current}-01T00:00:00Z`).toLocaleDateString("en", { month: "long", year: "numeric", timeZone: "UTC" });
  return { month: label, rows };
}
