"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
  useIsMobile,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { LeadForm } from "./LeadForm";
import { site } from "@/site.config";

const HASH = `#${site.leadForm.path.replace(/^\//, "")}`;

const isLeadLink = (anchor) => {
  try {
    const url = new URL(anchor.href, window.location.href);
    return url.origin === window.location.origin && url.pathname.replace(/\/$/, "") === site.leadForm.path;
  } catch {
    return false;
  }
};

export default function LeadModal() {
  const [open, setOpen] = useState(false);
  const statusRef = useRef({ status: "form", reset: () => {} });
  const nameRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest?.("a[href]");
      if (!anchor || !isLeadLink(anchor)) return;
      if (window.location.pathname.replace(/\/$/, "") === site.leadForm.path) return;
      e.preventDefault();
      setOpen(true);
    };
    const fromHash = () => {
      if (window.location.hash === HASH) setOpen(true);
    };
    fromHash();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", fromHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  const onStatusChange = useCallback((status, reset) => {
    statusRef.current = { status, reset };
  }, []);

  const onOpenChange = (next) => {
    setOpen(next);
    if (next) return;
    if (window.location.hash === HASH) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    if (statusRef.current.status === "sent") setTimeout(statusRef.current.reset, 500);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        onOpenAutoFocus={(e) => {
          if (isMobile || !nameRef.current) return;
          e.preventDefault();
          nameRef.current.focus();
        }}
        className="gap-0 bg-grey-900 font-heading text-white"
        dialogClassName={cn(
          "block max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[520px] overflow-y-auto border-grey-800 p-6 sm:rounded-3xl dark:border-grey-800 dark:bg-grey-900 !backdrop-blur-xl",
          "[&>button:last-child]:right-5 [&>button:last-child]:top-5 [&>button:last-child]:!bg-transparent [&>button:last-child]:text-grey-300 [&>button:last-child]:hover:text-white"
        )}
        drawerClassName="border-grey-800 backdrop-blur-none"
      >
        <LeadForm
          idPrefix="lead-modal"
          autoFocusRef={nameRef}
          onStatusChange={onStatusChange}
          renderTitle={() => (
            <>
              <ResponsiveDialogTitle className="m-0 pr-8 text-[22px] font-bold tracking-[-0.02em]">
                {site.leadForm.title}
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="mb-0 mt-1.5 text-[13.5px] text-grey-300 dark:text-grey-300">
                {site.leadForm.description}
              </ResponsiveDialogDescription>
            </>
          )}
          renderSuccess={() => (
            <div className="pr-8">
              <ResponsiveDialogTitle className="m-0 text-[22px] font-bold tracking-[-0.02em]">
                {site.leadForm.successTitle}
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="mb-0 mt-2 text-[14.5px] leading-relaxed text-grey-200 dark:text-grey-200">
                {site.leadForm.successDescription}
              </ResponsiveDialogDescription>
              <ResponsiveDialogClose asChild>
                <Button variant="outline" size="pill" className="mt-6 h-12 w-full py-0 dark:border-grey-800 dark:bg-transparent">
                  Close
                </Button>
              </ResponsiveDialogClose>
            </div>
          )}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
