import { cn } from "@/lib/utils";
import { site } from "@/site.config";

const SIZE = 112;
const STROKE = 9;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function gradeFor(value) {
  return site.review.grades.find((g) => value >= g.min)?.label ?? "";
}

export default function ScoreRing({ value, className, valueClassName, gradeClassName }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5, ${gradeFor(rating)}`} className={cn("relative shrink-0", className)}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="size-full -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} className="stroke-grey-700" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${(rating / 5) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          className="stroke-primary"
        />
      </svg>
      <span aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-heading font-black leading-none text-white", valueClassName)}>{rating.toFixed(1)}</span>
        <span className={cn("mt-1 max-w-[70%] text-center text-[9.5px] font-bold uppercase leading-tight tracking-[0.04em] text-primary", gradeClassName)}>{gradeFor(rating)}</span>
      </span>
    </div>
  );
}
