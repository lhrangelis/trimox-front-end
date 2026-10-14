"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS } from "@/lib/data/business";
import { serviceById } from "@/lib/data/services";
import { brl, cn } from "@/lib/format";

const PROS = [
  { id: "any", name: "Qualquer um", initials: "Todos" },
  { id: "rafael", name: "Rafael", initials: "RS" },
  { id: "bruno", name: "Bruno", initials: "BL" },
];

const DAYS = [
  { wd: "Qua", label: "quarta", n: 14 },
  { wd: "Qui", label: "quinta", n: 15 },
  { wd: "Sex", label: "sexta", n: 16 },
  { wd: "Sáb", label: "sábado", n: 17 },
  { wd: "Seg", label: "segunda", n: 19 },
];

/** Horários livres por dia (mock). Com API, viriam filtrados por profissional. */
const SLOTS = [
  ["09:00", "09:45", "10:30", "11:15", "13:00", "13:45", "14:30", "15:30", "16:15", "17:00", "17:45", "18:30"],
  ["09:30", "10:15", "11:00", "13:30", "14:15", "15:00", "16:30", "17:15"],
  ["09:00", "10:30", "11:15", "14:00", "15:30", "16:15", "18:00", "18:45"],
  ["08:30", "09:15", "12:00", "15:45", "16:30"],
  ["10:00", "10:45", "11:30", "13:00", "14:30", "15:15", "16:00", "17:30"],
];

const heading = "eyebrow text-[13px]";

export function BookingFlow() {
  const service = serviceById("corte-barba");
  const [pro, setPro] = useState("any");
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>("15:30");
  const [done, setDone] = useState(false);

  const d = DAYS[day];
  const proName = pro === "any" ? "qualquer profissional" : PROS.find((p) => p.id === pro)!.name;
  const summary = slot ? `${d.wd}, ${d.n} de out · ${slot} · ${proName}` : "Escolha um horário";

  if (done && slot) {
    return (
      <div className="flex w-full max-w-[420px] flex-col gap-6 bg-linen px-5 py-10 sm:rounded-3xl" role="status">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand text-white">
          <Icon name="check" size={30} strokeWidth={2.4} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold tracking-[-0.03em]">Horário agendado!</h1>
          <p className="text-body">
            {service.name} em {BUSINESS.name}, {d.label} {d.n} de outubro às {slot}, com {proName}.
          </p>
        </div>
        <p className="rounded-xl bg-sage px-4 py-3.5 text-sm text-brand-ink">
          Você vai receber a confirmação e um lembrete no WhatsApp 24 horas antes.
        </p>
        <Button variant="secondary" size="xl" onClick={() => setDone(false)}>
          Agendar outro horário
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col bg-linen text-[15px] sm:overflow-hidden sm:rounded-3xl sm:shadow-[0_30px_60px_-30px_rgba(21,23,26,0.35)]">
      <div className="flex flex-1 flex-col gap-[22px] px-5 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Voltar"
            className="flex size-11 flex-none items-center justify-center rounded-xl border border-line bg-surface text-graphite"
          >
            <Icon name="chevronLeft" size={18} strokeWidth={2} />
          </Link>
          <LogoMark size={44} background="var(--color-graphite)" />
          <span className="flex min-w-0 flex-col">
            <h1 className="text-base font-bold">{BUSINESS.name}</h1>
            <span className="text-[13px] text-muted">{BUSINESS.addressShort}</span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[14px] border border-line bg-surface px-4 py-3.5">
          <span className="flex flex-col gap-0.5">
            <span className="text-xs text-muted">Serviço</span>
            <strong className="font-semibold">{service.name}</strong>
            <span className="text-[13px] text-muted">
              {service.minutes} min · {brl(service.price)}
            </span>
          </span>
          <button type="button" className="flex min-h-11 cursor-pointer items-center px-1 text-sm font-semibold text-brand">
            Trocar
          </button>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className={cn(heading, "mb-3")}>Profissional</legend>
          <div className="grid grid-cols-3 gap-2.5">
            {PROS.map((p) => {
              const on = pro === p.id;
              return (
                <label
                  key={p.id}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-[14px] border-[1.5px] px-1.5 py-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand",
                    on ? "border-brand bg-mint" : "border-line bg-surface",
                  )}
                >
                  <input
                    type="radio"
                    name="profissional"
                    className="sr-only"
                    checked={on}
                    onChange={() => {
                      setPro(p.id);
                      setSlot(null);
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className={cn("flex size-11 items-center justify-center rounded-full text-[13px] font-semibold", on ? "bg-brand text-linen" : "bg-sand")}
                  >
                    {p.initials}
                  </span>
                  <span className="text-[13px] font-semibold">{p.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className={cn(heading, "mb-3")}>Outubro</legend>
          <div className="grid grid-cols-5 gap-2">
            {DAYS.map((x, i) => {
              const on = day === i;
              return (
                <label
                  key={x.n}
                  className={cn(
                    "flex min-h-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand",
                    on ? "border-graphite bg-graphite text-linen" : "border-line bg-surface",
                  )}
                >
                  <input
                    type="radio"
                    name="dia"
                    className="sr-only"
                    checked={on}
                    aria-label={`${x.label}, ${x.n} de outubro`}
                    onChange={() => {
                      setDay(i);
                      setSlot(null);
                    }}
                  />
                  <span aria-hidden="true" className="text-xs opacity-80">
                    {x.wd}
                  </span>
                  <strong aria-hidden="true" className="text-lg font-bold">
                    {x.n}
                  </strong>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className={cn(heading, "mb-3")}>Horários livres</legend>
          <div className="tabular grid grid-cols-4 gap-2">
            {SLOTS[day].map((t) => {
              const on = slot === t;
              return (
                <label
                  key={t}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] border text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand",
                    on ? "border-brand bg-brand text-white" : "border-line bg-surface",
                  )}
                >
                  <input type="radio" name="horario" className="sr-only" checked={on} onChange={() => setSlot(t)} />
                  {t}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2.5 border-t border-line bg-surface px-5 pb-[18px] pt-3.5">
        <div className="flex items-baseline justify-between gap-3 text-sm" aria-live="polite">
          <span className="text-body">{summary}</span>
          <strong className="font-bold">{brl(service.price)}</strong>
        </div>
        <Button size="xl" className="rounded-[14px] font-bold" disabled={!slot} onClick={() => setDone(true)}>
          Confirmar agendamento
        </Button>
        <span className="flex items-center justify-center gap-1.5 text-xs text-muted">
          Agendado com <LogoMark size={14} />
          <Wordmark className="text-xs text-graphite" />
        </span>
      </div>
    </div>
  );
}
