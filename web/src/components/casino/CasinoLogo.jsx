import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CasinoLogo({ casino, className, size = "md" }) {
  const src = casino.logo?.src;
  return (
    <div
      className={cn("flex items-center justify-center overflow-hidden rounded-lg px-2", className)}
      style={{ backgroundColor: casino.brandColor || "hsl(var(--grey-800))" }}
    >
      {src ? (
        <Image
          src={src}
          alt={casino.name}
          width={casino.logo?.width || 240}
          height={casino.logo?.height || 120}
          className="max-h-[70%] w-auto max-w-[85%] object-contain"
        />
      ) : (
        <span
          className={cn(
            "text-center font-heading font-bold leading-tight tracking-[-0.01em] text-on-brand",
            size === "lg" ? "text-[26px]" : "text-[15px]"
          )}
        >
          {casino.name}
        </span>
      )}
    </div>
  );
}
