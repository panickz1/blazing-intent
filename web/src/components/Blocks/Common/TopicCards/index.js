import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { rows } from "@/lib/cms";
import { BlockIcon } from "@/components/ui/block-icons";
import { SectionHeader } from "@/components/ui/section-header";
import { isExternalUrl } from "@/site.config";

function Card({ item }) {
  return (
    <>
      <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
        <BlockIcon name={item.icon} className="size-5" />
      </span>
      {item.title && <h3 className="m-0 mt-4 font-heading text-[17px] font-bold text-white">{item.title}</h3>}
      {item.body && <p className="m-0 mt-2 flex-1 text-[14.5px] leading-relaxed text-grey-200">{item.body}</p>}
      {item.url && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
          {item.linkLabel || "Read the guide"}
          <ArrowRight className="size-4" aria-hidden />
        </span>
      )}
    </>
  );
}

export default function TopicCards({ eyebrow, title, lead, items }) {
  const list = rows(items, []).filter((i) => i?.title);
  if (list.length === 0) return null;
  const box = "flex flex-col rounded-xl border border-grey-800 bg-grey-900 p-5 lg:p-6";

  return (
    <section className="py-14 lg:py-20">
      <div className="landing-container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => (
            <li key={i} className="flex">
              {item.url ? (
                <Link
                  href={item.url}
                  target={isExternalUrl(item.url) ? "_blank" : undefined}
                  className={`${box} w-full transition-colors hover:border-grey-600`}
                >
                  <Card item={item} />
                </Link>
              ) : (
                <div className={`${box} w-full`}>
                  <Card item={item} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
