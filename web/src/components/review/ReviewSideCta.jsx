import CasinoLogo from "@/components/casino/CasinoLogo";
import { site } from "@/site.config";

export default function ReviewSideCta({ card, bonus }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-grey-800 bg-grey-900 p-3.5">
      <CasinoLogo casino={card} className="size-11 shrink-0 rounded-xl px-1 [&_span]:text-[9px]" />
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate font-heading text-[15px] font-black text-accent-2">{bonus?.headline || card.name}</p>
        <p className="m-0 truncate text-[11px] text-grey-400">{card.terms}</p>
      </div>
      <a
        href={card.visitHref}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="flex h-10 shrink-0 items-center rounded-xl bg-primary px-4 font-heading text-[14px] font-black text-primary-foreground transition-opacity hover:opacity-90"
      >
        {bonus ? site.affiliate.claimLabel : site.affiliate.visitLabel}
      </a>
    </div>
  );
}
