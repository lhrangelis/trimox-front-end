"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PageHeader, Panel } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { OPENING_HOURS, WEEKDAYS, type Weekday } from "@/lib/data/business";
import { PERMISSIONS, TEAM, type Permission, type ProId } from "@/lib/data/team";
import { brl, cn } from "@/lib/format";

export function TeamView() {
  const [selectedId, setSelectedId] = useState<ProId>("bruno");
  // Ajustes locais por profissional (sem back-end ainda).
  const [workDays, setWorkDays] = useState<Record<string, boolean>>({});
  const [perms, setPerms] = useState<Record<string, boolean>>({});

  const sel = TEAM.find((p) => p.id === selectedId)!;
  const works = (day: Weekday) => workDays[`${sel.id}-${day}`] ?? sel.week[day] !== null;
  const hasPerm = (perm: Permission) => perms[`${sel.id}-${perm}`] ?? sel.permissions[perm];

  return (
    <>
      <PageHeader title="Profissionais" subtitle={`${TEAM.length} pessoas na equipe · selecione alguém para ver horários, serviços e acessos`}>
        <Button icon="plus">Convidar profissional</Button>
      </PageHeader>

      <section aria-label="Equipe" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {TEAM.map((p) => {
          const on = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelectedId(p.id)}
              className={cn(
                "flex cursor-pointer flex-col gap-3.5 rounded-2xl border-[1.5px] bg-surface p-[18px] text-left",
                on ? "border-brand" : "border-line hover:border-line-strong",
              )}
            >
              <span className="flex items-center gap-3">
                <Avatar name={p.name} initials={p.initials} size={48} tone={on ? "brand" : "sand"} />
                <span className="flex min-w-0 flex-col gap-px">
                  <strong className="text-base font-bold">{p.name}</strong>
                  <span className="text-xs text-muted">{p.role}</span>
                </span>
              </span>
              <span className="flex w-full flex-col gap-1.5">
                <span className="flex justify-between text-[13px]">
                  <span className="text-muted">Ocupação hoje</span>
                  <strong className="font-semibold">{p.occupancyToday}%</strong>
                </span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-sand" aria-hidden="true">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${p.occupancyToday}%` }} />
                </span>
              </span>
              <span className="grid w-full grid-cols-2 gap-2 text-[13px]">
                <span className="flex flex-col">
                  <span className="text-muted">Faturado em outubro</span>
                  <strong className="text-[15px] font-bold">{brl(p.revenueMonth)}</strong>
                </span>
                <span className="flex flex-col">
                  <span className="text-muted">Comissão</span>
                  <strong className="text-[15px] font-bold">{p.commission === null ? "Sem comissão" : `${p.commission}%`}</strong>
                </span>
              </span>
            </button>
          );
        })}
      </section>

      <section aria-label="Detalhes do profissional" className="flex flex-wrap items-start gap-5">
        <Panel className="flex min-w-0 flex-[999_1_460px] flex-col gap-3.5 p-[22px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Horário de trabalho · {sel.first}</h2>
            <span className="text-[13px] text-muted">Os horários livres aparecem no link de agendamento</span>
          </div>
          <ul>
            {WEEKDAYS.map((day) => {
              const on = works(day);
              const business = OPENING_HOURS[day];
              const hours = sel.week[day] ?? business ?? { open: "09:00", close: "18:00" };
              return (
                <li key={day} className="grid min-h-[52px] grid-cols-[110px_64px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 border-b border-line-soft">
                  <strong className="font-semibold">{day}</strong>
                  <Switch
                    checked={on}
                    onChange={(v) => setWorkDays((w) => ({ ...w, [`${sel.id}-${day}`]: v }))}
                    label={`${sel.first} trabalha ${day.toLowerCase()}`}
                  />
                  <span className={on ? "text-graphite" : "text-muted"}>
                    {!on ? "Folga" : business ? `${hours.open} – ${hours.close}` : "Casa fechada"}
                  </span>
                  <span className="text-[13px] text-muted">{on && business ? "Pausa 12:00 – 13:00" : ""}</span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
          <Panel className="flex flex-col gap-3 p-[22px]">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Serviços que realiza</h2>
            <ul className="flex flex-wrap gap-2">
              {sel.services.map((s) => (
                <li key={s} className="rounded-full bg-chip px-3 py-1.5 text-[13px]">
                  {s}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="flex flex-col gap-1.5 p-[22px]">
            <h2 className="mb-1.5 text-lg font-bold tracking-[-0.02em]">O que pode ver e fazer</h2>
            {PERMISSIONS.map((perm) => (
              <div key={perm.id} className="flex min-h-11 items-center justify-between gap-3">
                <span>{perm.label}</span>
                <Switch
                  checked={hasPerm(perm.id)}
                  onChange={(v) => setPerms((p) => ({ ...p, [`${sel.id}-${perm.id}`]: v }))}
                  label={`${perm.label} (${sel.first})`}
                />
              </div>
            ))}
          </Panel>
        </div>
      </section>
    </>
  );
}
