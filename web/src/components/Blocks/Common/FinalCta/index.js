import Link from "next/link";
import { CommunityIcon } from "@/components/ui/SocialIcons";
import { pick } from "@/lib/cms";
import { site, isExternalUrl } from "@/site.config";

const SHEEN = "linear-gradient(120deg, transparent 30%, rgba(0,0,0,0.35) 100%)";

export default function FinalCta({
  title,
  description = "Set up in minutes. No credit card required.",
  buttonLabel = site.cta.label,
  buttonUrl,
  secondaryLabel = site.community.label,
  secondaryUrl,
}) {
  const href = pick(buttonUrl, site.cta.url);
  const heading = pick(title, "Ready to get started?");
  const secondaryHref = pick(secondaryUrl, site.community.url);
  const external = isExternalUrl(href);

  return (
    <section className="relative overflow-hidden bg-primary py-20 text-center lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: SHEEN }} />

      <div className="landing-container-narrow relative">
        <h2 className="m-0 font-heading text-[clamp(38px,6.4vw,80px)] font-black leading-[0.96] tracking-[-0.03em] text-primary-foreground">
          {heading}
        </h2>
        {description && <p className="mx-auto mt-5 max-w-xl text-lg text-primary-foreground/90">{description}</p>}

        <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2">
          <div className="flex items-center justify-center">
            <div aria-hidden className="h-px flex-1 bg-white/25" />
            <div className="flex flex-wrap items-center justify-center gap-3 px-5">
              <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex h-[52px] items-center rounded-full bg-white px-8 font-heading text-base font-semibold text-grey-950 transition-opacity hover:opacity-90"
              >
                {buttonLabel}
              </Link>
              {secondaryLabel && secondaryHref && (
                <a
                  href={secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[52px] items-center gap-2 rounded-full bg-grey-950 px-7 text-base font-medium text-white transition-opacity hover:opacity-90"
                >
                  <CommunityIcon url={secondaryHref} className="size-4" />
                  {secondaryLabel}
                </a>
              )}
            </div>
            <div aria-hidden className="h-px flex-1 bg-white/25" />
          </div>
        </div>
      </div>
    </section>
  );
}
