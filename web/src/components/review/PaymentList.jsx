import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { isFastPayout } from "@/lib/casinos";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

function Row({ method, showDeposit }) {
  const fast = isFastPayout(method.withdrawalTime);
  const body = (
    <>
      <span className="grid h-7 w-10 shrink-0 place-items-center rounded-md bg-grey-800">
        {method.logo?.src ? (
          <Image src={method.logo.src} alt="" width={method.logo.width || 40} height={method.logo.height || 28} className="max-h-4 w-auto max-w-8 object-contain" />
        ) : (
          <span aria-hidden className="text-[11px] font-black uppercase text-grey-200">{method.name.slice(0, 2)}</span>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold text-white">{method.name}</span>
      {showDeposit && method.minDeposit && <span className="text-[13px] text-grey-300">{method.minDeposit}</span>}
      {method.withdrawalTime && (
        <span className={cn("flex items-center gap-1 text-right text-[13px] font-bold", fast ? "text-primary" : "text-grey-200")}>
          {fast && <Zap aria-hidden className="size-3.5 fill-current" strokeWidth={0} />}
          {method.withdrawalTime}
        </span>
      )}
    </>
  );
  const classes = "flex items-center gap-3 bg-grey-900 px-4 py-2.5";
  return method.href ? (
    <Link href={method.href} className={cn(classes, "transition-colors hover:bg-grey-800")}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}

export default function PaymentList({ payments }) {
  if (payments.length === 0) return null;
  const r = site.review;
  const deposits = new Set(payments.map((p) => p.minDeposit).filter(Boolean));
  const uniform = deposits.size === 1 && payments.every((p) => p.minDeposit);
  const sorted = [...payments].sort((a, b) => Number(isFastPayout(b.withdrawalTime)) - Number(isFastPayout(a.withdrawalTime)));

  return (
    <section id="payment-methods" className="scroll-mt-28">
      <h2 className="m-0 font-heading text-[22px] font-black text-white">{site.catalog.sections.payments.label}</h2>
      {uniform && <p className="m-0 mt-2 text-[15px] text-grey-200">{r.paymentsNote.replace("{amount}", [...deposits][0])}</p>}
      <div className="mt-4 overflow-hidden rounded-2xl border border-grey-800">
        <p className="m-0 flex justify-between gap-3 bg-grey-950 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted">
          <span>{site.catalog.sections.payments.label}</span>
          <span>{r.withdrawals}</span>
        </p>
        <ul className="m-0 grid list-none gap-px bg-grey-800 p-0 md:grid-cols-2">
          {sorted.map((m, i) => (
            <li key={m.id} className={cn(i === sorted.length - 1 && sorted.length % 2 === 1 && "md:col-span-2")}>
              <Row method={m} showDeposit={!uniform} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
