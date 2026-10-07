"use client";

import { LeadForm } from "./LeadForm";
import { site } from "@/site.config";

export default function LeadPageForm() {
  return (
    <LeadForm
      idPrefix="lead-page"
      renderSuccess={() => (
        <div>
          <h2 className="m-0 font-heading text-[24px] font-black tracking-[-0.02em] text-white">{site.leadForm.successTitle}</h2>
          <p className="mb-0 mt-2 text-[14.5px] leading-relaxed text-fg-muted">{site.leadForm.successDescription}</p>
        </div>
      )}
    />
  );
}
