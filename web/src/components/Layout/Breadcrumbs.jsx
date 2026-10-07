import Link from "next/link";
import { Fragment } from "react";
import Schema from "@/helpers/SEO/Schema";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

export default function Breadcrumbs({ items = [], className }) {
  const trail = [{ name: site.breadcrumbs.home, url: "/" }, ...items.filter((i) => i?.name)];
  if (trail.length < 2) return null;

  return (
    <>
      <Schema type="breadcrumb" data={{ items: trail.filter((i) => i.url) }} />
      <nav
        aria-label="Breadcrumb"
        className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold uppercase tracking-widest text-fg-muted", className)}
      >
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <Fragment key={`${item.url}-${i}`}>
              {i > 0 && <span aria-hidden>/</span>}
              {last || !item.url ? (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-grey-200")}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="transition-colors hover:text-white">
                  {item.name}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}
