import Image from "next/image";
import Link from "next/link";
import { RtpBadge, VolatilityMeter } from "./GameBadges";

export default function GameCard({ game }) {
  return (
    <Link
      href={game.href}
      title={game.name}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-grey-800 bg-grey-900 transition-colors hover:border-primary/50"
    >
      <span className="relative block aspect-[325/234] overflow-hidden bg-grey-950">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail.src}
            alt={game.name}
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="grid size-full place-items-center p-3 text-center font-heading text-[15px] font-black text-grey-300">{game.name}</span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-1.5 p-3">
        <span className="line-clamp-2 font-heading text-[14.5px] font-bold leading-snug text-white">{game.name}</span>
        {game.provider && <span className="text-[12px] text-fg-muted">{game.provider}</span>}
        {(game.rtp != null || game.volatility) && (
          <span className="mt-auto flex items-center justify-between gap-2 pt-1.5">
            <RtpBadge rtp={game.rtp} />
            <VolatilityMeter volatility={game.volatility} />
          </span>
        )}
      </span>
    </Link>
  );
}
