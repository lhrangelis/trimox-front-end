"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/Choice";
import { Switch } from "@/components/ui/Switch";
import { DataTable, Td, Th, Tr } from "@/components/ui/Table";
import { SERVICES, SERVICE_CATEGORIES, type ServiceCategory } from "@/lib/data/services";
import { proById } from "@/lib/data/team";
import { brl } from "@/lib/format";

export function ServicesView() {
  const [category, setCategory] = useState<"Todos" | ServiceCategory>("Todos");
  const [online, setOnline] = useState<Record<string, boolean>>(() => Object.fromEntries(SERVICES.map((s) => [s.id, s.online])));

  const rows = SERVICES.filter((s) => category === "Todos" || s.category === category);
  const onlineCount = Object.values(online).filter(Boolean).length;

  return (
    <>
      <PageHeader title="Serviços" subtitle={`${SERVICES.length} serviços em ${SERVICE_CATEGORIES.length} categorias · preços, duração e comissão de cada um`}>
        <Button variant="secondary">Gerenciar categorias</Button>
        <Button icon="plus">Novo serviço</Button>
      </PageHeader>

      <StatGrid label="Destaques do mês" min={240}>
        <StatCard label="Mais vendido em outubro" value={<span className="text-xl">Corte + barba</span>} hint="148 atendimentos" />
        <StatCard label="Maior faturamento" value={<span className="text-xl">Coloração</span>} hint={`${brl(7560)} no mês`} />
        <StatCard label="No link de agendamento" value={<span className="text-xl">{`${onlineCount} de ${SERVICES.length}`}</span>} hint="os demais só pela recepção" />
      </StatGrid>

      <FilterChips
        label="Categorias"
        value={category}
        onChange={setCategory}
        options={(["Todos", ...SERVICE_CATEGORIES] as const).map((c) => ({
          value: c,
          label: c,
          count: c === "Todos" ? SERVICES.length : SERVICES.filter((s) => s.category === c).length,
        }))}
      />

      <DataTable
        label="Lista de serviços"
        minWidth={860}
        head={
          <>
            <Th className="w-[28%]">Serviço</Th>
            <Th>Categoria</Th>
            <Th>Duração</Th>
            <Th>Preço</Th>
            <Th>Comissão</Th>
            <Th>Quem faz</Th>
            <Th>Agendamento online</Th>
          </>
        }
      >
        {rows.map((s) => (
          <Tr key={s.id}>
            <Td className="py-2.5">
              <span className="flex flex-col gap-px">
                <strong className="font-semibold">{s.name}</strong>
                <span className="text-xs text-muted">{s.description}</span>
              </span>
            </Td>
            <Td className="text-body">{s.category}</Td>
            <Td>{s.minutes} min</Td>
            <Td className="font-semibold">{brl(s.price)}</Td>
            <Td>{s.commission}%</Td>
            <Td>
              <span className="flex" aria-label={s.pros.map((p) => proById(p).name).join(", ")}>
                {s.pros.map((p) => (
                  <span
                    key={p}
                    aria-hidden="true"
                    className="-mr-1.5 flex size-7 items-center justify-center rounded-full border-2 border-white bg-sand text-[10px] font-semibold"
                  >
                    {proById(p).initials}
                  </span>
                ))}
              </span>
            </Td>
            <Td>
              <span className="flex items-center gap-2.5">
                <Switch
                  checked={online[s.id]}
                  onChange={(v) => setOnline((o) => ({ ...o, [s.id]: v }))}
                  label={`Disponível no agendamento online: ${s.name}`}
                />
                <span className="text-xs text-muted">{online[s.id] ? "Visível" : "Oculto"}</span>
              </span>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
