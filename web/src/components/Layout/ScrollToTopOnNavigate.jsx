"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const fromHistory = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && document.getElementById(hash)) return;

    const scroller = document.querySelector("[data-scroll-root]");
    const reset = () => (scroller ? scroller.scrollTo({ top: 0, behavior: "instant" }) : window.scrollTo(0, 0));
    reset();
    const raf = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
