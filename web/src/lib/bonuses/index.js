import { cacheLife, cacheTag } from "next/cache";
import { readItems } from "@directus/sdk";
import apiClient from "@/helpers/functions/apiClient";
import fetchWithCache from "@/helpers/functions/fetchWithCache";
import { getCasinoCards, toBonus } from "@/lib/casinos";

const FIELDS = [
  "id", "sort", "casino", "name", "headline", "amount", "description", "terms", "wagering", "minDeposit",
  "code", "freeSpins", "maxWin", "minOdds", "validUntil", "howToClaim", "info",
  "bonusTypes.bonusTypes_id.id", "bonusTypes.bonusTypes_id.name", "bonusTypes.bonusTypes_id.slug",
];

async function getAllBonuses() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("casinos", "bonuses");
  return fetchWithCache(
    "bonuses:all",
    () =>
      apiClient().request(
        readItems("bonuses", {
          fields: FIELDS,
          filter: { status: { _eq: "published" }, _or: [{ validUntil: { _null: true } }, { validUntil: { _gte: "$NOW" } }] },
          sort: ["sort", "id"],
          limit: -1,
        })
      ),
    { fallback: [] }
  );
}

export async function getBonusRows({ type, sortBy, limit } = {}) {
  const [bonuses, casinos] = await Promise.all([getAllBonuses(), getCasinoCards()]);
  const typeId = type?.id ?? type;
  const rank = new Map(casinos.map((c, i) => [c.id, i]));
  const byId = new Map(casinos.map((c) => [c.id, c]));

  const rows = bonuses
    .filter((b) => byId.has(b.casino))
    .filter((b) => !typeId || (b.bonusTypes ?? []).some((t) => t?.bonusTypes_id?.id === typeId))
    .map((b) => ({ ...toBonus(b), sort: b.sort ?? 0, casino: byId.get(b.casino) }));

  const ordered =
    sortBy === "amount"
      ? rows.sort((a, b) => b.amount - a.amount)
      : rows.sort((a, b) => rank.get(a.casino.id) - rank.get(b.casino.id) || a.sort - b.sort);

  return Number(limit) > 0 ? ordered.slice(0, Number(limit)) : ordered;
}
