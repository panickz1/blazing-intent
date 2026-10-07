import { pick, rows } from "@/lib/cms";

function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

const EDGE_STRIPES = [
  "repeating-linear-gradient(90deg, hsl(0 0% 100% / 0.5) 0 2px, transparent 2px 22px)",
  "repeating-linear-gradient(90deg, hsl(0 0% 100% / 0.14) 0 1px, transparent 1px 7px)",
  "linear-gradient(180deg, transparent 0%, hsl(0 0% 100% / 0.05) 46%, transparent 100%)",
].join(", ");

const DEFAULT_ITEMS = [
  { name: "Alex Morgan", role: "Head of Operations", tag: "Operations", highlight: "3 tools → 1", quote: "We replaced three tools in a week. Nobody on the team wants to go back." },
  { name: "Priya Shah", role: "Founder", tag: "Startup", highlight: "Live in 2 days", quote: "We launched our site in two days and changed the copy ourselves ever since." },
  { name: "Daniel Costa", role: "Marketing Lead", tag: "Marketing", highlight: "+38% signups", quote: "Every campaign page is a few blocks away. Our signup rate followed." },
];

export default function Testimonials({ eyebrow = "Customers", title, items, footnote }) {
  const list = rows(items, DEFAULT_ITEMS);
  if (list.length === 0) return null;

  const heading = pick(title, "Loved by teams that ship.");

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {["left", "right"].map((edge) => {
        const anchor = edge === "left" ? "0%" : "100%";
        const mask = `radial-gradient(120% 78% at ${anchor} 50%, black 0%, rgba(0,0,0,0.62) 38%, transparent 80%)`;
        return (
          <div
            key={edge}
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 hidden w-[46vw] xl:block ${edge === "left" ? "left-0" : "right-0"}`}
            style={{ maskImage: mask, WebkitMaskImage: mask }}
          >
            <div className="h-full w-full opacity-70" style={{ backgroundImage: EDGE_STRIPES }} />
          </div>
        );
      })}

      <div className="landing-container relative">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
        <h2 className="m-0 mt-3 max-w-[16ch] font-heading text-[clamp(30px,4.6vw,56px)] font-black leading-[1.02] tracking-[-0.03em] text-white">
          {heading}
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6">
          {list.map((item) => (
            <figure key={item.name ?? item.quote} className="flex flex-col rounded-2xl border border-grey-600 bg-grey-950 p-6 lg:p-7">
              <div className="flex items-baseline justify-between gap-3">
                {item.highlight && (
                  <p className="font-heading text-[26px] font-black leading-none tracking-[-0.03em] text-accent-2">{item.highlight}</p>
                )}
                {item.tag && (
                  <span className="shrink-0 rounded-full border border-grey-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-grey-200">
                    {item.tag}
                  </span>
                )}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-white">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-grey-700 pt-5">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-grey-800 text-[11px] font-black uppercase tracking-wider text-grey-200"
                >
                  {initials(item.name ?? "")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">{item.name}</span>
                  {item.role && <span className="block truncate text-xs text-fg-muted">{item.role}</span>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        {footnote && <p className="mt-8 text-xs text-fg-muted">{footnote}</p>}
      </div>
    </section>
  );
}
