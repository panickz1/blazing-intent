import Link from "next/link";
import { site } from "@/site.config";

function Value({ item }) {
  return item.href ? (
    <Link href={item.href} className="underline decoration-grey-600 underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary">
      {item.name}
    </Link>
  ) : (
    item.name
  );
}

export default function SpecSheet({ groups, licence, licenceUrl }) {
  if (groups.length === 0 && !licence) return null;
  return (
    <section className="rounded-2xl border border-grey-800 bg-grey-900 px-5 pb-2 pt-4">
      <h2 className="m-0 mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-muted">{site.review.specs}</h2>
      <dl className="m-0">
        {groups.map((g) => (
          <div key={g.key} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-t border-grey-800 py-3 text-[13.5px] first:border-t-0">
            <dt className="font-medium text-fg-muted">{g.label}</dt>
            <dd className="m-0 font-semibold leading-relaxed text-grey-100">
              {g.items.map((item, i) => (
                <span key={item.slug ?? item.name}>
                  {i > 0 && ", "}
                  <Value item={item} />
                </span>
              ))}
            </dd>
          </div>
        ))}
        {licence && (
          <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-t border-grey-800 py-3 text-[13.5px]">
            <dt className="font-medium text-fg-muted">{site.review.licenceNumber}</dt>
            <dd className="m-0 font-semibold text-grey-100">
              {licenceUrl ? (
                <a href={licenceUrl} target="_blank" rel="nofollow noopener" className="underline decoration-grey-600 underline-offset-[3px] hover:text-primary">
                  {licence}
                </a>
              ) : (
                licence
              )}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
