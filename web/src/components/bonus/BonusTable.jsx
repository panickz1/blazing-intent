import Link from "next/link";
import CasinoLogo from "@/components/casino/CasinoLogo";
import { site } from "@/site.config";
import BonusDetails from "./BonusDetails";
import BonusTableClient from "./BonusTableClient";

const SPONSORED = "nofollow sponsored noopener";

function Fact({ label, value }) {
  return (
    <div className="min-w-0">
      <span className="block text-[11px] text-fg-muted lg:sr-only">{label}</span>
      <span className="block truncate text-[14px] font-semibold text-grey-100">{value}</span>
    </div>
  );
}

function BonusRow({ bonus }) {
  const { casino } = bonus;
  const l = site.bonuses;
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-3 gap-y-3 lg:grid-cols-[96px_minmax(0,1fr)_110px_110px_170px] lg:gap-x-4">
      <Link href={casino.reviewHref} aria-label={`${casino.name} ${site.affiliate.reviewLabel.toLowerCase()}`}>
        <CasinoLogo casino={casino} className="h-[52px] lg:h-[60px]" />
      </Link>
      <div className="min-w-0 pr-12 lg:pr-0">
        <p className="m-0 truncate font-heading text-[16px] font-bold text-white">
          <Link href={casino.reviewHref} className="hover:underline">
            {casino.name}
          </Link>
        </p>
        <p className="m-0 mt-0.5 truncate text-[13px] text-grey-200" title={bonus.description || bonus.name}>
          {bonus.description || bonus.name}
        </p>
        {bonus.types.length > 0 && (
          <ul className="m-0 mt-1.5 flex list-none flex-wrap gap-1 p-0">
            {bonus.types.map((t) => (
              <li key={t.id}>
                {t.href ? (
                  <Link href={t.href} className="rounded border border-grey-700 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-grey-300 hover:border-grey-500 hover:text-white">
                    {t.name}
                  </Link>
                ) : (
                  <span className="rounded border border-grey-700 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-grey-300">{t.name}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-span-2 grid grid-cols-2 items-center gap-3 lg:contents">
        <Fact label={l.columns.wagering} value={bonus.wagering || l.none} />
        <Fact label={l.columns.deposit} value={bonus.minDeposit || l.none} />
        <a
          href={casino.visitHref}
          target="_blank"
          rel={SPONSORED}
          className="col-span-2 flex h-11 min-w-0 items-center justify-center rounded-md border border-dashed lg:col-span-1 border-accent-2/60 bg-accent-2/[0.06] px-3 font-heading text-[18px] font-black text-accent-2 transition-colors hover:bg-accent-2/15"
        >
          <span className="truncate">{bonus.headline || site.affiliate.claimLabel}</span>
          <span className="sr-only"> at {casino.name}</span>
        </a>
      </div>
    </div>
  );
}

export default function BonusTable({ bonuses, showSearch = true, searchPlaceholder, initialCount }) {
  const rows = bonuses.map((bonus) => ({
    id: bonus.id,
    search: [bonus.casino.name, bonus.name, bonus.description, ...bonus.types.map((t) => t.name)].filter(Boolean).join(" ").toLowerCase(),
    row: <BonusRow bonus={bonus} />,
    details: <BonusDetails bonus={bonus} casino={bonus.casino} />,
  }));
  return <BonusTableClient rows={rows} showSearch={showSearch} searchPlaceholder={searchPlaceholder} initialCount={initialCount} />;
}
