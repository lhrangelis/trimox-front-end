"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button, IconButton } from "@/components/ui/Button";
import { StatCard, StatGrid } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Choice";
import { SearchField } from "@/components/ui/Field";
import { AGENDA_SUMMARY, APPOINTMENTS, NOW_HOUR, STATUS_LABEL, type AppointmentStatus } from "@/lib/data/agenda";
import { BUSINESS, OPENING_HOURS } from "@/lib/data/business";
import { TEAM } from "@/lib/data/team";
import { brl, cn, hourToLabel } from "@/lib/format";

const HOUR_PX = 60;
const hours = OPENING_HOURS[BUSINESS.today.weekday as "Terça"]!;
const FIRST = parseInt(hours.open);
const LAST = parseInt(hours.close);
const HOURS = Array.from({ length: LAST - FIRST }, (_, i) => FIRST + i);

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  done: "bg-chip text-done border-line",
  now: "bg-brand text-linen border-brand",
  confirmed: "bg-sage text-brand-ink border-sage-line",
  pending: "bg-warn-bg text-warn-fg border-warn-bd border-dashed",
};

const LEGEND: AppointmentStatus[] = ["done", "now", "confirmed", "pending"];

export function AgendaView() {
  const [view, setView] = useState<"dia" | "semana" | "mes">("dia");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const total = APPOINTMENTS.length;
  const pending = APPOINTMENTS.filter((a) => a.status === "pending").length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-[28px] font-bold tracking-[-0.03em]">Agenda</h1>
          <div className="flex items-center gap-1">
            <IconButton icon="chevronLeft" label="Dia anterior" />
            <IconButton icon="chevronRight" label="Próximo dia" />
            <span className="ml-2 text-base font-semibold">
              {BUSINESS.today.weekday}, {BUSINESS.today.day} de {BUSINESS.today.month}
            </span>
            <Button variant="secondary" size="sm" className="ml-2 rounded-full">
              Hoje
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Segmented
            label="Visualização"
            value={view}
            onChange={setView}
            options={[
              { value: "dia", label: "Dia" },
              { value: "semana", label: "Semana" },
              { value: "mes", label: "Mês" },
            ]}
          />
          <SearchField label="Buscar cliente" placeholder="Buscar cliente" value={query} onChange={(e) => setQuery(e.target.value)} className="w-[220px]" />
          <Button icon="plus">Novo agendamento</Button>
        </div>
      </div>

      <StatGrid label="Resumo do dia">
        <StatCard label="Agendamentos hoje" value={total} hint={`${pending} aguardando confirmação`} />
        <StatCard label="Faturamento previsto" value={brl(AGENDA_SUMMARY.expectedRevenue)} hint={`${brl(AGENDA_SUMMARY.receivedRevenue)} já recebidos no caixa`} />
        <StatCard label="Ocupação da equipe" value={`${AGENDA_SUMMARY.occupancy}%`}>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand" aria-hidden="true">
            <div className="h-full rounded-full bg-brand" style={{ width: `${AGENDA_SUMMARY.occupancy}%` }} />
          </div>
        </StatCard>
        <StatCard label="Lembretes enviados" value={`${AGENDA_SUMMARY.remindersSent} de ${total}`} hint="via WhatsApp, 24h antes" />
      </StatGrid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-muted">
          {TEAM.length} profissionais · expediente {hours.open}–{hours.close}
        </span>
        <ul aria-label="Legenda" className="flex flex-wrap gap-4 text-xs text-body">
          {LEGEND.map((s) => (
            <li key={s} className="flex items-center gap-1.5">
              <span className={cn("size-3 rounded border", STATUS_STYLE[s])} />
              {STATUS_LABEL[s]}
            </li>
          ))}
        </ul>
      </div>

      {view !== "dia" ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-10 text-center text-muted">
          A visualização por {view === "semana" ? "semana" : "mês"} entra junto com a integração da API de agenda.
        </div>
      ) : (
        <section aria-label="Agenda por profissional" className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[64px_repeat(4,minmax(0,1fr))] border-b border-line">
              <div />
              {TEAM.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 border-l border-line-soft px-3 py-3.5">
                  <Avatar name={p.name} initials={p.initials} size={32} tone={p.avatarTone} />
                  <span className="flex min-w-0 flex-col gap-px">
                    <strong className="whitespace-nowrap font-semibold">{p.name}</strong>
                    <span className="text-xs text-muted">{APPOINTMENTS.filter((a) => a.pro === p.id).length} atendimentos</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="tabular relative grid grid-cols-[64px_repeat(4,minmax(0,1fr))]">
              <div className="flex flex-col" aria-hidden="true">
                {HOURS.map((h) => (
                  <div key={h} className="pr-2.5 pt-1 text-right text-xs text-muted" style={{ height: HOUR_PX }}>
                    {hourToLabel(h)}
                  </div>
                ))}
              </div>
              {TEAM.map((p) => (
                <ol
                  key={p.id}
                  aria-label={`Agenda de ${p.name}`}
                  className="relative border-l border-line-soft bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_59px,var(--color-line-soft)_59px,var(--color-line-soft)_60px)]"
                  style={{ height: HOURS.length * HOUR_PX }}
                >
                  {APPOINTMENTS.filter((a) => a.pro === p.id).map((a) => {
                    const compact = a.minutes <= 30;
                    const match = !q || a.client.toLowerCase().includes(q);
                    const range = `${hourToLabel(a.start)} – ${hourToLabel(a.start + a.minutes / 60)}`;
                    return (
                      <li
                        key={a.start}
                        title={`${range} · ${a.client} · ${a.service} · ${STATUS_LABEL[a.status]}`}
                        className={cn(
                          "absolute inset-x-1.5 flex flex-col gap-px overflow-hidden rounded-[9px] border px-2.5 text-xs leading-[1.3] transition-opacity",
                          compact ? "py-[5px]" : "py-[7px]",
                          STATUS_STYLE[a.status],
                          !match && "opacity-25",
                        )}
                        style={{ top: (a.start - FIRST) * HOUR_PX + 2, height: (a.minutes / 60) * HOUR_PX - 4 }}
                      >
                        <span className="sr-only">
                          {range}, {a.client}, {a.service}, {STATUS_LABEL[a.status]}
                        </span>
                        {compact ? (
                          <span aria-hidden="true" className="truncate">
                            <strong className="font-semibold">{a.client}</strong> · {hourToLabel(a.start)}
                          </span>
                        ) : (
                          <span aria-hidden="true" className="flex flex-col gap-px">
                            <span className="text-[11px] opacity-85">{range}</span>
                            <strong className="truncate font-semibold">{a.client}</strong>
                            <span className="truncate">{a.service}</span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              ))}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[58px] right-0 flex h-0.5 items-center bg-danger"
                style={{ top: (NOW_HOUR - FIRST) * HOUR_PX }}
              >
                <span className="-ml-px size-2.5 rounded-full bg-danger" />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
