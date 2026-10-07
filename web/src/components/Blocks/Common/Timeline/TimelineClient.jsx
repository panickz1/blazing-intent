"use client";

import { useState } from "react";

export default function TimelineClient({ count, initialCount, label, children }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? count : initialCount;

  return (
    <>
      <ol className="relative m-0 mt-8 list-none border-l border-grey-800 p-0 pl-6">
        {children.map((child, i) => (
          <li key={i} hidden={i >= visible} className="relative pb-7 last:pb-0">
            <span aria-hidden className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-primary bg-grey-950" />
            {child}
          </li>
        ))}
      </ol>
      {visible < count && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-6 inline-flex h-10 items-center rounded-md border border-grey-700 px-4 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
        >
          {label}
        </button>
      )}
    </>
  );
}
