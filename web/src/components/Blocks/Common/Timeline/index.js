import { num, rows } from "@/lib/cms";
import { Markdown } from "@/components/Markdown";
import { SectionHeader } from "@/components/ui/section-header";
import TimelineClient from "./TimelineClient";

const formatDay = (iso) =>
  new Date(`${String(iso).slice(0, 10)}T00:00:00Z`).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function Timeline({ eyebrow, title, lead, entries, initialCount }) {
  const list = rows(entries, [])
    .filter((e) => e?.date && (e.title || e.body))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (list.length === 0) return null;

  const count = list.length;
  const first = Math.min(num(initialCount, 6) || count, count);

  return (
    <section className="py-14 lg:py-20">
      <div className="landing-container max-w-[860px]">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <TimelineClient count={count} initialCount={first} label={`Show all ${count} updates`}>
          {list.map((e, i) => (
            <article key={i}>
              <p className="m-0 flex items-center gap-2 text-[13px] text-fg-muted">
                <time dateTime={String(e.date).slice(0, 10)}>{formatDay(e.date)}</time>
                {e.label && <span className="rounded border border-primary/40 px-1.5 text-[11.5px] font-semibold text-primary">{e.label}</span>}
              </p>
              {e.title && <h3 className="m-0 mt-1 font-heading text-[17px] font-bold leading-snug text-white">{e.title}</h3>}
              {e.body && (
                <div className="mt-1.5 text-grey-200 [&>*:first-child]:mt-0 [&_p]:mt-2 [&_p]:text-[15px] [&_p]:leading-relaxed">
                  <Markdown>{e.body}</Markdown>
                </div>
              )}
            </article>
          ))}
        </TimelineClient>
      </div>
    </section>
  );
}
