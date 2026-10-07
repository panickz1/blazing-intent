"use client";

import { useState } from "react";
import { cn, toParagraphs } from "@/lib/utils";

function ChevronDown({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function FaqAccordion({ entries, idPrefix = "faq" }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="mt-8 border-t border-grey-700">
      {entries.map(({ question, answer }, i) => (
        <div key={`${question}-${i}`} className="border-b border-grey-700">
          <button
            type="button"
            aria-expanded={open === i}
            aria-controls={`${idPrefix}-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
          >
            <span className={cn("text-[17px] font-bold transition-colors", open === i ? "text-primary" : "text-white")}>
              {question}
            </span>
            <ChevronDown
              className={cn(
                "size-5 shrink-0 transition-transform duration-200",
                open === i ? "rotate-180 text-primary" : "text-grey-200"
              )}
            />
          </button>
          <div
            id={`${idPrefix}-${i}`}
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-300",
              open === i ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="flex max-w-[68ch] flex-col gap-3 text-[15px] leading-relaxed text-fg-muted [text-wrap:balance]">
              {toParagraphs(answer).map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
