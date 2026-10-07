"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const SHOW_AFTER = 120;
const GIVE_UP_AFTER = 10000;
const REPREFETCH_AFTER = 30000;

function internalUrl(target) {
  const anchor = target?.closest?.("a[href]");
  if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return null;
  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return null;
    if (url.pathname.replace(/\/$/, "") === "/apply") return null;
    return url;
  } catch {
    return null;
  }
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState("idle");
  const pending = useRef(false);
  const timers = useRef({});

  const clearTimers = () => {
    clearTimeout(timers.current.show);
    clearTimeout(timers.current.giveUp);
  };

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    clearTimers();
    setPhase((p) => (p === "loading" ? "done" : "idle"));
  }, [pathname]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setPhase("idle"), 400);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    const prefetchedAt = new Map();

    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!internalUrl(e.target)) return;
      pending.current = true;
      clearTimers();
      timers.current.show = setTimeout(() => setPhase("loading"), SHOW_AFTER);
      timers.current.giveUp = setTimeout(() => {
        pending.current = false;
        setPhase("idle");
      }, GIVE_UP_AFTER);
    };

    const onIntent = (e) => {
      const url = internalUrl(e.target);
      if (!url) return;
      const href = url.pathname + url.search;
      const last = prefetchedAt.get(href);
      if (last && Date.now() - last < REPREFETCH_AFTER) return;
      prefetchedAt.set(href, Date.now());
      router.prefetch(href);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
    document.addEventListener("touchstart", onIntent, { passive: true });
    return () => {
      clearTimers();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onIntent);
      document.removeEventListener("focusin", onIntent);
      document.removeEventListener("touchstart", onIntent);
    };
  }, [router]);

  const style = {
    loading: { transform: "scaleX(0.85)", opacity: 1, transition: "transform 8s cubic-bezier(0.1, 0.7, 0.2, 1), opacity 150ms" },
    done: { transform: "scaleX(1)", opacity: 0, transition: "transform 200ms ease-out, opacity 250ms ease 150ms" },
    idle: { transform: "scaleX(0)", opacity: 0, transition: "none" },
  }[phase];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
      <div
        className="h-full w-full origin-left bg-primary shadow-[0_0_10px] shadow-primary/60"
        style={style}
      />
    </div>
  );
}
