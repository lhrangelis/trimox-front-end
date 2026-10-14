"use client";

import { useState } from "react";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader, Panel, PanelTitle, StatCard, StatGrid } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/Choice";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SwitchRow } from "@/components/ui/Switch";
import { DataTable, Td, Th, Tr } from "@/components/ui/Table";
import { INVOICES, MRR, MRR_BRIDGE, RECEIVED_OCTOBER, type InvoiceStatus } from "@/lib/data/admin";
import { planById } from "@/lib/data/plans";
import { brl, brlCentavos, brlSigned, cn } from "@/lib/format";

const STATUS_TONE: Record<InvoiceStatus, Tone> = { Paga: "success", "Em aberto": "info", Atrasada: "warning", Falhou: "danger" };

const FILTERS: { value: "todas" | InvoiceStatus; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "Paga", label: "Pagas" },
  { value: "Em aberto", label: "Em aberto" },
  { value: "Atrasada", label: "Atrasadas" },
  { value: "Falhou", label: "Falharam" },
];

export function FinanceView() {
  const [filter, setFilter] = useState<"todas" | InvoiceStatus>("todas");
  const [rules, setRules] = useState({ retry: true, notify: true, pix: true, suspend: false });
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const [resending, setResending] = useState<string | null>(null);

  const maxDelta = Math.max(...MRR_BRIDGE.filter((b) => b.kind === "delta").map((b) => Math.abs(b.value)));
  const rows = INVOICES.filter((v) => filter === "todas" || v.status === filter);
  const target = INVOICES.find((v) => v.id === resending);

  return (
    <>
      <PageHeader title="Financeiro" subtitle="Assinaturas, cobranças e inadimplência · outubro de 2026">
        <Button variant="secondary" icon="download">
          Exportar para contabilidade
        </Button>
      </PageHeader>

      <StatGrid label="Resumo financeiro">
        <StatCard label="Recebido em outubro" value={brl(RECEIVED_OCTOBER)} hint="até hoje, dia 13" />
        <StatCard label="A receber até 31/10" value={brl(MRR - RECEIVED_OCTOBER)} hint="706 cobranças agendadas" />
        <StatCard label="Inadimplência" value="3,4%" hint={`48 contas · ${brl(6190)} em aberto`} />
        <StatCard dark label="ARR" value={`R$ ${((MRR * 12) / 1e6).toFixed(2).replace(".", ",")} mi`} hint={`MRR de ${brl(MRR)} × 12`} />
      </StatGrid>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel aria-label="Movimento do MRR" className="flex flex-col gap-1.5 px-[22px] py-5">
          <PanelTitle title="De onde veio o crescimento" subtitle="Movimento do MRR em outubro" />
          <dl className="mt-2">
            {MRR_BRIDGE.map((b) => {
              const base = b.kind === "base";
              return (
                <div key={b.label} className="grid min-h-10 grid-cols-[150px_minmax(0,1fr)_110px] items-center gap-3 border-b border-line-soft last:border-0">
                  <dt className={base ? "font-bold" : ""}>{b.label}</dt>
                  <span aria-hidden="true" className="block h-3">
                    {!base && (
                      <span
                        className={cn("block h-full rounded-r", b.value > 0 ? "bg-chart-positive" : "bg-danger")}
                        style={{ width: `${(Math.abs(b.value) / maxDelta) * 100}%` }}
                      />
                    )}
                  </span>
                  <dd className={cn("text-right", base && "font-bold")}>{base ? brl(b.value) : brlSigned(b.value)}</dd>
                </div>
              );
            })}
          </dl>
        </Panel>

        <Panel aria-label="Regras de cobrança" className="flex flex-col gap-1 px-[22px] py-5">
          <PanelTitle title="Cobrança automática" subtitle="O que acontece quando um pagamento falha" />
          <div className="mt-2">
            <SwitchRow id="retry" label="Tentar o cartão de novo" hint="Após 1, 3 e 7 dias" checked={rules.retry} onChange={(v) => setRules((r) => ({ ...r, retry: v }))} />
            <SwitchRow id="notify" label="Avisar o cliente" hint="Por WhatsApp e e-mail a cada tentativa" checked={rules.notify} onChange={(v) => setRules((r) => ({ ...r, notify: v }))} />
            <SwitchRow id="pix" label="Oferecer Pix quando o cartão falhar" hint="Link de pagamento na mensagem" checked={rules.pix} onChange={(v) => setRules((r) => ({ ...r, pix: v }))} />
            <SwitchRow
              id="suspend"
              label="Suspender após 15 dias de atraso"
              hint="O link de agendamento fica pausado até pagar"
              checked={rules.suspend}
              onChange={(v) => setRules((r) => ({ ...r, suspend: v }))}
            />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <strong className="font-semibold">Receita por forma de pagamento</strong>
            <div className="flex h-3 gap-0.5" aria-hidden="true">
              <span className="w-[71%] rounded-l bg-brand" />
              <span className="w-[22%] bg-heat-3" />
              <span className="w-[7%] rounded-r bg-heat-2" />
            </div>
            <p className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-body">
              <span>Cartão 71%</span>
              <span>Pix 22%</span>
              <span>Boleto 7%</span>
            </p>
          </div>
        </Panel>
      </div>

      <DataTable
        label="Faturas"
        minWidth={900}
        caption={
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Faturas recentes</h2>
            <FilterChips label="Filtrar faturas" size="sm" value={filter} onChange={setFilter} options={FILTERS} />
          </div>
        }
        head={
          <>
            <Th>Fatura</Th>
            <Th className="w-[26%]">Cliente</Th>
            <Th>Plano</Th>
            <Th>Vencimento</Th>
            <Th>Forma</Th>
            <Th>Valor</Th>
            <Th>Situação</Th>
            <Th>
              <span className="sr-only">Ações</span>
            </Th>
          </>
        }
      >
        {rows.map((v) => {
          const plan = planById(v.plan);
          const late = v.status === "Atrasada" || v.status === "Falhou";
          return (
            <Tr key={v.id} className="h-[52px]">
              <Td className="text-muted">{v.id}</Td>
              <Td className="font-semibold">{v.account}</Td>
              <Td>{plan.name}</Td>
              <Td>{v.due}</Td>
              <Td>{v.method}</Td>
              <Td>{brlCentavos(plan.price)}</Td>
              <Td>
                <Badge tone={STATUS_TONE[v.status]}>{v.status}</Badge>
              </Td>
              <Td className="text-right">
                {late ? (
                  <Button variant="secondary" size="sm" disabled={sent[v.id]} onClick={() => setResending(v.id)}>
                    {sent[v.id] ? "Cobrança enviada" : "Reenviar cobrança"}
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm">
                    Ver fatura<span className="sr-only"> {v.id}</span>
                  </Button>
                )}
              </Td>
            </Tr>
          );
        })}
      </DataTable>

      <ConfirmDialog
        open={resending !== null}
        title="Reenviar cobrança?"
        confirmLabel="Reenviar"
        onClose={() => setResending(null)}
        onConfirm={() => target && setSent((s) => ({ ...s, [target.id]: true }))}
      >
        {target && (
          <>
            {target.account} vai receber por WhatsApp e e-mail um novo link de pagamento da fatura {target.id} (
            {brlCentavos(planById(target.plan).price)}).
          </>
        )}
      </ConfirmDialog>
    </>
  );
}
