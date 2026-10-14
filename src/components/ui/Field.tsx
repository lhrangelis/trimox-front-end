"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./Icon";

const control =
  "min-h-11 w-full rounded-[10px] border border-disabled bg-surface px-3 font-normal text-graphite placeholder:text-muted/80 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

type FieldShell = { label: ReactNode; hint?: ReactNode; className?: string };

function Shell({ id, label, hint, className, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {children}
      {hint && (
        <span id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </span>
      )}
    </div>
  );
}

export function TextField({ label, hint, className, large, ...input }: FieldShell & { large?: boolean } & ComponentProps<"input">) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} className={className}>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(control, large && "min-h-12 rounded-xl border-line-strong px-3.5")}
        {...input}
      />
    </Shell>
  );
}

export function TextArea({ label, hint, className, ...rest }: FieldShell & ComponentProps<"textarea">) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} className={className}>
      <textarea
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(control, "resize-y py-3 leading-normal")}
        {...rest}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  hint,
  className,
  options,
  ...rest
}: FieldShell & ComponentProps<"select"> & { options: string[] }) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} className={className}>
      <select id={id} className={cn(control, "px-2.5")} {...rest}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Shell>
  );
}

/** Senha com botão Mostrar/Ocultar. */
export function PasswordField({
  label,
  hint,
  className,
  labelAction,
  ...input
}: FieldShell & ComponentProps<"input"> & { labelAction?: ReactNode }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        {labelAction}
      </div>
      <span className="flex min-h-12 items-center rounded-xl border border-line-strong bg-surface pl-3.5 pr-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="min-w-0 flex-1 bg-transparent outline-none"
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className="min-h-10 cursor-pointer px-2.5 text-[13px] font-semibold text-brand"
        >
          {visible ? "Ocultar" : "Mostrar"}
          <span className="sr-only"> senha</span>
        </button>
      </span>
      {hint && (
        <span id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </span>
      )}
    </div>
  );
}

export function SearchField({ label, className, ...input }: { label: string; className?: string } & ComponentProps<"input">) {
  return (
    <label
      className={cn(
        "flex min-h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-3 focus-within:border-brand",
        className,
      )}
    >
      <Icon name="search" size={18} strokeWidth={2} className="flex-none text-muted" />
      <span className="sr-only">{label}</span>
      <input type="search" className="min-w-0 flex-1 bg-transparent outline-none" {...input} />
    </label>
  );
}
