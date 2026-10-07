import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AttributeChip({ item, className, children }) {
  const body = (
    <>
      {item.logo?.src && (
        <Image src={item.logo.src} alt="" width={item.logo.width || 40} height={item.logo.height || 40} className="h-4 w-auto max-w-10 object-contain" />
      )}
      <span>{item.name}</span>
      {children}
    </>
  );
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-md border border-grey-700 bg-grey-900 px-2.5 py-1 text-[12.5px] font-semibold text-grey-100",
    item.href && "transition-colors hover:border-grey-500 hover:text-white",
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
