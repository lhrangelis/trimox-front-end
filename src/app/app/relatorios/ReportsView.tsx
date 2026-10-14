"use client";

import { useState } from "react";
import { BarChart, GroupedBars } from "@/components/charts/Charts";
import { Button } from "@/components/ui/Button";
import { Meter, PageHeader, Panel, PanelTitle, StatCard, StatGrid } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Choice";
import { CLIENT_MIX, MONTHLY_REVENUE, TEAM_SEPTEMBER, TOP_SERVICES, dailyRevenue, peakHours } from "@/lib/data/finance";
import { brl, cn, num } from "@/lib/format";

const HEAT = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4", "bg-heat-5"];
type Range = "12m" | "30d" | "7d";

// Dados determinísticos: calculados uma vez, fora do componente.
const daily = dailyRevenue();
const heat = peakHours();

export function ReportsView() {
  const [range, setRange] = useState<Range>("12m");
  const [active, setActive] = useState<number | null>(null);
  const [heatText, setHeatText] = useState<string | null>(null);

  const series = range === "12m" ? MONTHLY_REVENUE : range === "30d" ? daily : daily.slice(23).map((d) => ({ ...d, short: d.weekday }));
  // Por padrão destaca o último mês fechado (no 12m) ou o dia atual.
  const current = active ?? (range === "12m" ? series.length - 2 : series.length - 1);
  const max = range === "12m" ? 50000 : 3000;

  const yearTotal = MONTHLY_REVENUE.reduce((a, m) => a + m.value, 0);
  const sept = TEAM_SEPTEMBER.reduce(
    (t, r) => ({ revenue: t.revenue + r.revenue, appointments: t.appointments + r.appointments }),
    { revenue: 0, appointments: 0 },
  );
  const topMax = TOP_SERVICES[0].count;

  return (
    <>
      <PageHeader title="Relatórios" subtitle="Como o negócio está indo, em números">
        <Button variant="secondary" icon="download">
          Exportar planilha
        </Button>
      </PageHeader>

      <StatGrid label="Indicadores">
        <StatCard label="Faturamento · 12 meses" value={`R$ ${(yearTotal / 1000).toFixed(1).replace(".", ",")} mil`} hint="setembro foi o melhor mês: R$ 43,2 mil" />
        <StatCard label="Ticket médio · setembro" value={brl(Math.round(sept.revenue / sept.appointments))} hint={`${sept.appointments} atendimentos no mês`} />
        <StatCard label="Taxa de retorno" value="64%" hint="voltaram em até 60 dias" />
        <StatCard label="Faltas" value="3,1%" hint="19 horários perdidos em setembro" />
      </StatGrid>

      <Panel aria-label="Faturamento" className="flex flex-col gap-3.5 px-[22px] py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Faturamento</h2>
            <p className="text-[15px]" aria-live="polite">
              <strong className="font-bold">{brl(series[current].value)}</strong> <span className="text-muted">· {series[current].full}</span>
            </p>
          </div>
          <Segmented
            label="Período do gráfico"
            size="sm"
            value={range}
            onChange={(r) => {
              setRange(r);
              setActive(null);
            }}
            options={[
              { value: "12m", label: "12 meses" },
              { value: "30d", label: "30 dias" },
              { value: "7d", label: "7 dias" },
            ]}
          />
        </div>
        <BarChart
          data={series}
          max={max}
          active={current}
          onActive={setActive}
          format={brl}
          gap={range === "30d" ? 3 : 10}
          ticks={range === "12m" ? ["50 mil", "25 mil", "0"] : ["3 mil", "1,5 mil", "0"]}
          showTick={(i) => range !== "30d" || i % 5 === 4 || i === series.length - 1}
        />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel aria-label="Serviços mais vendidos" className="flex flex-col gap-3 px-[22px] py-5">
          <PanelTitle title="Serviços mais vendidos" subtitle="Setembro · em número de atendimentos" />
          <ol className="flex flex-col gap-3">
            {TOP_SERVICES.map((s) => (
              <li key={s.name} className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)_40px] items-center gap-3">
                <span className="truncate">{s.name}</span>
                <Meter value={s.count} max={topMax} className="h-3.5 bg-linen" />
                <strong className="text-right font-semibold">{s.count}</strong>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel aria-label="Horários de pico" className="flex flex-col gap-3 px-[22px] py-5">
          <PanelTitle title="Horários de pico" subtitle={<span aria-live="polite">{heatText ?? "Pico aos sábados de manhã e no fim da tarde de sexta"}</span>}>
            <div aria-hidden="true" className="flex items-center gap-1 text-[11px] text-muted">
              menos
              {HEAT.map((c) => (
                <span key={c} className={cn("size-3.5 rounded-[3px]", c)} />
              ))}
              mais
            </div>
          </PanelTitle>
          <table className="w-full table-fixed border-separate border-spacing-[3px] text-[11px] text-muted">
            <caption className="sr-only">Média de atendimentos por dia da semana e hora</caption>
            <thead>
              <tr>
                <td className="w-9" />
                {heat.hours.map((h) => (
                  <th key={h} scope="col" className="text-center font-normal">
                    {h}h
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heat.rows.map((row) => (
                <tr key={row.day}>
                  <th scope="row" className="text-left font-normal">
                    {row.day}
                  </th>
                  {row.cells.map((c) => {
                    const text = `${row.day} às ${c.hour}h · ${c.avg} atendimentos em média`;
                    return (
                      <td
                        key={c.hour}
                        title={text}
                        onMouseEnter={() => setHeatText(text)}
                        className={cn("h-[26px] rounded hover:outline-2 hover:outline-graphite", HEAT[c.level])}
                      >
                        <span className="sr-only">{c.avg}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel aria-label="Clientes novos e recorrentes" className="flex flex-col gap-3 px-[22px] py-5">
          <PanelTitle title="Atendimentos por tipo de cliente" subtitle="Últimos 6 meses · outubro até o dia 13" />
          <GroupedBars
            max={560}
            series={[
              { name: "Recorrentes", className: "bg-chart-positive" },
              { name: "Novos", className: "bg-chart-amber" },
            ]}
            data={CLIENT_MIX.map((m) => ({ label: m.month, values: [m.returning, m.fresh] }))}
          />
        </Panel>

        <Panel aria-label="Desempenho da equipe" className="flex flex-col gap-2 overflow-x-auto px-[22px] py-5">
          <PanelTitle title="Desempenho da equipe" subtitle="Setembro" />
          <table className="w-full min-w-[440px] text-right">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th scope="col" className="py-2 text-left font-semibold">
                  Profissional
                </th>
                <th scope="col" className="font-semibold">Faturamento</th>
                <th scope="col" className="font-semibold">Atend.</th>
                <th scope="col" className="font-semibold">Ticket</th>
                <th scope="col" className="font-semibold">Ocupação</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_SEPTEMBER.map((t) => (
                <tr key={t.name} className="h-11 border-b border-line-soft">
                  <th scope="row" className="text-left font-semibold">
                    {t.name}
                  </th>
                  <td>{brl(t.revenue)}</td>
                  <td>{t.appointments}</td>
                  <td>{brl(t.ticket)}</td>
                  <td>{t.occupancy}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="h-11 font-bold">
                <th scope="row" className="text-left">
                  Total
                </th>
                <td>{brl(sept.revenue)}</td>
                <td>{num(sept.appointments)}</td>
                <td>{brl(Math.round(sept.revenue / sept.appointments))}</td>
                <td>77%</td>
              </tr>
            </tfoot>
          </table>
        </Panel>
      </div>
    </>
  );
}
