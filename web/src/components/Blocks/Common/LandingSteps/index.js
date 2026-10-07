import { cn } from "@/lib/utils";
import { pick, rows } from "@/lib/cms";

const DEFAULT_STEPS = [
  { title: "Sign up", description: "Create an account in under a minute. No credit card needed." },
  { title: "Set it up", description: "Pick a template, add your content and invite your team." },
  { title: "Go live", description: "Publish when you're ready and share your link anywhere." },
  { title: "Grow", description: "Measure what works and improve it, one change at a time." },
];

export default function LandingSteps({ eyebrow = "How it works", title, steps }) {
  const heading = pick(title, "From zero to live in four steps.");
  const items = rows(steps, DEFAULT_STEPS);

  return (
    <section id="how-it-works" className="landing-container scroll-mt-24 py-16 lg:py-24">
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
      <h2 className="mt-3 font-heading text-[clamp(30px,4.6vw,56px)] font-black tracking-[-0.03em] text-white">
        {heading}
      </h2>
      <div className="mt-10 grid gap-10 md:grid-cols-4 md:gap-0">
        {items.map((s, i) => (
          <div key={s.title} className={cn("md:px-7", i > 0 && "md:border-l md:border-grey-800", i === 0 && "md:pl-0")}>
            <p className="font-heading text-4xl font-black tabular-nums text-grey-700">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-heading text-lg font-black leading-tight text-white">{s.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-fg-muted">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
