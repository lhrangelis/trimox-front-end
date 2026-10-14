"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Button, ButtonLink, IconButton } from "@/components/ui/Button";
import { PageHeader, Panel } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/Choice";
import { SearchField } from "@/components/ui/Field";
import { DataTable, RowButton, Td, Th, Tr } from "@/components/ui/Table";
import { CLIENTS, CLIENT_TOTALS, type ClientTag } from "@/lib/data/clients";
import { brl, num } from "@/lib/format";

const TAG_TONE: Record<ClientTag, Tone> = { Frequente: "success", Regular: "muted", Sumido: "warning", Novo: "info" };

const FILTERS: { value: "todos" | ClientTag; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "Frequente", label: "Frequentes" },
  { value: "Regular", label: "Regulares" },
  { value: "Sumido", label: "Sumidos +45 dias" },
  { value: "Novo", label: "Novos" },
];

export function ClientsView() {
  const [filter, setFilter] = useState<"todos" | ClientTag>("todos");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(CLIENTS[0].id);

  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");
  const rows = CLIENTS.filter((c) => filter === "todos" || c.tag === filter).filter(
    (c) => !q || c.name.toLowerCase().includes(q) || (digits && c.phone.replace(/\D/g, "").includes(digits)),
  );
  const sel = CLIENTS.find((c) => c.id === selectedId)!;

  return (
    <>
      <PageHeader title="Clientes" subtitle={`${num(CLIENT_TOTALS.registered)} clientes cadastrados · ${CLIENT_TOTALS.newThisMonth} novos este mês`}>
        <Button variant="secondary" icon="download">
          Importar contatos
        </Button>
        <Button icon="plus">Novo cliente</Button>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          label="Filtrar clientes"
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((f) => ({ ...f, count: f.value === "todos" ? CLIENTS.length : CLIENTS.filter((c) => c.tag === f.value).length }))}
        />
        <SearchField label="Buscar por nome ou telefone" placeholder="Nome ou telefone" value={query} onChange={(e) => setQuery(e.target.value)} className="w-[280px] max-w-full" />
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <DataTable
          label="Lista de clientes"
          className="min-w-0 flex-[999_1_560px]"
          head={
            <>
              <Th className="w-[30%]">Cliente</Th>
              <Th>Última visita</Th>
              <Th>Visitas</Th>
              <Th>Total gasto</Th>
              <Th>Preferência</Th>
              <Th>Perfil</Th>
            </>
          }
          footer={
            <tr>
              <td colSpan={6} className="px-4 py-3 text-[13px] text-muted">
                <div className="flex items-center justify-between gap-3">
                  <span aria-live="polite">
                    Mostrando {rows.length} de {num(CLIENT_TOTALS.registered)}
                  </span>
                  <div className="flex gap-1.5">
                    <IconButton icon="chevronLeft" label="Página anterior" className="size-10" disabled />
                    <IconButton icon="chevronRight" label="Próxima página" className="size-10" />
                  </div>
                </div>
              </td>
            </tr>
          }
        >
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-muted">
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
          {rows.map((c) => (
            <Tr key={c.id} selected={c.id === selectedId}>
              <Td>
                <RowButton selected={c.id === selectedId} onClick={() => setSelectedId(c.id)}>
                  <Avatar name={c.name} />
                  <span className="flex min-w-0 flex-col">
                    <strong className="font-semibold">{c.name}</strong>
                    <span className="text-xs text-muted">{c.phone}</span>
                  </span>
                </RowButton>
              </Td>
              <Td>{c.lastVisit}</Td>
              <Td>{c.visits}</Td>
              <Td>{brl(c.totalSpent)}</Td>
              <Td>{c.preferredPro}</Td>
              <Td>
                <Badge tone={TAG_TONE[c.tag]}>{c.tag}</Badge>
              </Td>
            </Tr>
          ))}
        </DataTable>

        <Panel aria-label="Ficha do cliente" className="flex min-w-0 flex-[1_1_320px] flex-col gap-[18px] p-[22px]">
          <div className="flex items-center gap-3.5">
            <Avatar name={sel.name} size={56} tone="dark" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <h2 className="text-lg font-bold tracking-[-0.02em]">{sel.name}</h2>
              <span className="text-muted">
                {sel.phone} · cliente desde {sel.since}
              </span>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-2">
            {[
              ["Visitas", sel.visits],
              ["Ticket médio", brl(sel.avgTicket)],
              ["Retorna a cada", sel.returnsEvery],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 rounded-xl bg-linen p-3">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="text-lg font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-1.5">
            <h3 className="eyebrow">Observações</h3>
            <p className="leading-normal text-body">{sel.notes}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="eyebrow">Histórico</h3>
            <ul>
              {sel.history.map((h) => (
                <li key={h.date} className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-line-soft py-2.5">
                  <span className="text-[13px] text-muted">{h.date}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{h.service}</span>
                    <span className="text-xs text-muted">com {h.pro}</span>
                  </span>
                  <span className="font-semibold">{brl(h.value)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/app/agenda" className="flex-[1_1_140px]">
              Agendar horário
            </ButtonLink>
            <ButtonLink
              href={`https://wa.me/55${sel.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              icon="chat"
              className="flex-[1_1_140px]"
            >
              WhatsApp
            </ButtonLink>
          </div>
        </Panel>
      </div>
    </>
  );
}
