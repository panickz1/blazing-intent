import { cn } from "@/lib/utils";

const STRIPES = "repeating-linear-gradient(90deg, hsl(var(--hero-stripe)) 0 2px, transparent 2px 14px)";
const CURTAIN_FADE_Y = "linear-gradient(180deg, transparent 0%, black 14%, black 80%, transparent 100%)";
const curtainFadeX = (side) =>
  `linear-gradient(to ${side === "left" ? "right" : "left"}, black 0%, rgba(0,0,0,0.3) 40%, transparent 78%)`;

const TONES = {
  primary: {
    height: "h-[820px]",
    mask: "linear-gradient(180deg, black 0%, black 34%, transparent 100%)",
    layers: [
      "radial-gradient(120% 62% at 50% -8%, hsl(var(--primary-0) / 0.20) 0%, hsl(var(--primary-0) / 0.08) 34%, transparent 72%)",
      "radial-gradient(46% 30% at 50% 2%, hsl(var(--primary-0) / 0.16) 0%, transparent 70%)",
    ],
    curtains: true,
  },
  accent: {
    height: "h-[880px]",
    mask: "linear-gradient(180deg, black 0%, black 46%, transparent 100%)",
    layers: [
      "radial-gradient(130% 58% at 50% 13%, hsl(var(--accent-2) / 0.14) 0%, hsl(var(--accent-2) / 0.06) 38%, transparent 76%)",
      "radial-gradient(52% 26% at 50% 15%, hsl(var(--accent-2) / 0.12) 0%, transparent 72%)",
    ],
    curtains: false,
  },
};

function Curtain({ side }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-y-0 z-0 hidden w-[30vw] xl:block",
        side === "left" ? "left-0" : "right-0"
      )}
      style={{ maskImage: CURTAIN_FADE_Y, WebkitMaskImage: CURTAIN_FADE_Y }}
    >
      <div
        className="h-full w-full opacity-35"
        style={{ background: STRIPES, maskImage: curtainFadeX(side), WebkitMaskImage: curtainFadeX(side) }}
      />
    </div>
  );
}

export function PageBacklight({ tone }) {
  const t = TONES[tone];
  if (!t) return null;

  return (
    <>
      {t.curtains && (
        <>
          <Curtain side="left" />
          <Curtain side="right" />
        </>
      )}
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-x-0 top-0 z-0", t.height)}
        style={{
          backgroundImage: t.layers.join(", "),
          maskImage: t.mask,
          WebkitMaskImage: t.mask,
        }}
      />
    </>
  );
}
