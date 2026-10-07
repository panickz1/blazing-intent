import { pick, rows } from "@/lib/cms";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  wallet: (
    <>
      <path d="M4 7a2 2 0 0 1 2-2h11v4" />
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M16 13h2" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Z" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
};

const DEFAULT_ITEMS = [
  { icon: "target", title: "Built for one job", description: "A focused product that does the thing you came for, without a learning curve." },
  { icon: "layers", title: "Grows with you", description: "Start small and add more as you need it. Nothing to migrate later." },
  { icon: "bolt", title: "Fast by default", description: "Pages load in a blink, on any device, anywhere in the world." },
  { icon: "shield", title: "Secure from day one", description: "Sensible defaults, encrypted data and access you can audit." },
];

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden {...P}>
      {ICONS[name] ?? ICONS.spark}
    </svg>
  );
}

export default function FeatureCards({ eyebrow = "Why us", title, titleAccent, description, items }) {
  const lead = pick(title, "Simple to start.");
  const accent = pick(titleAccent, "Built to scale.");
  const lede = pick(description, "Everything you need on day one, and nothing you will have to undo on day one hundred.");
  const list = rows(items, DEFAULT_ITEMS);

  return (
    <section className="border-y border-grey-800 bg-grey-900 py-16 lg:py-24">
      <div className="landing-container">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
            <h2 className="mt-3 font-heading text-[clamp(30px,4.4vw,54px)] font-black leading-[1.04] tracking-[-0.035em] text-white">
              {lead} {accent && <span className="text-primary">{accent}</span>}
            </h2>
          </div>
          {lede && <p className="max-w-[44ch] text-[16.5px] leading-relaxed text-fg-muted">{lede}</p>}
        </div>

        <ul className={`mt-10 grid gap-px overflow-hidden rounded-2xl border border-grey-800 bg-grey-800 lg:mt-14 ${list.length % 3 === 0 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {list.map((item) => (
            <li key={item.title} className="flex flex-col bg-grey-950 p-6 lg:p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-6 font-heading text-[18px] font-black leading-tight tracking-[-0.01em] text-white">{item.title}</h3>
              {item.description && <p className="mt-2 text-[14.5px] leading-relaxed text-fg-muted">{item.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
