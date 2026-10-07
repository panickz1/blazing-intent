import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { num, pick } from "@/lib/cms";
import { getMarketRanking } from "@/lib/market";
import { SectionHeader } from "@/components/ui/section-header";
import CasinoLogo from "@/components/casino/CasinoLogo";

function Change({ value }) {
  if (value === null || !Number.isFinite(value)) return <span className="text-fg-muted">New</span>;
  const up = value >= 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span className={cn("inline-flex items-center gap-1 tabular-nums", up ? "text-primary" : "text-destructive")}>
      <Icon className="size-3.5" aria-hidden />
      {Math.abs(value).toFixed(1)}%
      <span className="sr-only">{up ? "up" : "down"}</span>
    </span>
  );
}

export default async function MarketRanking({ eyebrow, title, lead, metricLabel, limit, footnote }) {
  const ranking = await getMarketRanking(num(limit, 10));
  if (!ranking || ranking.rows.length === 0) return null;
  const metric = pick(metricLabel, "Searches");

  return (
    <section className="py-14 lg:py-20">
      <div className="landing-container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className="mt-8 max-w-[860px] overflow-x-auto rounded-xl border border-grey-800">
          <table className="w-full min-w-[520px] border-collapse text-left text-[14px] text-grey-100">
            <caption className="sr-only">
              {metric}, {ranking.month}
            </caption>
            <thead className="bg-grey-900">
              <tr>
                <th scope="col" className="w-14 px-4 py-3 text-[12px] font-semibold text-fg-muted">#</th>
                <th scope="col" className="px-4 py-3 text-[12px] font-semibold text-fg-muted">Casino</th>
                <th scope="col" className="px-4 py-3 text-right text-[12px] font-semibold text-fg-muted">
                  {metric}, {ranking.month}
                </th>
                <th scope="col" className="px-4 py-3 text-right text-[12px] font-semibold text-fg-muted">vs previous month</th>
              </tr>
            </thead>
            <tbody>
              {ranking.rows.map((row, i) => (
                <tr key={row.casino.id} className="border-t border-grey-800">
                  <td className="px-4 py-2.5 tabular-nums text-fg-muted">{i + 1}</td>
                  <th scope="row" className="px-4 py-2.5 font-normal">
                    <span className="flex items-center gap-3">
                      <CasinoLogo casino={row.casino} className="h-8 w-12 shrink-0 px-1 [&>span]:text-[9px]" />
                      <Link href={row.casino.reviewHref} className="font-semibold text-white hover:underline">
                        {row.casino.name}
                      </Link>
                    </span>
                  </th>
                  <td className="px-4 py-2.5 text-right tabular-nums">{row.value.toLocaleString("en")}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Change value={row.change} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footnote && <p className="m-0 mt-3 max-w-[860px] text-[12px] text-grey-400">{footnote}</p>}
      </div>
    </section>
  );
}
