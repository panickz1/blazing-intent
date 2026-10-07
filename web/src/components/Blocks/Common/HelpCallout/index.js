import { cn } from "@/lib/utils";

const TONES = {
  note: "border-destructive",
  warning: "border-warning",
};

export default function HelpCallout({ tone, body }) {
  if (!body?.trim()) return null;

  return (
    <aside className={cn("max-w-[62ch] border-l-2 py-0.5 pl-[17px]", TONES[tone] ?? TONES.note)}>
      <p className="font-mono text-[13px] leading-[1.7] text-fg-muted">{body}</p>
    </aside>
  );
}
