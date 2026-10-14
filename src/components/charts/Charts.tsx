"use client";

import { cn } from "@/lib/format";

export type Point = { short: string; full: string; value: number };

/**
 * Barras verticais. Cada barra é um botão: mouse, foco e toque atualizam a leitura
 * (no design original só havia mouseenter, inacessível pelo teclado).
 */
export function BarChart({
  data,
  max,
  active,
  onActive,
  format,
  ticks,
  gap = 10,
  showTick = () => true,
  height = 220,
}: {
  data: Point[];
  max: number;
  active: number;
  onActive: (i: number) => void;
  format: (v: number) => string;
  ticks: string[];
  gap?: number;
  showTick?: (i: number) => boolean;
  height?: number;
}) {
  return (
    <div className="flex gap-2.5 overflow-x-auto">
      <div aria-hidden="true" className="flex min-w-11 flex-col justify-between text-right text-[11px] text-muted" style={{ height }}>
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="flex min-w-[420px] flex-1 flex-col gap-1.5">
        <div
          className="flex items-end border-b border-disabled bg-[linear-gradient(to_bottom,var(--color-line-soft)_1px,transparent_1px)]"
          style={{ height, gap, backgroundSize: `100% ${height / (ticks.length - 1)}px` }}
        >
          {data.map((d, i) => (
            <button
              key={d.full}
              type="button"
              aria-label={`${d.full}: ${format(d.value)}`}
              aria-pressed={i === active}
              onMouseEnter={() => onActive(i)}
              onFocus={() => onActive(i)}
              onClick={() => onActive(i)}
              className="flex h-full flex-1 cursor-pointer items-end"
            >
              <span
                className={cn("block w-full rounded-t", i === active ? "bg-graphite" : "bg-brand")}
                style={{ height: `${Math.min(100, (d.value / max) * 100)}%` }}
              />
            </button>
          ))}
        </div>
        <div aria-hidden="true" className="flex text-[11px] text-muted" style={{ gap }}>
          {data.map((d, i) => (
            <span key={d.full} className="flex-1 whitespace-nowrap text-center">
              {showTick(i) ? d.short : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Barras agrupadas (duas séries) com valores escritos — legível sem interação. */
export function GroupedBars({
  data,
  series,
  max,
  height = 200,
}: {
  data: { label: string; values: number[] }[];
  series: { name: string; className: string }[];
  max: number;
  height?: number;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <ul aria-label="Legenda" className="flex gap-3.5 self-end text-xs text-body">
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-[3px]", s.className)} />
            {s.name}
          </li>
        ))}
      </ul>
      <div className="flex items-end gap-4 border-b border-disabled" style={{ height }}>
        {data.map((d) => (
          <div
            key={d.label}
            role="img"
            aria-label={`${d.label}: ${d.values.map((v, i) => `${series[i].name.toLowerCase()} ${v}`).join(", ")}`}
            className="flex h-full flex-1 items-end justify-center gap-0.5"
          >
            {d.values.map((v, i) => (
              <div key={i} aria-hidden="true" className="flex h-full max-w-[30px] flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[11px] text-body">{v}</span>
                <span className={cn("block w-full rounded-t", series[i].className)} style={{ height: `${(v / max) * 88}%` }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="flex gap-4 text-[11px] text-muted">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center">
            {d.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

/** Linha com área preenchida e pontos focáveis. */
export function LineChart({
  data,
  max,
  active,
  onActive,
  format,
  ticks,
  height = 240,
}: {
  data: Point[];
  max: number;
  active: number;
  onActive: (i: number) => void;
  format: (v: number) => string;
  ticks: string[];
  height?: number;
}) {
  const n = data.length;
  const pts = data.map((d, i) => ({ x: (i / (n - 1)) * 100, y: (1 - d.value / max) * 100 }));
  const line = pts.map((p) => `${(p.x * 10).toFixed(1)},${(p.y * 3).toFixed(1)}`).join(" ");
  const zone = 100 / (n - 1);

  return (
    <div className="flex gap-2.5">
      <div aria-hidden="true" className="flex min-w-[52px] flex-col justify-between text-right text-[11px] text-muted" style={{ height }}>
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div
          className="relative border-b border-disabled bg-[linear-gradient(to_bottom,var(--color-line-soft)_1px,transparent_1px)]"
          style={{ height, backgroundSize: `100% ${height / (ticks.length - 1)}px` }}
        >
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full">
            <polygon points={`0,300 ${line} 1000,300`} className="fill-sage opacity-70" />
            <polyline points={line} fill="none" className="stroke-brand" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>
          {data.map((d, i) => {
            const on = i === active;
            const left = Math.max(0, pts[i].x - zone / 2);
            const width = i === 0 || i === n - 1 ? zone / 2 : zone;
            return (
              <button
                key={d.full}
                type="button"
                aria-label={`${d.full}: ${format(d.value)}`}
                aria-pressed={on}
                onMouseEnter={() => onActive(i)}
                onFocus={() => onActive(i)}
                onClick={() => onActive(i)}
                className="absolute inset-y-0 cursor-pointer"
                style={{ left: `${left}%`, width: `${width}%` }}
              >
                <span
                  aria-hidden="true"
                  className={cn("absolute rounded-full border-2 border-white", on ? "size-3.5 bg-graphite" : "size-2.5 bg-brand")}
                  style={{ left: `${((pts[i].x - left) / width) * 100}%`, top: `${pts[i].y}%`, transform: "translate(-50%, -50%)" }}
                />
              </button>
            );
          })}
        </div>
        <div aria-hidden="true" className="relative h-4 text-[11px] text-muted">
          {data.map((d, i) => (
            <span key={d.full} className="absolute -translate-x-1/2" style={{ left: `${pts[i].x}%` }}>
              {d.short}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
