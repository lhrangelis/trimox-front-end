"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/format";

export type Option<T extends string | number> = { value: T; label: string; count?: number };

/**
 * Teclas de seta movem a seleção entre opções (padrão WAI-ARIA para grupos de rádio).
 */
function useArrowKeys<T extends string | number>(options: Option<T>[], value: T, onChange: (v: T) => void) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  function onKeyDown(e: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const i = options.findIndex((o) => o.value === value);
    const delta = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
    const next = (i + delta + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }
  return { refs, onKeyDown };
}

/** Controle segmentado (Dia/Semana/Mês, períodos). Uma opção sempre selecionada. */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  size = "md",
  tone = "light",
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
}) {
  const { refs, onKeyDown } = useArrowKeys(options, value, onChange);
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="inline-flex gap-0.5 self-start rounded-[10px] bg-sand p-[3px]">
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              "cursor-pointer rounded-lg px-3.5",
              size === "sm" ? "min-h-9 text-[13px]" : "min-h-[38px]",
              on && tone === "light" && "bg-surface font-semibold shadow-[0_1px_2px_rgba(21,23,26,0.08)]",
              on && tone === "dark" && "bg-graphite font-semibold text-linen",
              !on && "text-body",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Pílulas de filtro com contagem (Todos 12 · Frequentes 5…). */
export function FilterChips<T extends string | number>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const { refs, onKeyDown } = useArrowKeys(options, value, onChange);
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full border font-semibold",
              size === "sm" ? "min-h-9 px-3 text-[13px]" : "min-h-10 px-3.5",
              on ? "border-graphite bg-graphite text-linen" : "border-line bg-surface text-graphite hover:border-line-strong",
            )}
          >
            {o.label}
            {o.count !== undefined && <span className="text-xs font-medium opacity-75">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
