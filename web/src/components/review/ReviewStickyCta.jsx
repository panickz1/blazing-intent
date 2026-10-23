"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import CasinoLogo from "@/components/casino/CasinoLogo";
import { cn } from "@/lib/utils";

export default function ReviewStickyCta({ casino, title, subtitle, label, targetId = "review-offer-cta" }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-grey-800 bg-grey-950/95 px-4 py-2.5 backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden",
        shown ? "translate-y-0" : "translate-y-full"
      )}
    >
      <CasinoLogo casino={casino} className="size-10 shrink-0 rounded-[10px] px-1 [&_span]:text-[8px]" />
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-[14px] font-black text-accent-2">{title}</p>
        {subtitle && <p className="m-0 truncate text-[11px] text-grey-400">{subtitle}</p>}
      </div>
      <a
        href={casino.visitHref}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="flex h-11 items-center gap-1.5 rounded-xl bg-primary px-5 font-heading text-[15px] font-black text-primary-foreground"
      >
        {label}
        <ArrowRight className="size-4" aria-hidden />
      </a>
    </div>
  );
}
