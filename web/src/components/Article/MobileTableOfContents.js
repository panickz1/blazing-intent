"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollViewport } from "@/components/ui/scroll-area";

const NAV_FALLBACK = 73;
const HEADING_AIR = 16;

export default function MobileTableOfContents({ headings = [], contentSelector = ".article-prose" }) {
  const [activeId, setActiveId] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [navHeight, setNavHeight] = useState(NAV_FALLBACK);
  const [revealed, setRevealed] = useState(false);

  const trackRef = useRef(null);
  const stripRef = useRef(null);
  const itemRefs = useRef({});
  const suppressObserver = useRef(false);
  const releaseTimer = useRef(null);
  const viewport = useScrollViewport();

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserver.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    const bar = document.querySelector("nav.sticky");
    if (!bar) return;
    const measure = () => setNavHeight(bar.offsetHeight || NAV_FALLBACK);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = viewport || (typeof document !== "undefined" && document.querySelector("[data-scroll-root]"));
    const scroller = el || window;

    let ticking = false;

    const update = () => {
      const prose = document.querySelector(contentSelector);
      const top = prose ? prose.getBoundingClientRect().top : Infinity;
      setRevealed(top <= navHeight + 8);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [viewport, contentSelector, navHeight]);

  useEffect(() => {
    const el = itemRefs.current[activeId];
    const track = trackRef.current;
    if (!el || !track) return;

    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });

    const target = el.offsetLeft - track.clientWidth / 2 + el.offsetWidth / 2;
    track.scrollTo({ left: target, behavior: "smooth" });
  }, [activeId, headings]);

  useEffect(() => () => clearTimeout(releaseTimer.current), []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const target = viewport || document.querySelector("[data-radix-scroll-area-viewport]");
    const scroller = target || window;

    suppressObserver.current = true;
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);

    const release = () => {
      scroller.removeEventListener("scrollend", release);
      clearTimeout(releaseTimer.current);
      suppressObserver.current = false;
    };
    scroller.addEventListener("scrollend", release, { once: true });
    clearTimeout(releaseTimer.current);
    releaseTimer.current = setTimeout(release, 1000);

    const offset = navHeight + (stripRef.current?.offsetHeight ?? 0) + HEADING_AIR;
    if (target) {
      const top = el.getBoundingClientRect().top - target.getBoundingClientRect().top + target.scrollTop - offset;
      target.scrollTo({ top, behavior: "smooth" });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!headings.length) return null;

  return (
    <div
      ref={stripRef}
      aria-hidden={!revealed}
      className="fixed left-0 top-0 z-20 w-full border-b border-white/10 bg-grey-900/60 backdrop-blur-md transition-transform duration-300 ease-out lg:hidden"
      style={{
        transform: revealed ? `translateY(${navHeight}px)` : "translateY(-100%)",
      }}
    >
      <nav aria-label="Table of contents" className="relative">
        <ul ref={trackRef} className="no-scrollbar flex items-stretch overflow-x-auto touch-pan-x">
          {headings.map(({ id, text }) => {
            const isActive = activeId === id;
            return (
              <li key={id} className="shrink-0">
                <a
                  ref={(node) => {
                    if (node) itemRefs.current[id] = node;
                    else delete itemRefs.current[id];
                  }}
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className={`block whitespace-nowrap px-4 py-4 text-sm leading-none transition-colors duration-300 ${
                    isActive ? "font-medium text-white" : "text-grey-300"
                  }`}
                >
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-primary transition-[transform,width] duration-300 ease-out"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
            opacity: indicator.width ? 1 : 0,
          }}
        />
      </nav>
    </div>
  );
}
