"use client";

import { useState } from "react";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PageHeader, Panel } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/Choice";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SearchField } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { DataTable, RowButton, Td, Th, Tr } from "@/components/ui/Table";
import { ACCOUNTS, ACCOUNTS_TOTAL, FEATURES, PAYING, TRIALS, type AccountStatus, type Health } from "@/lib/data/admin";
import { planById } from "@/lib/data/plans";
import { brl, cn, num } from "@/lib/format";

const STATUS: Record<AccountStatus, { label: string; tone: Tone }> = {
  ativo: { label: "Ativo", tone: "success" },
  teste: { label: "Em teste", tone: "info" },
  inadimplente: { label: "Inadimplente", tone: "danger" },
  cancelado: { label: "Cancelado", tone: "muted" },
  suspenso: { label: "Suspenso", tone: "dark" },
};

const HEALTH_COLOR: Record<Health, string> = {
  Boa: "bg-chart-positive",
  Atenção: "bg-chart-amber",
  Risco: "bg-danger",
  "—": "bg-line-strong",
};

/** Recursos que o CEO pode ligar/desligar por conta (exceções ao plano). */
const ACCOUNT_FEATURES = ["Agendamento online", "Lembretes por WhatsApp", "Sinal via Pix", "Controle de estoque", "Várias unidades"];

const FILTERS: { value: "todos" | AccountStatus; label: string }[] = [
  { value: "todos", label: "Todas" },
  { value: "ativo", label: "Ativas" },
  { value: "teste", label: "Em teste" },
  { value: "inadimplente", label: "Inadimplentes" },
  { value: "cancelado", label: "Canceladas" },
];

const TIMELINE: Record<Exclude<AccountStatus, "suspenso">, (price: string, since: string) => [string, string][]> = {
  ativo: (price) => [
    ["05/10", `Pagamento de ${price} confirmado`],
    ["22/09", "Chamado de suporte resolvido"],
    ["05/09", "Pagamento confirmado"],
  ],
  inadimplente: (price) => [
    ["10/10", "Cartão recusado · nova tentativa em 14/10"],
    ["05/10", `Cobrança de ${price} falhou`],
    ["05/09", "Pagamento confirmado"],
  ],
  teste: (_, since) => [
    ["hoje", "Abriu o app pelo celular"],
    [since === "out/2026" ? "01/10" : "20/09", "Conta criada · teste de 14 dias"],
    ["—", "Ainda sem forma de pagamento"],
  ],
  cancelado: () => [
    ["02/09", "Assinatura cancelada · motivo: fechou o negócio"],
    ["05/08", "Pagamento confirmado"],
    ["18/07", "Pediu ajuda para exportar clientes"],
  ],
};

export function AccountsView() {
  const [filter, setFilter] = useState<"todos" | AccountStatus>("todos");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(ACCOUNTS[1].id);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [suspended, setSuspended] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);

  const q = query.trim().toLowerCase();
  const statusOf = (id: string, base: AccountStatus): AccountStatus => (suspended[id] ? "suspenso" : base);
  const rows = ACCOUNTS.filter((a) => filter === "todos" || a.status === filter).filter(
    (a) => !q || [a.name, a.owner, a.city].some((f) => f.toLowerCase().includes(q)),
  );

  const sel = ACCOUNTS.find((a) => a.id === selectedId)!;
  const selStatus = statusOf(sel.id, sel.status);
  const plan = planById(sel.plan);
  const mrrLabel = (status: AccountStatus, price: number) =>
    status === "ativo" || status === "inadimplente" ? brl(price) : status === "teste" ? "teste" : brl(0);
  const wmax = Math.max(1, ...sel.weeks);
  const [first, last] = [sel.weeks[0], sel.weeks[sel.weeks.length - 1]];
  const trend =
    first === 0 && last === 0
      ? "Nenhum agendamento desde o cadastro"
      : first === 0
        ? `Começou a usar há ${sel.weeks.filter((w) => w > 0).length} semanas`
        : `Variação em 8 semanas: ${last >= first ? "+" : "−"}${Math.abs(Math.round((last / first - 1) * 100))}%`;
  const featureOn = (label: string) =>
    features[`${sel.id}-${label}`] ?? (sel.status !== "cancelado" && FEATURES.find((f) => f.label === label)!.plans[sel.plan]);
  const timeline = TIMELINE[sel.status === "suspenso" ? "ativo" : sel.status](brl(plan.price), sel.since);

  return (
    <>
      <PageHeader title="Clientes da Trimox" subtitle={`${num(ACCOUNTS_TOTAL)} contas · ${num(PAYING)} pagantes e ${TRIALS} em teste`}>
        <Button variant="secondary" icon="download">
          Exportar CSV
        </Button>
        <Button icon="plus">Criar conta</Button>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          label="Filtrar por situação"
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((f) => ({ ...f, count: f.value === "todos" ? ACCOUNTS.length : ACCOUNTS.filter((a) => a.status === f.value).length }))}
        />
        <SearchField label="Buscar conta" placeholder="Negócio, dono ou cidade" value={query} onChange={(e) => setQuery(e.target.value)} className="w-[300px] max-w-full" />
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <DataTable
          label="Contas"
          minWidth={820}
          className="min-w-0 flex-[999_1_560px]"
          head={
            <>
              <Th className="w-[32%]">Negócio</Th>
              <Th>Plano</Th>
              <Th>Situação</Th>
              <Th>MRR</Th>
              <Th>Agend. 30d</Th>
              <Th>Saúde</Th>
            </>
          }
          footer={
            <tr>
              <td colSpan={6} className="px-4 py-3 text-[13px] text-muted" aria-live="polite">
                Mostrando {rows.length} de {num(ACCOUNTS_TOTAL)} contas
              </td>
            </tr>
          }
        >
          {rows.map((a) => {
            const status = statusOf(a.id, a.status);
            const p = planById(a.plan);
            return (
              <Tr key={a.id} selected={a.id === selectedId}>
                <Td>
                  <RowButton selected={a.id === selectedId} onClick={() => setSelectedId(a.id)} className="flex-col items-start justify-center gap-0">
                    <strong className="font-semibold">{a.name}</strong>
                    <span className="text-xs text-muted">
                      {a.type} · {a.city}
                    </span>
                  </RowButton>
                </Td>
                <Td>{p.name}</Td>
                <Td>
                  <Badge tone={STATUS[status].tone}>{STATUS[status].label}</Badge>
                </Td>
                <Td>{mrrLabel(status, p.price)}</Td>
                <Td>{num(a.bookings30d)}</Td>
                <Td>
                  <span className="flex items-center gap-1.5">
                    <span className={cn("size-2 rounded-full", HEALTH_COLOR[a.health])} />
                    {a.health}
                  </span>
                </Td>
              </Tr>
            );
          })}
        </DataTable>

        <Panel aria-label="Detalhes da conta" className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px] p-[22px]">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-[-0.02em]">{sel.name}</h2>
              <Badge tone={STATUS[selStatus].tone}>{STATUS[selStatus].label}</Badge>
            </div>
            <span className="text-muted">
              {sel.owner} · {sel.type} em {sel.city}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-2">
            {[
              ["Plano", `${plan.name} · ${mrrLabel(selStatus, plan.price)}`],
              ["Cliente desde", sel.since],
              ["Profissionais", plan.maxPros ? `${sel.pros} de ${plan.maxPros}` : sel.pros],
              ["Último acesso", sel.lastAccess],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 rounded-xl bg-linen p-3">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-2">
            <h3 className="eyebrow">Agendamentos por semana · 8 semanas</h3>
            <div className="flex h-16 items-end gap-1.5 border-b border-disabled" role="img" aria-label={`Agendamentos por semana: ${sel.weeks.join(", ")}`}>
              {sel.weeks.map((w, i) => (
                <span key={i} title={`${w} agendamentos`} className="min-h-0.5 flex-1 rounded-t-[3px] bg-brand" style={{ height: `${(w / wmax) * 100}%` }} />
              ))}
            </div>
            <span className="text-xs text-muted">{trend}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="eyebrow mb-1">Recursos liberados</h3>
            {ACCOUNT_FEATURES.map((label) => (
              <div key={label} className="flex min-h-10 items-center justify-between gap-3">
                <span>{label}</span>
                <Switch
                  checked={featureOn(label)}
                  onChange={(v) => setFeatures((s) => ({ ...s, [`${sel.id}-${label}`]: v }))}
                  label={`${label} para ${sel.name}`}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="eyebrow">Histórico da conta</h3>
            <ol>
              {timeline.map(([d, e]) => (
                <li key={e} className="grid grid-cols-[48px_minmax(0,1fr)] gap-2.5 border-b border-line-soft py-1.5">
                  <span className="text-[13px] text-muted">{d}</span>
                  <span>{e}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ButtonLink href="/app/agenda" className="col-span-2">
              Acessar como cliente
            </ButtonLink>
            <Button variant="secondary">Alterar plano</Button>
            <Button variant="secondary">Dar desconto</Button>
            <Button variant="secondary">Enviar mensagem</Button>
            <Button variant="danger" onClick={() => (selStatus === "suspenso" ? setSuspended((s) => ({ ...s, [sel.id]: false })) : setConfirming(true))}>
              {selStatus === "suspenso" ? "Reativar conta" : "Suspender conta"}
            </Button>
          </div>
        </Panel>
      </div>

      <ConfirmDialog
        open={confirming}
        destructive
        title={`Suspender ${sel.name}?`}
        confirmLabel="Suspender conta"
        onClose={() => setConfirming(false)}
        onConfirm={() => setSuspended((s) => ({ ...s, [sel.id]: true }))}
      >
        O link de agendamento e o acesso da equipe ficam bloqueados até a conta ser reativada. Os clientes com horário marcado não
        recebem aviso automático.
      </ConfirmDialog>
    </>
  );
}
