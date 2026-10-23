import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

function Column({ title, items, positive }) {
  if (items.length === 0) return null;
  const Icon = positive ? Plus : Minus;
  return (
    <div className={cn("rounded-2xl border p-4 lg:p-5", positive ? "border-primary/20 bg-primary/[0.06]" : "border-destructive/20 bg-destructive/[0.05]")}>
      <h3 className="m-0 font-heading text-[15px] font-black text-white">{title}</h3>
      <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-grey-100">
            <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", positive ? "text-primary" : "text-destructive")} strokeWidth={3} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProsCons({ pros, cons }) {
  const r = site.review;
  if (pros.length + cons.length === 0) return null;
  return (
    <section id="pros-cons" className="scroll-mt-28">
      <h2 className="sr-only">{r.prosCons}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <Column title={r.pros} items={pros} positive />
        <Column title={r.cons} items={cons} />
      </div>
    </section>
  );
}
