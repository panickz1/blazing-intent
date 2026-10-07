"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

export default function CopyCode({ code, className }) {
  const l = site.bonuses;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      const field = document.createElement("textarea");
      field.value = code;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(field);
      field.select();
      setCopied(document.execCommand("copy"));
      field.remove();
    }
  };

  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${l.code} ${code}. ${l.copyLabel}`}
      className={cn(
        "group flex w-full items-center justify-between gap-2 rounded-md border border-dashed px-3 py-2 text-left transition-colors",
        copied ? "border-primary bg-primary/10" : "border-accent-2/60 bg-accent-2/[0.06] hover:border-accent-2 hover:bg-accent-2/[0.12]",
        className
      )}
    >
      <span className="min-w-0">
        <span className="block text-[11px] text-fg-muted">
          {l.code} <span className={cn("font-semibold", copied ? "text-primary" : "text-accent-2")}>· {copied ? l.copiedLabel : l.copyLabel}</span>
        </span>
        <span className="block truncate font-mono text-[14px] font-bold tracking-wider text-white">{code}</span>
      </span>
      <Icon aria-hidden className={cn("size-4 shrink-0 transition-transform group-active:scale-90", copied ? "text-primary" : "text-accent-2")} />
      <span className="sr-only" aria-live="polite">
        {copied ? l.copiedLabel : ""}
      </span>
    </button>
  );
}
