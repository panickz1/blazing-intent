import { cn } from "@/lib/utils";
import { rows } from "@/lib/cms";
import { Markdown } from "@/components/Markdown";
import { BlockIcon } from "@/components/ui/block-icons";
import { SectionHeader } from "@/components/ui/section-header";

const GRID = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
};

const BODY = "text-grey-200 [&>*:first-child]:mt-0 [&_li]:text-[15px] [&_p]:mt-3 [&_p]:text-[15px] [&_p]:leading-relaxed [&_ul]:mt-3";

export default function InfoSection({ eyebrow, title, lead, items, columns = "3", band = false }) {
  const list = rows(items, []).filter((item) => item?.title || item?.body);
  if (!title && list.length === 0) return null;
  const stacked = String(columns) === "1";

  return (
    <section className={cn("py-14 lg:py-20", band && "border-y border-grey-800 bg-grey-900")}>
      <div className="landing-container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />

        {list.length > 0 && stacked && (
          <div className="mt-8 flex max-w-[860px] flex-col gap-7">
            {list.map((item, i) => (
              <div key={i} className="grid grid-cols-[36px_minmax(0,1fr)] gap-4">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <BlockIcon name={item.icon} className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  {item.title && <h3 className="m-0 mt-1.5 font-heading text-[18px] font-bold text-white">{item.title}</h3>}
                  {item.body && (
                    <div className={cn("mt-2", BODY)}>
                      <Markdown>{item.body}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {list.length > 0 && !stacked && (
          <div className={cn("mt-8 grid gap-4", GRID[String(columns)] ?? GRID[3])}>
            {list.map((item, i) => (
              <div key={i} className={cn("rounded-xl border border-grey-800 p-5 lg:p-6", band ? "bg-grey-950" : "bg-grey-900")}>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BlockIcon name={item.icon} className="size-[18px]" />
                  </span>
                  {item.title && <h3 className="m-0 font-heading text-[17px] font-bold leading-snug text-white">{item.title}</h3>}
                </div>
                {item.body && (
                  <div className={cn("mt-3", BODY)}>
                    <Markdown>{item.body}</Markdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
