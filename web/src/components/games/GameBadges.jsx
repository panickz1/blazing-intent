import { cn } from "@/lib/utils";
import { site } from "@/site.config";

const TONES = {
  high: "border-primary/40 bg-primary/[0.12] text-primary",
  medium: "border-accent-2/40 bg-accent-2/[0.12] text-accent-2",
  low: "border-destructive/40 bg-destructive/[0.12] text-destructive",
};

const LEVELS = { low: 1, medium: 2, high: 3 };

function rtpTier(rtp) {
  return rtp == null ? null : site.games.rtpTiers.find((t) => rtp >= t.min) ?? null;
}

export function RtpBadge({ rtp, className }) {
  const tier = rtpTier(rtp);
  if (!tier) return null;
  return (
    <span
      title={tier.label}
      className={cn("inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-[12px] font-bold tabular-nums", TONES[tier.key], className)}
    >
      <span className="text-[10px] font-semibold opacity-80 max-sm:sr-only">{site.games.stats.rtp}</span>
      {rtp.toFixed(2)}%<span className="sr-only">, {tier.label}</span>
    </span>
  );
}

export function VolatilityMeter({ volatility, className }) {
  const level = LEVELS[volatility];
  if (!level) return null;
  const label = site.games.volatilityLabel.replace("{level}", site.games.volatility[volatility]);
  return (
    <span title={label} className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium text-grey-200", className)}>
      <span aria-hidden className="flex items-end gap-[2px]">
        {[1, 2, 3].map((n) => (
          <span key={n} className={cn("w-[3px] rounded-sm", n <= level ? "bg-grey-100" : "bg-grey-700")} style={{ height: 4 + n * 3 }} />
        ))}
      </span>
      {site.games.volatility[volatility]}
      <span className="sr-only"> {site.games.stats.volatility.toLowerCase()}</span>
    </span>
  );
}
