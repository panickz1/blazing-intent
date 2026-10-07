import { labels, pick } from "@/lib/cms";

const DEFAULT_FACTS = ["Made for real people", "Built to last", "Honest by default"];

export default function Manifesto({ eyebrow, title, titleAccent, facts }) {
  const lead = pick(title, "Good tools should feel");
  const accent = pick(titleAccent, "invisible.");
  const items = labels(facts, DEFAULT_FACTS);

  return (
    <section className="landing-container relative pb-16 pt-16 lg:pb-24 lg:pt-28">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      )}
      <h1 className="mt-5 max-w-[14ch] font-heading text-[clamp(44px,7.6vw,108px)] font-black leading-[0.94] tracking-[-0.045em] text-white [text-wrap:balance]">
        {lead} {accent && <span className="text-primary">{accent}</span>}
      </h1>

      {items.length > 0 && (
        <ol className="mt-12 grid border-y border-grey-800 sm:grid-cols-3 lg:mt-16">
          {items.map((fact, i) => (
            <li
              key={fact}
              className="flex items-baseline gap-4 border-t border-grey-800 py-5 first:border-t-0 sm:border-l sm:border-t-0 sm:px-6 sm:py-6 sm:first:border-l-0 sm:first:pl-0"
            >
              <span className="font-mono text-[11px] tabular-nums text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-white">{fact}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
