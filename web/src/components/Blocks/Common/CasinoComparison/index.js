import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { getCasinoCards } from "@/lib/casinos";
import { SectionHeader } from "@/components/ui/section-header";
import CasinoLogo from "@/components/casino/CasinoLogo";
import Rating from "@/components/casino/Rating";
import { PaymentLogos, VisitButton } from "@/components/casino/parts";

const DEFAULT_COLUMNS = ["bonus", "wagering", "minDeposit", "withdrawalTime", "paymentMethods"];

const COLUMNS = {
  rating: { label: "Rating", render: (c) => <Rating value={c.rating} size="sm" /> },
  bonus: {
    label: "Welcome bonus",
    render: (c) =>
      c.bonusLabel && (
        <>
          <span className="block font-semibold text-white">{c.bonusLabel}</span>
          {c.bonusDescription && <span className="block text-[12.5px] text-fg-muted">{c.bonusDescription}</span>}
        </>
      ),
  },
  wagering: { label: "Wagering", render: (c) => c.wagering },
  minDeposit: { label: "Min. deposit", render: (c) => c.minDeposit },
  withdrawalTime: { label: "Withdrawal time", render: (c) => c.withdrawalTime },
  paymentMethods: {
    label: "Payment methods",
    render: (c) => <PaymentLogos payments={c.payments} />,
  },
  gameCount: { label: "Games", render: (c) => c.gameCount && `${c.gameCount.toLocaleString("en")}+` },
  liveCasino: {
    label: "Live casino",
    render: (c) =>
      c.liveCasino === null ? null : c.liveCasino ? (
        <Check className="size-4 text-primary" strokeWidth={3} aria-label="Yes" />
      ) : (
        <Minus className="size-4 text-fg-muted" aria-label="No" />
      ),
  },
  licence: { label: "Licence", render: (c) => c.licence },
  established: { label: "Established", render: (c) => c.established },
};

export default async function CasinoComparison({ eyebrow, title, lead, columns, casinos, limit, footnote }) {
  const ids = (Array.isArray(casinos) ? casinos : [])
    .map((row) => row?.casinos_id?.id ?? row?.casinos_id)
    .filter((id) => typeof id === "number" || typeof id === "string");
  const cards = await getCasinoCards({ ids, limit: limit ?? (ids.length ? undefined : 5) });
  if (cards.length === 0) return null;

  const keys = (Array.isArray(columns) && columns.length ? columns : DEFAULT_COLUMNS).filter((k) => COLUMNS[k]);

  return (
    <section className="py-14 lg:py-20">
      <div className="landing-container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className="mt-8 overflow-x-auto rounded-xl border border-grey-800">
          <table className="w-full min-w-[720px] border-collapse text-left text-[14px] text-grey-100">
            <thead className="bg-grey-900">
              <tr>
                <th scope="col" className="px-4 py-3 text-[12px] font-semibold text-fg-muted">Casino</th>
                {keys.map((k) => (
                  <th key={k} scope="col" className="whitespace-nowrap px-4 py-3 text-[12px] font-semibold text-fg-muted">
                    {COLUMNS[k].label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Visit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} className="border-t border-grey-800 align-middle">
                  <th scope="row" className="px-4 py-3 font-normal">
                    <span className="flex items-center gap-3">
                      <CasinoLogo casino={c} className="h-10 w-14 shrink-0 px-1 [&>span]:text-[10px]" />
                      <Link href={c.reviewHref} className="whitespace-nowrap font-semibold text-white hover:underline">
                        {c.name}
                      </Link>
                    </span>
                  </th>
                  {keys.map((k) => (
                    <td key={k} className="px-4 py-3">
                      {COLUMNS[k].render(c) || <span className="text-fg-muted">-</span>}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <VisitButton casino={c} className="h-9 w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footnote && <p className="m-0 mt-3 text-[12px] text-grey-400">{footnote}</p>}
      </div>
    </section>
  );
}
