import Link from "next/link";
import { Check } from "lucide-react";
import NextImage from "next/image";
import { labels, pick } from "@/lib/cms";
import assetUrl from "@/helpers/functions/assetUrl";
import { site, isExternalUrl } from "@/site.config";
import { PAGE_TOP, titleClass } from "@/components/Layout/PageIntro";

const STRIPES = "repeating-linear-gradient(90deg, hsl(var(--hero-stripe)) 0 2px, transparent 2px 14px)";
const STRIPE_FADE_Y = "linear-gradient(180deg, transparent 0%, black 12%, black 70%, transparent 96%)";
const stripeFadeX = (dir) => `linear-gradient(to ${dir}, black 0%, rgba(0,0,0,0.35) 28%, transparent 58%)`;
const GLOW = "radial-gradient(60% 50% at 50% 0%, hsl(var(--primary-0) / 0.22) 0%, transparent 70%)";

function StripeBand({ side }) {
  const dir = side === "left" ? "right" : "left";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 ${side}-0 hidden w-[45vw] xl:block`}
      style={{ maskImage: STRIPE_FADE_Y, WebkitMaskImage: STRIPE_FADE_Y }}
    >
      <div className="h-full w-full opacity-45" style={{ background: STRIPES, maskImage: stripeFadeX(dir), WebkitMaskImage: stripeFadeX(dir) }} />
    </div>
  );
}

function CompactHero({ eyebrow, title, titleAccent, description, chips }) {
  return (
    <section className={`landing-container pb-2 ${PAGE_TOP}`}>
      {eyebrow && <p className="m-0 text-[13px] text-fg-muted">{eyebrow}</p>}
      <h1 className={`mt-2 ${titleClass("lg")}`}>
        {title}
        {titleAccent && (
          <>
            {" "}
            <span className="text-primary">{titleAccent}</span>
          </>
        )}
      </h1>
      {description && <p className="m-0 mt-3 max-w-[72ch] text-[15.5px] leading-relaxed text-grey-200">{description}</p>}
      {chips.length > 0 && (
        <ul className="m-0 mt-3 flex list-none flex-wrap gap-x-5 gap-y-1.5 p-0">
          {chips.map((chip) => (
            <li key={chip} className="flex items-center gap-1.5 text-[13px] text-grey-200">
              <Check className="size-3.5 text-primary" strokeWidth={3} aria-hidden />
              {chip}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Hero({
  variant,
  eyebrow,
  label,
  title,
  titleAccent = "reviewed and ranked.",
  description = "We compare bonuses, payouts, games and support at every licensed casino, so you can pick the right one with confidence.",
  buttonLabel = site.cta.label,
  buttonUrl,
  secondaryLabel = "How we rate",
  secondaryAnchor = "#how-it-works",
  chips,
  image,
}) {
  const chipLabels = labels(chips, ["Licensed casinos only", "Tested with real money", "Independent ratings"]);
  const href = pick(buttonUrl, site.cta.url);
  const external = isExternalUrl(href);
  const heading = pick(title, "Best Online Casinos");
  const media = assetUrl(image);

  if (variant === "compact") {
    return <CompactHero eyebrow={eyebrow || label} title={heading} titleAccent={titleAccent} description={description} chips={chipLabels} />;
  }

  return (
    <section
      className={`relative flex flex-col justify-center overflow-hidden py-[clamp(28px,6.5vh,96px)] ${
        media ? "" : "min-h-[calc(100svh-var(--nav-h))]"
      }`}
    >
      <StripeBand side="left" />
      <StripeBand side="right" />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: GLOW }} />

      <div className="landing-container relative text-center">
        {(eyebrow || label) && (
          <p className="landing-rise font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-primary motion-reduce:animate-none">
            {eyebrow || label}
          </p>
        )}
        <h1
          className="landing-rise mx-auto mt-[clamp(10px,2vh,20px)] max-w-[16ch] font-heading text-[clamp(44px,6.4vw,83px)] font-black leading-[0.98] tracking-[-0.03em] text-white [text-wrap:balance] motion-reduce:animate-none"
          style={{ animationDelay: "90ms" }}
        >
          {heading} {titleAccent && <span className="text-primary">{titleAccent}</span>}
        </h1>

        {description && (
          <p
            className="landing-rise mx-auto mt-6 max-w-[544px] text-[18px] leading-relaxed text-fg-muted [text-wrap:balance] motion-reduce:animate-none"
            style={{ animationDelay: "200ms" }}
          >
            {description}
          </p>
        )}

        <div
          className="landing-rise mt-[clamp(16px,3vh,32px)] flex flex-wrap items-center justify-center gap-3 motion-reduce:animate-none"
          style={{ animationDelay: "280ms" }}
        >
          <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex h-[52px] items-center rounded-full bg-primary px-8 font-heading text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {buttonLabel}
          </Link>
          {secondaryLabel && (
            <a
              href={secondaryAnchor}
              className="flex h-[52px] items-center gap-2 rounded-full border border-grey-700 bg-grey-900 px-7 text-base font-medium text-white transition-colors hover:bg-grey-800"
            >
              {secondaryLabel}
            </a>
          )}
        </div>

        {chipLabels.length > 0 && (
          <p
            className="landing-rise mt-[clamp(14px,2.6vh,32px)] flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-muted motion-reduce:animate-none"
            style={{ animationDelay: "360ms" }}
          >
            {chipLabels.map((item, i) => (
              <span key={item} className="flex items-center">
                {i > 0 && <span aria-hidden className="mr-3.5 h-[10px] w-px shrink-0 bg-primary" />}
                {item}
              </span>
            ))}
          </p>
        )}

        {media && (
          <div className="landing-rise relative mx-auto mt-14 max-w-[980px] motion-reduce:animate-none" style={{ animationDelay: "440ms" }}>
            <div aria-hidden className="absolute -inset-x-10 -top-10 bottom-1/2 rounded-full bg-primary/20 blur-3xl" />
            <NextImage
              src={media}
              alt={image?.description || ""}
              width={image?.width || 1960}
              height={image?.height || 1200}
              priority
              sizes="(min-width: 1024px) 980px, 100vw"
              className="relative h-auto w-full rounded-2xl border border-grey-700 shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}
