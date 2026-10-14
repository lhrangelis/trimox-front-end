"use client";

import { cn } from "@/lib/format";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Nome acessível. Use quando não houver texto visível associado. */
  label?: string;
  labelledBy?: string;
  className?: string;
};

/** Interruptor liga/desliga com a semântica correta (`role="switch"`). */
export function Switch({ checked, onChange, label, labelledBy, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[26px] w-11 flex-none cursor-pointer items-center rounded-full p-[3px] transition-colors",
        checked ? "bg-brand" : "bg-line-strong",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-5 rounded-full bg-white shadow-[0_1px_2px_rgba(21,23,26,0.2)] transition-transform",
          checked && "translate-x-[18px]",
        )}
      />
    </button>
  );
}

/** Linha com título, dica e interruptor — padrão das telas de configuração. */
export function SwitchRow({
  id,
  label,
  hint,
  checked,
  onChange,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-[52px] items-center justify-between gap-4 border-b border-line-soft py-2", className)}>
      <span className="flex flex-col gap-0.5">
        <strong id={id} className="font-semibold">
          {label}
        </strong>
        {hint && <span className="text-[13px] text-muted">{hint}</span>}
      </span>
      <Switch checked={checked} onChange={onChange} labelledBy={id} />
    </div>
  );
}
