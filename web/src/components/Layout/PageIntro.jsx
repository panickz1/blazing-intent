import { cn } from "@/lib/utils";
import Breadcrumbs from "./Breadcrumbs";

export const PAGE_TOP = "pt-8 lg:pt-11";

const TITLE = {
  lg: "text-[clamp(30px,4.2vw,48px)] leading-[1.05] tracking-[-0.03em]",
  md: "text-[clamp(26px,3vw,36px)] leading-[1.12] tracking-[-0.02em]",
};

export function titleClass(size = "lg") {
  return cn("m-0 font-heading font-black text-white [text-wrap:balance]", TITLE[size] ?? TITLE.lg);
}

export default function PageIntro({
  breadcrumbs,
  eyebrow,
  title,
  titleAccent,
  lead,
  size = "lg",
  as: Heading = "h1",
  className,
  children,
}) {
  return (
    <div className={cn(PAGE_TOP, className)}>
      {breadcrumbs?.length > 0 && <Breadcrumbs items={breadcrumbs} className="mb-5" />}
      {eyebrow && <p className="m-0 mb-2.5 text-[13px] font-semibold text-primary">{eyebrow}</p>}
      <Heading className={cn(titleClass(size), "max-w-[28ch]")}>
        {title}
        {titleAccent && (
          <>
            {" "}
            <span className="text-primary">{titleAccent}</span>
          </>
        )}
      </Heading>
      {lead && <p className="m-0 mt-3.5 max-w-[64ch] text-[16.5px] leading-relaxed text-grey-200">{lead}</p>}
      {children}
    </div>
  );
}
