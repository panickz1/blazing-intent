import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("404");

  return (
    <section className="landing-container-narrow flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{t("eyebrow")}</p>
      <h1 className="mt-4 font-heading text-[clamp(32px,5vw,56px)] font-black leading-[1.02] tracking-[-0.03em] text-white [text-wrap:balance]">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-fg-muted [text-wrap:balance]">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 flex h-12 items-center rounded-full bg-primary px-7 font-heading text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {t("buttonHome")}
      </Link>
    </section>
  );
}
