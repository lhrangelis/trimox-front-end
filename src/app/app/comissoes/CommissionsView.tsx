"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader, Panel, StatCard, StatGrid } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Choice";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Switch } from "@/components/ui/Switch";
import { DataTable, RowButton, Td, Th, Tr } from "@/components/ui/Table";
import { COMMISSION_PERIODS, STATEMENTS } from "@/lib/data/finance";
import { TEAM, type ProId } from "@/lib/data/team";
import { brl, brlSigned, num } from "@/lib/format";

export function CommissionsView() {
  const [periodId, setPeriodId] = useState(COMMISSION_PERIODS[0].id);
  const [selectedId, setSelectedId] = useState<ProId>("bruno");
  const [deductFee, setDeductFee] = useState(true);
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);

  const period = COMMISSION_PERIODS.find((p) => p.id === periodId)!;
  const paid = period.paid || closed[period.id];

  const rows = TEAM.map((p) => {
    const d = period.rows[p.id];
    const commission = p.commission ? (d.revenue * p.commission) / 100 : 0;
    return { pro: p, ...d, commission, toPay: p.commission ? commission - d.advances : 0 };
  });
  const totals = rows.reduce(
    (t, r) => ({ commission: t.commission + r.commission, advances: t.advances + r.advances, toPay: t.toPay + r.toPay }),
    { commission: 0, advances: 0, toPay: 0 },
  );
  const sel = TEAM.find((p) => p.id === selectedId)!;

  return (
    <>
      <PageHeader title="Comissões" subtitle="Calculadas automaticamente a cada atendimento pago">
        <Segmented label="Período" value={periodId} onChange={setPeriodId} options={COMMISSION_PERIODS.map((p) => ({ value: p.id, label: p.label }))} />
        <Button variant="secondary">Lançar vale</Button>
        <Button disabled={paid} onClick={() => setConfirming(true)}>
          {paid ? "Período fechado" : "Fechar e pagar"}
        </Button>
      </PageHeader>

      <StatGrid label="Resumo do período">
        <StatCard label="Comissões do período" value={brl(totals.commission)} hint={period.range} />
        <StatCard label="Vales e adiantamentos" value={brl(totals.advances)} hint="descontados no fechamento" />
        <StatCard dark label={paid && !period.paid ? "Pago agora" : period.payLabel} value={brl(totals.toPay)} hint={period.payNote} />
      </StatGrid>

      <DataTable
        label="Comissões por profissional"
        minWidth={900}
        head={
          <>
            <Th className="w-[22%]">Profissional</Th>
            <Th>Atendimentos</Th>
            <Th>Faturado</Th>
            <Th>%</Th>
            <Th>Comissão</Th>
            <Th>Vales</Th>
            <Th>A pagar</Th>
            <Th>Situação</Th>
          </>
        }
      >
        {rows.map((r) => {
          const owner = r.pro.commission === null;
          return (
            <Tr key={r.pro.id} selected={r.pro.id === selectedId}>
              <Td>
                <RowButton selected={r.pro.id === selectedId} onClick={() => setSelectedId(r.pro.id)}>
                  <Avatar name={r.pro.name} initials={r.pro.initials} />
                  <span className="flex flex-col">
                    <strong className="font-semibold">{r.pro.name}</strong>
                    <span className="text-xs text-muted">{r.pro.shortRole}</span>
                  </span>
                </RowButton>
              </Td>
              <Td>{r.appointments}</Td>
              <Td>{brl(r.revenue)}</Td>
              <Td>{owner ? "—" : `${r.pro.commission}%`}</Td>
              <Td className="font-semibold">{owner ? "—" : brl(r.commission)}</Td>
              <Td className="text-body">{r.advances ? brlSigned(-r.advances) : "—"}</Td>
              <Td className="font-bold">{owner ? "—" : brl(r.toPay)}</Td>
              <Td>
                {owner ? <Badge tone="neutral">Não se aplica</Badge> : paid ? <Badge tone="success">Pago</Badge> : <Badge tone="warning">Pendente</Badge>}
              </Td>
            </Tr>
          );
        })}
      </DataTable>

      <div className="flex flex-wrap items-start gap-5">
        <Panel aria-label="Extrato" className="flex min-w-0 flex-[999_1_460px] flex-col gap-2.5 p-5">
          <h2 className="text-lg font-bold tracking-[-0.02em]">Extrato · {sel.name}</h2>
          {sel.owner ? (
            <p className="text-muted">Proprietário: não recebe comissão. Os atendimentos entram direto no faturamento da casa.</p>
          ) : period.id !== COMMISSION_PERIODS[0].id ? (
            <p className="text-muted">O extrato detalhado de períodos fechados fica disponível no relatório exportado.</p>
          ) : (
            <ul>
              {STATEMENTS[sel.id].map((l, i) => (
                <li key={i} className="grid min-h-12 grid-cols-[56px_minmax(0,1fr)_auto_auto] items-center gap-3.5 border-b border-line-soft">
                  <span className="text-muted">{l.date}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{l.what}</span>
                    <span className="text-xs text-muted">{l.sub}</span>
                  </span>
                  <span className="text-muted">{l.base === null ? "" : `${brl(l.base)} × ${l.rate}%`}</span>
                  <strong className="min-w-[90px] text-right font-bold">
                    {l.base === null ? brlSigned(l.rate) : brl((l.base * l.rate) / 100)}
                  </strong>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel aria-label="Regras de comissão" className="flex min-w-0 flex-[1_1_320px] flex-col gap-1 p-5">
          <h2 className="mb-2 text-lg font-bold tracking-[-0.02em]">Regras</h2>
          <dl>
            {[
              ["Serviços", "% de cada profissional"],
              ["Venda de produtos", "10% para quem vendeu"],
              ["Pagamento", "Quinzenal · dias 1 e 16"],
            ].map(([k, v]) => (
              <div key={k} className="flex min-h-10 items-center justify-between gap-3 border-b border-line-soft">
                <dt className="text-body">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex min-h-11 items-center justify-between gap-3">
            <span id="taxa-maquininha" className="text-body">
              Descontar taxa da maquininha antes do cálculo
            </span>
            <Switch checked={deductFee} onChange={setDeductFee} labelledBy="taxa-maquininha" />
          </div>
        </Panel>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Fechar e pagar a quinzena?"
        confirmLabel={`Pagar ${brl(totals.toPay)}`}
        onClose={() => setConfirming(false)}
        onConfirm={() => setClosed((c) => ({ ...c, [period.id]: true }))}
      >
        Serão pagos {brl(totals.toPay)} em comissões a {num(rows.filter((r) => r.toPay > 0).length)} profissionais, já descontados os vales.
        Depois de fechado, o período não pode ser editado.
      </ConfirmDialog>
    </>
  );
}
