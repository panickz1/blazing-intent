import { cn } from "@/lib/utils";

export function SectionHeader({ eyebrow, title, lead, className }) {
  if (!eyebrow && !title && !lead) return null;
  return (
    <header className={cn("max-w-[72ch]", className)}>
      {eyebrow && <p className="m-0 text-[13px] font-semibold text-primary">{eyebrow}</p>}
      {title && (
        <h2 className="m-0 mt-2 font-heading text-[clamp(26px,3vw,36px)] font-bold leading-[1.15] tracking-[-0.02em] text-white [text-wrap:balance]">
          {title}
        </h2>
      )}
      {lead && <p className="m-0 mt-3 text-[16px] leading-relaxed text-grey-200">{lead}</p>}
    </header>
  );
}
