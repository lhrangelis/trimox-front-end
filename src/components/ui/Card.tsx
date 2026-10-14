import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

/** Superfície branca com borda — o "cartão" padrão do app. */
export function Panel({ className, children, ...rest }: ComponentProps<"section">) {
  return (
    <section className={cn("relative rounded-2xl border border-line bg-surface", className)} {...rest}>
      {children}
    </section>
  );
}

export function PanelTitle({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-bold tracking-[-0.02em]">{title}</h2>
        {subtitle && <p className="text-[13px] text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/** Indicador numérico (KPI). `dark` destaca o principal da linha. */
export function StatCard({
  label,
  value,
  hint,
  dark,
  children,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-[14px] px-[18px] py-4",
        dark ? "bg-graphite text-linen" : "border border-line bg-surface",
      )}
    >
      <span className={cn("text-[13px]", dark ? "text-on-dark" : "text-muted")}>{label}</span>
      <strong className="tabular whitespace-nowrap text-[26px] font-bold leading-tight tracking-[-0.03em]">{value}</strong>
      {hint && <span className={cn("text-xs", dark ? "text-on-dark-muted" : "text-muted")}>{hint}</span>}
      {children}
    </div>
  );
}

export function StatGrid({ children, min = 200, label }: { children: ReactNode; min?: number; label: string }) {
  return (
    <section
      aria-label={label}
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))` }}
    >
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  badge,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-3.5">
          <h1 className="text-[28px] font-bold tracking-[-0.03em]">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}

/** Barra horizontal proporcional (rankings, formas de pagamento). */
export function Meter({ value, max = 100, className, color = "bg-brand" }: { value: number; max?: number; className?: string; color?: string }) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span aria-hidden="true" className={cn("block h-2.5 overflow-hidden rounded bg-line-soft", className)}>
      <span className={cn("block h-full rounded-r", color)} style={{ width: `${width}%` }} />
    </span>
  );
}
