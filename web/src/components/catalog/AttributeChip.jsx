import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const flag = (code) =>
  /^[a-z]{2}$/i.test(code || "") ? String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0))) : null;

function Cue({ item, cue, icon: Icon }) {
  if (item.logo?.src) {
    return <Image src={item.logo.src} alt="" width={item.logo.width || 40} height={item.logo.height || 40} className="h-4 w-auto max-w-10 object-contain" />;
  }
  if (cue === "flag" && flag(item.code)) {
    return <span aria-hidden className="text-[14px] leading-none">{flag(item.code)}</span>;
  }
  if (cue === "code" && item.code) {
    return (
      <span aria-hidden className="rounded bg-primary/15 px-1 py-px text-[10px] font-bold uppercase leading-tight tracking-wide text-primary">
        {item.code}
      </span>
    );
  }
  return Icon ? <Icon aria-hidden className="size-3.5 shrink-0 text-primary/80" strokeWidth={2.25} /> : null;
}

export default function AttributeChip({ item, className, cue, icon, children }) {
  const body = (
    <>
      <Cue item={item} cue={cue} icon={icon} />
      <span>{item.name}</span>
      {children}
    </>
  );
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-md border border-grey-700 bg-grey-900 px-2.5 py-1 text-[12.5px] font-semibold text-grey-100",
    item.href && "transition-colors hover:border-primary/50 hover:bg-primary/[0.06] hover:text-white",
    className
  );
  return item.href ? (
    <Link href={item.href} className={classes}>
      {body}
    </Link>
  ) : (
    <span className={classes}>{body}</span>
  );
}
