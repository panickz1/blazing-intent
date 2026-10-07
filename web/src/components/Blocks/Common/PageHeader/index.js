import { pick } from "@/lib/cms";

export default function PageHeader({ eyebrow, title, titleAccent, description }) {
  const heading = pick(title, "Page title");

  return (
    <section className="landing-container  pt-16 text-center lg:pt-24">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      )}
      <h1 className="mx-auto mt-4 max-w-[22ch] font-heading text-3xl md:text-5xl font-black leading-[1.2] tracking-[-0.03em] text-white [text-wrap:balance]">
        {heading} {titleAccent && <span className="text-primary">{titleAccent}</span>}
      </h1>
      {description && (
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-fg-muted [text-wrap:balance]">
          {description}
        </p>
      )}
    </section>
  );
}
