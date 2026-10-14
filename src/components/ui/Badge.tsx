import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export type Tone = "success" | "neutral" | "muted" | "warning" | "info" | "danger" | "dark" | "brass";

const tones: Record<Tone, string> = {
  success: "bg-sage text-brand-ink border-sage",
  neutral: "bg-chip text-graphite border-chip",
  muted: "bg-sand text-muted border-sand",
  // Estados que pedem ação usam borda tracejada além da cor (não dependem só da cor).
  warning: "bg-warn-bg text-warn-fg border-warn-bd border-dashed",
  info: "bg-info-bg text-info-fg border-info-bg",
  danger: "bg-danger-bg text-danger-fg border-danger border-dashed",
  dark: "bg-graphite text-linen border-graphite",
  brass: "bg-brass text-graphite border-brass font-bold",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 justify-self-start whitespace-nowrap rounded-full border px-2.5 py-[3px] text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
