import Link from "next/link";
import { cn } from "@/lib/utils";
import { CommunityIcon } from "@/components/ui/SocialIcons";
import { pick } from "@/lib/cms";
import { site, isExternalUrl } from "@/site.config";

const VARIANTS = {
  subpage: {
    section: "landing-container pb-20 pt-8 lg:pb-28",
    frame: "rounded-3xl border border-grey-700 bg-grey-900 px-6 py-12 text-center lg:py-16",
    heading: "font-heading text-[clamp(28px,4vw,48px)] font-black tracking-[-0.02em] text-white",
    headingWidth: "",
    description: "mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-fg-muted [text-wrap:balance]",
    actions: "mt-7 flex flex-wrap items-center justify-center gap-3",
    rule: false,
    secondary: "bg-grey-950",
  },
  statement: {
    section: "landing-container relative overflow-x-clip pb-24 pt-8 text-center lg:pb-32",
    frame: "text-center",
    heading: "mx-auto font-heading text-[clamp(30px,4.6vw,56px)] font-black tracking-[-0.03em] text-white",
    headingWidth: "max-w-2xl",
    description: "mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-fg-muted [text-wrap:balance]",
    actions: "relative mt-9 flex flex-wrap items-center justify-center gap-3",
    rule: true,
    secondary: "bg-grey-900",
  },
};

export default function PageCta({
  eyebrow,
  title,
  description,
  buttonLabel = site.cta.label,
  buttonUrl,
  secondaryLabel = site.community.label,
  secondaryUrl,
  variant,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.subpage;
  const heading = pick(title, "Ready to get started?");
  const secondaryHref = pick(secondaryUrl, site.community.url);

  return (
    <section className={v.section}>
      <div className={v.frame}>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <h2 className={cn("mt-3", v.heading, v.headingWidth)}>{heading}</h2>
        {description && <p className={v.description}>{description}</p>}

        <div className={v.actions}>
          {v.rule && (
            <div aria-hidden className="absolute left-1/2 top-1/2 h-px w-screen -translate-x-1/2 bg-grey-700" />
          )}
          {(() => {
            const href = pick(buttonUrl, site.cta.url);
            const ext = isExternalUrl(href);
            return (
              <Link
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className="relative flex h-[52px] items-center rounded-full bg-primary px-8 font-heading text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {buttonLabel}
              </Link>
            );
          })()}
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative flex h-[52px] items-center gap-2 rounded-full border border-grey-700 px-7 text-base font-medium text-white transition-colors hover:bg-grey-800",
                v.secondary
              )}
            >
              <CommunityIcon url={secondaryHref} className="size-4" />
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
