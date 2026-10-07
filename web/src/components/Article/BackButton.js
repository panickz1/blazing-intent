"use client";

import { useRouter } from "next/navigation";
import IconComponent from "@/helpers/functions/getIcon";

export default function BackButton({ fallback = "/blog" }) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back"
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/20 hover:text-white"
    >
      <IconComponent iconName="chevron_left" className="!text-[16px]" />
      Back
    </button>
  );
}
