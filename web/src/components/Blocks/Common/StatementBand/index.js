import Link from "next/link";
import Image from "next/image";
import assetUrl from "@/helpers/functions/assetUrl";
import { site, isExternalUrl } from "@/site.config";

export default function StatementBand({
  eyebrow = "Ready when you are",
  lineOne = "BUILD IT ONCE.",
  lineTwo = "LAUNCH IT EVERYWHERE.",
  buttonLabel = site.cta.label,
  buttonUrl = site.cta.url,
  backgroundImage,
}) {
  const background = assetUrl(backgroundImage);
  const external = isExternalUrl(buttonUrl);

  return (
    <section className="landing-container py-10 lg:py-14">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center lg:py-20">
        {background && (
          <Image src={background} alt="" fill sizes="(min-width: 1160px) 1160px, 100vw" className="object-cover opacity-40" />
        )}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {eyebrow && <span className="text-sm font-medium text-on-brand/80">{eyebrow}</span>}
          {(lineOne || lineTwo) && (
            <h2 className="m-0 flex flex-col leading-[1.05]">
              {lineOne && <span className="font-heading text-3xl font-black uppercase text-on-brand lg:text-5xl">{lineOne}</span>}
              {lineTwo && <span className="font-heading text-3xl font-black uppercase text-on-brand/60 lg:text-5xl">{lineTwo}</span>}
            </h2>
          )}
          {buttonLabel && (
            <Link
              href={buttonUrl}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="btn btn-secondary btn-lg mt-2"
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
