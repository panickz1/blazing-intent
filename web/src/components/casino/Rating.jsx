import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Rating({ value = 0, className, size = "md", showValue = true }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  const star = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative flex" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        <div className="flex gap-0.5 text-grey-700">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={cn(star, "fill-current")} strokeWidth={0} />
          ))}
        </div>
        <div className="absolute inset-0 flex gap-0.5 overflow-hidden text-accent-2" style={{ width: `${(rating / 5) * 100}%` }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={cn(star, "shrink-0 fill-current")} strokeWidth={0} />
          ))}
        </div>
      </div>
      {showValue && <span className="text-[13px] font-semibold tabular-nums text-grey-100">{rating.toFixed(1)}</span>}
    </div>
  );
}
