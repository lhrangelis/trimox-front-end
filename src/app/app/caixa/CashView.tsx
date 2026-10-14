"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Meter, PageHeader, Panel, StatCard, StatGrid } from "@/components/ui/Card";
import { DataTable, Td, Th, Tr } from "@/components/ui/Table";
import { CASH_DRAWER, CASH_ENTRIES, PAYMENT_METHODS, type PaymentMethod } from "@/lib/data/finance";
import { brl, cn } from "@/lib/format";

const sum = (xs: { value: number }[]) => xs.reduce((a, x) => a + x.value, 0);

export function CashView() {
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  const total = sum(CASH_ENTRIES);
  const products = CASH_ENTRIES.reduce((a, e) => a + e.products, 0);
  const cashIn = sum(CASH_ENTRIES.filter((e) => e.method === "Dinheiro"));
  const expected = CASH_DRAWER.initialChange + cashIn - CASH_DRAWER.withdrawals;
  const rows = CASH_ENTRIES.filter((e) => !method || e.method === method);

  return (
    <>
      <PageHeader
        title="Caixa"
        badge={
          <Badge tone="success" className="px-3 py-1.5 text-[13px]">
            <span className="size-2 rounded-full bg-brand" />
            Aberto desde {CASH_DRAWER.openedAt} por {CASH_DRAWER.openedBy}
          </Badge>
        }
      >
        <Button variant="secondary">Sangria / retirada</Button>
        <Button variant="secondary">Fechar caixa</Button>
        <Button icon="plus">Registrar pagamento</Button>
      </PageHeader>

      <StatGrid label="Resumo do caixa">
        <StatCard label="Recebido hoje" value={brl(total)} hint={`${brl(total - products)} em serviços · ${brl(products)} em produtos`} />
        <StatCard label="Atendimentos pagos" value={CASH_ENTRIES.length} hint={`${CASH_DRAWER.remainingToday} ainda na agenda de hoje`} />
        <StatCard label="Ticket médio" value={brl(Math.round(total / CASH_ENTRIES.length))} hint="por atendimento" />
        <StatCard
          label="Dinheiro na gaveta"
          value={brl(expected)}
          hint={`${brl(CASH_DRAWER.initialChange)} de troco + ${brl(cashIn)} recebidos`}
        />
      </StatGrid>

      <div className="flex flex-wrap items-start gap-5">
        <DataTable
          label="Movimentações"
          minWidth={720}
          className="min-w-0 flex-[999_1_560px]"
          caption={
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4">
              <h2 className="text-lg font-bold tracking-[-0.02em]">Movimentações de hoje</h2>
              <span className="text-[13px] text-muted" aria-live="polite">
                {method ? `Filtrando por ${method} · toque de novo para limpar` : "Todas as formas de pagamento"}
              </span>
            </div>
          }
          head={
            <>
              <Th className="w-16">Hora</Th>
              <Th>Cliente</Th>
              <Th>Itens</Th>
              <Th>Profissional</Th>
              <Th>Forma</Th>
              <Th className="text-right">Valor</Th>
            </>
          }
          footer={
            <tr className="font-bold">
              <td colSpan={5} className="px-4 py-3.5">
                Total
              </td>
              <td className="px-4 py-3.5 text-right">{brl(sum(rows))}</td>
            </tr>
          }
        >
          {rows.map((e) => (
            <Tr key={e.time + e.client} className="h-12">
              <Td className="text-muted">{e.time}</Td>
              <Td className="font-semibold">{e.client}</Td>
              <Td className="text-body">{e.items}</Td>
              <Td>{e.pro}</Td>
              <Td>
                <Badge tone="neutral">{e.method}</Badge>
              </Td>
              <Td className="text-right font-semibold">{brl(e.value)}</Td>
            </Tr>
          ))}
        </DataTable>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          <Panel aria-label="Por forma de pagamento" className="flex flex-col gap-1.5 p-5">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Por forma de pagamento</h2>
            <p className="mb-2 text-[13px] text-muted">Toque em uma forma para filtrar a lista</p>
            {PAYMENT_METHODS.map((m) => {
              const value = sum(CASH_ENTRIES.filter((e) => e.method === m));
              const pct = Math.round((value / total) * 100);
              const on = method === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setMethod(on ? null : m)}
                  className={cn("-mx-2.5 flex cursor-pointer flex-col gap-1.5 rounded-[10px] p-2.5 text-left", on ? "bg-mint" : "hover:bg-linen")}
                >
                  <span className="flex w-full justify-between">
                    <strong className="font-semibold">{m}</strong>
                    <span>
                      {brl(value)} · <span className="text-muted">{pct}%</span>
                    </span>
                  </span>
                  <Meter value={pct} className="w-full" />
                </button>
              );
            })}
          </Panel>

          <section aria-label="Gaveta" className="flex flex-col gap-2.5 rounded-2xl bg-graphite p-5 text-linen">
            <h2 className="text-lg font-bold tracking-[-0.02em]">Conferência da gaveta</h2>
            <dl className="flex flex-col gap-2.5">
              {[
                ["Troco inicial", brl(CASH_DRAWER.initialChange)],
                ["Entradas em dinheiro", `+ ${brl(cashIn)}`],
                ["Sangrias", brl(CASH_DRAWER.withdrawals)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-on-dark">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-body pt-2.5 font-bold">
                <dt>Esperado na gaveta</dt>
                <dd>{brl(expected)}</dd>
              </div>
            </dl>
            <p className="text-[13px] text-on-dark-muted">
              Ao fechar o caixa, você informa o valor contado e o Trimox registra qualquer diferença.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
