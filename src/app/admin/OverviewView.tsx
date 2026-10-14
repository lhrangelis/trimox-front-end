"use client";

import Link from "next/link";
import { useState } from "react";
import { GroupedBars, LineChart } from "@/components/charts/Charts";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Meter, PageHeader, Panel, PanelTitle, StatCard, StatGrid } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import {
  ALERTS,
  MRR,
  MRR_BY_PLAN,
  MRR_HISTORY,
  MRR_SEPTEMBER,
  PAYING,
  SIGNUP_FLOW,
  SIGNUPS_TODAY,
  TRIALS,
} from "@/lib/data/admin";
import { brl, cn, num, pct } from "@/lib/format";

const ALERT_STYLE = {
  danger: "bg-danger-bg text-danger-fg",
  warning: "bg-warn-bg text-warn-fg",
  info: "bg-info-bg text-info-fg",
} as const;

export function OverviewView() {
  const [active, setActive] = useState(MRR_HISTORY.length - 1);
  const point = MRR_HISTORY[active];
  const prev = active > 0 ? MRR_HISTORY[active - 1].value : null;
  const growth = prev ? ` · ${pct((point.value / prev - 1) * 100, 1)} sobre o mês anterior` : "";
  const maxPlan = MRR_BY_PLAN[0].mrr;

  return (
    <>
      <PageHeader title="Bom dia, Luis" subtitle="Trimox em outubro de 2026 · atualizado às 14:20">
        <Button variant="secondary" icon="download">
          Exportar relatório
        </Button>
        <ButtonLink href="/admin/planos#comunicado">Enviar comunicado</ButtonLink>
      </PageHeader>

      <StatGrid label="Indicadores do negócio" min={180}>
        <StatCard dark label="MRR" value={brl(MRR)} hint={<span className="text-mint-on-dark">+{pct((MRR / MRR_SEPTEMBER - 1) * 100, 1)} sobre setembro</span>} />
        <StatCard label="Clientes pagantes" value={num(PAYING)} hint="+72 este mês" />
        <StatCard label="Em teste grátis" value={TRIALS} hint="38% viram pagantes" />
        <StatCard label="Churn mensal" value="2,1%" hint="28 cancelamentos em setembro" />
        <StatCard label="Ticket médio (ARPA)" value={brl(Math.round(MRR / PAYING))} hint="por cliente/mês" />
        <StatCard label="ARR" value={`R$ ${((MRR * 12) / 1e6).toFixed(2).replace(".", ",")} mi`} hint="receita anual recorrente" />
      </StatGrid>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel aria-label="Evolução do MRR" className="flex flex-col gap-3.5 px-[22px] py-5 xl:col-span-2">
          <PanelTitle
            title="Receita recorrente mensal (MRR)"
            subtitle={
              <span className="text-[15px] text-graphite" aria-live="polite">
                <strong className="font-bold">{brl(point.value)}</strong>{" "}
                <span className="text-muted">
                  · {point.full}
                  {growth}
                </span>
              </span>
            }
          >
            <span className="text-[13px] text-muted">Últimos 12 meses · passe o mouse ou use Tab nos pontos</span>
          </PanelTitle>
          <LineChart
            data={MRR_HISTORY}
            max={200000}
            active={active}
            onActive={setActive}
            format={brl}
            ticks={["200 mil", "150 mil", "100 mil", "50 mil", "0"]}
          />
        </Panel>

        <Panel aria-label="Novos clientes e cancelamentos" className="flex flex-col gap-3 px-[22px] py-5">
          <PanelTitle title="Novos pagantes e cancelamentos" subtitle="Por mês, maio a setembro" />
          <GroupedBars
            height={190}
            max={160}
            series={[
              { name: "Novos", className: "bg-chart-positive" },
              { name: "Cancelados", className: "bg-chart-amber" },
            ]}
            data={SIGNUP_FLOW.map((m) => ({ label: m.month, values: [m.fresh, m.churned] }))}
          />
        </Panel>

        <Panel aria-label="Base de clientes" className="flex flex-col gap-4 px-[22px] py-5">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-lg font-bold tracking-[-0.02em]">MRR por plano</h2>
            {MRR_BY_PLAN.map((p) => (
              <div key={p.plan.id} className="grid grid-cols-[70px_minmax(0,1fr)_150px] items-center gap-3">
                <strong className="font-semibold">{p.plan.name}</strong>
                <Meter value={p.mrr} max={maxPlan} className="h-3.5 bg-linen" />
                <span className="text-right">
                  {brl(p.mrr)} <span className="text-muted">· {num(p.clients)}</span>
                </span>
              </div>
            ))}
          </div>
          <BusinessMix />
          <div className="flex flex-col gap-1">
            <h2 className="mb-1 text-lg font-bold tracking-[-0.02em]">Uso da plataforma · 30 dias</h2>
            <dl>
              {[
                ["Agendamentos processados", "386 mil"],
                ["Feitos pelo link online", "57%"],
                ["Lembretes de WhatsApp enviados", "1,1 mi"],
              ].map(([k, v]) => (
                <div key={k} className="flex min-h-8 items-center justify-between border-b border-line-soft last:border-0">
                  <dt className="text-body">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Panel>

        <Panel aria-label="Contas que precisam de atenção" className="flex flex-col gap-2 px-[22px] py-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Precisam de atenção</h2>
            <Link href="/admin/clientes" className="flex min-h-11 items-center font-semibold">
              Ver todos
            </Link>
          </div>
          <ul>
            {ALERTS.map((a) => {
              return (
                <li key={a.account} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft py-2.5">
                  <span className={cn("flex size-8 items-center justify-center rounded-lg", ALERT_STYLE[a.tone])}>
                    <Icon name={a.icon} size={16} strokeWidth={2} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <strong className="font-semibold">{a.account}</strong>
                    <span className="text-[13px] text-muted">
                      {a.kind} · {a.why}
                    </span>
                  </span>
                  <Link href="/admin/clientes" className="text-[13px] font-semibold">
                    Abrir<span className="sr-only"> {a.account}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel aria-label="Novos cadastros" className="flex flex-col gap-2 px-[22px] py-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Cadastros de hoje</h2>
            <span className="text-[13px] text-muted">18 até agora</span>
          </div>
          <ul>
            {SIGNUPS_TODAY.map((s) => (
              <li key={s.name} className="grid min-h-12 grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft">
                <span className="text-muted">{s.time}</span>
                <span className="flex min-w-0 flex-col">
                  <strong className="font-semibold">{s.name}</strong>
                  <span className="text-[13px] text-muted">{s.city}</span>
                </span>
                <Badge tone="info">Teste</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function BusinessMix() {
  const barbearias = 862;
  const saloes = PAYING - barbearias;
  const share = Math.round((barbearias / PAYING) * 100);
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold tracking-[-0.02em]">Tipo de negócio</h2>
      <div className="flex h-3.5 gap-0.5" aria-hidden="true">
        <span className="rounded-l bg-chart-positive" style={{ width: `${share}%` }} />
        <span className="rounded-r bg-chart-amber" style={{ width: `${100 - share}%` }} />
      </div>
      <div className="flex justify-between text-[13px]">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-chart-positive" />
          Barbearias · {num(barbearias)} ({share}%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-chart-amber" />
          Salões · {num(saloes)} ({100 - share}%)
        </span>
      </div>
    </div>
  );
}
