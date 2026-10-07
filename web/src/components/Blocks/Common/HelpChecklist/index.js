import { labels } from "@/lib/cms";

export default function HelpChecklist({ title, items }) {
  const rules = labels(items, [], "text");
  if (rules.length === 0) return null;

  return (
    <div className="max-w-[66ch]">
      {title && (
        <h3 className="mb-3 font-heading text-[16.5px] font-bold tracking-[-0.015em] text-white">
          {title}
        </h3>
      )}
      <ul className="flex flex-col border-t border-grey-800">
        {rules.map((text, i) => (
          <li key={i} className="flex gap-3.5 border-b border-grey-800 py-3.5 text-[15.5px] leading-[1.55] text-fg-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round"
                 className="mt-[3px] size-[15px] shrink-0 text-grey-400" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
