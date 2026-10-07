import Image from "next/image";
import { rows } from "@/lib/cms";
import assetUrl from "@/helpers/functions/assetUrl";

function Icon({ name, className = "" }) {
  const common = {
    className,
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
    chart: <path d="M4 20V10M10 20V4M16 20v-6M22 20H2" />,
    bolt: <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />,
    sports: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m12 7 4.5 3.3-1.7 5.3H9.2L7.5 10.3 12 7Z" />
      </>
    ),
    live: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 2.5-1.5c1.4 0 2.5.9 2.5 2s-1.1 2-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2a2.5 2.5 0 0 0 2.5-1.5M12 6.5v1M12 16.5v1" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
      </>
    ),
    users: (
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    ),
    shield: <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />,
  };
  return <svg {...common}>{paths[name] || <circle cx="12" cy="12" r="9" />}</svg>;
}

const DEFAULT_FEATURES = [
  {
    icon: "chart",
    title: "Everything in one place",
    description: "Content, pages and settings live together, so nothing falls through the cracks.",
    hero: true,
  },
  { icon: "bolt", title: "Instant updates", description: "Publish and see it live in seconds." },
  { icon: "users", title: "Made for teams", description: "Invite anyone, set roles." },
  { icon: "live", title: "Works on mobile", description: "Every page, every screen." },
  { icon: "shield", title: "Secure", description: "Sensible defaults built in." },
];

export default function FeatureGrid({
  title = "Features",
  subtitle = "Everything you need",
  description = "The essentials, done properly, so you can focus on the work that matters.",
  features,
}) {
  features = rows(features, DEFAULT_FEATURES);
  const heroIndex = Math.max(features?.findIndex((f) => f.hero) ?? -1, 0);

  return (
    <section className="landing-container flex flex-col gap-8 py-16 lg:py-24">
      {(title || subtitle || description) && (
        <div className="flex flex-col items-center gap-2 pt-8 text-center">
          {title && (
            <span className="font-heading text-xs font-medium uppercase tracking-[0.14em] text-primary">{title}</span>
          )}
          {subtitle && (
            <h2 className="m-0 mt-3 font-heading text-[clamp(30px,4.4vw,50px)] font-black leading-[1.05] tracking-[-0.03em] text-white">{subtitle}</h2>
          )}
          {description && <p className="max-w-xl text-[16px] text-fg-muted">{description}</p>}
        </div>
      )}

      {features?.length > 0 && (
        <div className="grid auto-rows-[minmax(9rem,1fr)] grid-cols-2 gap-3 lg:grid-cols-4">
          {features.map((feature, index) => {
            const isHero = index === heroIndex;
            return (
              <article
                key={index}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 ${
                  isHero
                    ? "col-span-2 row-span-2 bg-brand-gradient"
                    : "border border-white/[0.07] bg-grey-900"
                }`}
              >
                {isHero && assetUrl(feature.image) && (
                  <>
                    <Image src={assetUrl(feature.image)} alt="" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </>
                )}

                <div className="relative">
                  <div
                    className={`flex items-center justify-center rounded-xl ${
                      isHero ? "h-10 w-10 bg-on-brand/20 text-on-brand" : "h-9 w-9 bg-primary/[0.14] text-primary"
                    }`}
                  >
                    <Icon name={feature.icon} className={isHero ? "h-6 w-6" : "h-5 w-5"} />
                  </div>
                </div>

                <div className="relative">
                  {feature.title && (
                    <h3 className={`font-medium leading-tight ${isHero ? "text-on-brand text-2xl" : "text-base text-white"}`}>
                      {feature.title}
                    </h3>
                  )}
                  {feature.description && (
                    <p className={`mt-1.5 ${isHero ? "text-sm text-on-brand/85" : "text-[13px] text-white/50"}`}>
                      {feature.description}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
