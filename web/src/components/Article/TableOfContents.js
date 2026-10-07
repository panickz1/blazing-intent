"use client";

import { useEffect, useRef, useState } from "react";
import IconComponent from "@/helpers/functions/getIcon";

export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState(null);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const itemRefs = useRef({});
  const suppressObserver = useRef(false);
  const releaseTimer = useRef(null);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserver.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    const el = itemRefs.current[activeId];
    if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight });
  }, [activeId, headings]);

  useEffect(() => {
    const onResize = () => {
      const el = itemRefs.current[activeId];
      if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeId]);

  useEffect(() => () => clearTimeout(releaseTimer.current), []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const OFFSET = 88;
    const viewport = document.querySelector("[data-radix-scroll-area-viewport]");
    const scroller = viewport || window;

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

    if (viewport) {
      const top = el.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop - OFFSET;
      viewport.scrollTo({ top, behavior: "smooth" });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="flex flex-col">
      <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
        <IconComponent iconName="list" className="!text-[16px] text-primary" />
        On this page
      </span>
      <ul className="relative flex flex-col gap-1 border-l border-white/10">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-px w-0.5 rounded bg-primary transition-[transform,height,opacity] duration-300 ease-out"
          style={{
            transform: `translateY(${indicator.top}px)`,
            height: indicator.height,
            opacity: indicator.height ? 1 : 0,
          }}
        />
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                ref={(node) => {
                  if (node) itemRefs.current[id] = node;
                  else delete itemRefs.current[id];
                }}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                style={{ paddingLeft: `${(Math.max(level, 2) - 2) * 12 + 12}px` }}
                className={`block py-1 pr-2 text-sm leading-snug transition-colors duration-300 ${
                  isActive ? "font-medium text-white" : "text-grey-300 hover:text-white"
                }`}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
