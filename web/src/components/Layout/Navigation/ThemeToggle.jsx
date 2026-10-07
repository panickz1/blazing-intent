"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

export default function ThemeToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme();
  if (!site.theme.switcher) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      aria-label={site.theme.toggleLabel}
      title={site.theme.toggleLabel}
      className={cn(
        "grid size-10 place-items-center rounded-full border border-grey-700 text-grey-200 transition-colors hover:border-grey-500 hover:text-white",
        className
      )}
    >
      <Sun className="size-[18px] [[data-theme=light]_&]:hidden" aria-hidden />
      <Moon className="hidden size-[18px] [[data-theme=light]_&]:block" aria-hidden />
    </button>
  );
}
