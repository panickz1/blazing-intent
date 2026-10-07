import Link from "next/link";
import CasinoLogo from "./CasinoLogo";
import Rating from "./Rating";
import { BonusCell, ReviewButton, VisitButton } from "./parts";

const monthYear = (iso) => (iso ? new Date(iso).toLocaleDateString("en", { month: "long", year: "numeric", timeZone: "UTC" }) : null);

export default function CasinoCompactCard({ casino, showLaunched }) {
  const launched = showLaunched ? monthYear(casino.launched) : null;

  return (
    <article className="flex h-full flex-col rounded-xl border border-grey-800 bg-grey-900 p-4">
      <div className="flex items-center gap-3">
        <Link href={casino.reviewHref} aria-label={`${casino.name} review`} className="shrink-0">
          <CasinoLogo casino={casino} className="h-14 w-20 [&>span]:text-[13px]" />
        </Link>
        <div className="min-w-0">
          <h3 className="m-0 truncate font-heading text-[16px] font-bold text-white">
            <Link href={casino.reviewHref} className="hover:underline">
              {casino.name}
            </Link>
          </h3>
          <Rating value={casino.rating} size="sm" className="mt-1" />
          {launched && <p className="m-0 mt-1 text-[12px] text-fg-muted">Launched {launched}</p>}
        </div>
      </div>
      {casino.summary && <p className="m-0 mt-3 line-clamp-3 flex-1 text-[14px] leading-relaxed text-grey-200">{casino.summary}</p>}
      <BonusCell casino={casino} className="mt-3" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <VisitButton casino={casino} />
        <ReviewButton casino={casino} />
      </div>
      <p className="m-0 mt-2 text-[12px] text-grey-400">{casino.terms}</p>
    </article>
  );
}
