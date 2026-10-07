import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";
import { pick } from "@/lib/cms";

const WIDTHS = {
  prose: "landing-container-prose",
  wide: "landing-container",
};

export default function Prose({ eyebrow, title, body, width, band }) {
  if (!body?.trim()) return null;

  const container = WIDTHS[width] ?? WIDTHS.prose;

  return (
    <section className={cn("py-14 lg:py-20", band && "bg-grey-900")}>
      <div className={container}>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        {title && (
          <h2 className="mt-3 font-heading text-[clamp(26px,3.6vw,42px)] font-black tracking-[-0.03em] text-white">
            {pick(title, "")}
          </h2>
        )}
        <div className={cn("[&>*:first-child]:mt-0", (eyebrow || title) && "mt-6")}>
          <Markdown>{body}</Markdown>
        </div>
      </div>
    </section>
  );
}
