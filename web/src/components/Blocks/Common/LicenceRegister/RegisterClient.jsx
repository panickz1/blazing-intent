"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import CasinoLogo from "@/components/casino/CasinoLogo";

const STATUS = {
  active: { label: "Active", className: "border-primary/40 text-primary" },
  pending: { label: "Pending", className: "border-warning/50 text-warning" },
  suspended: { label: "Suspended", className: "border-destructive/50 text-destructive" },
  revoked: { label: "Revoked", className: "border-destructive/50 text-destructive" },
};

export default function RegisterClient({ rows, licenceHeading }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter((r) => r.name.toLowerCase().includes(q) || (r.licence || "").toLowerCase().includes(q)) : rows;
  }, [query, rows]);

  return (
    <>
      {rows.length > 6 && (
        <label className="mt-8 flex h-10 max-w-sm items-center gap-2 rounded-md border border-grey-700 bg-grey-900 px-3 text-grey-300 focus-within:border-grey-500">
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="sr-only">Search casinos</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a casino or licence number"
            className="h-full w-full bg-transparent text-[14px] text-white outline-none placeholder:text-grey-400"
          />
        </label>
      )}
      <div className="mt-4 overflow-x-auto rounded-xl border border-grey-800">
        <table className="w-full min-w-[560px] border-collapse text-left text-[14px] text-grey-100">
          <thead className="bg-grey-900">
            <tr>
              <th scope="col" className="px-4 py-3 text-[12px] font-semibold text-fg-muted">Casino</th>
              <th scope="col" className="px-4 py-3 text-[12px] font-semibold text-fg-muted">{licenceHeading}</th>
              <th scope="col" className="px-4 py-3 text-[12px] font-semibold text-fg-muted">Status</th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Review</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const status = STATUS[r.status] ?? STATUS.active;
              return (
                <tr key={r.id} hidden={!shown.includes(r)} className="border-t border-grey-800">
                  <th scope="row" className="px-4 py-2.5 font-normal">
                    <span className="flex items-center gap-3">
                      <CasinoLogo casino={r} className="h-8 w-12 shrink-0 px-1 [&>span]:text-[9px]" />
                      <span className="font-semibold text-white">{r.name}</span>
                    </span>
                  </th>
                  <td className="px-4 py-2.5">
                    {r.licence ? (
                      r.licenceUrl ? (
                        <a href={r.licenceUrl} target="_blank" rel="nofollow noopener" className="underline-offset-4 hover:underline">
                          {r.licence}
                        </a>
                      ) : (
                        r.licence
                      )
                    ) : (
                      <span className="text-fg-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={cn("rounded border px-1.5 py-0.5 text-[12px] font-semibold", status.className)}>{status.label}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {r.reviewHref ? (
                      <Link href={r.reviewHref} className="text-[13.5px] font-medium text-grey-100 underline-offset-4 hover:text-white hover:underline">
                        Read review
                      </Link>
                    ) : (
                      <span className="text-[13px] text-fg-muted">Not recommended</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <p className="m-0 border-t border-grey-800 px-4 py-3 text-[14px] text-fg-muted">No casino matches that search.</p>}
      </div>
    </>
  );
}
