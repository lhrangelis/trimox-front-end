"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader, Panel } from "@/components/ui/Card";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Switch, SwitchRow } from "@/components/ui/Switch";
import { BUSINESS, OPENING_HOURS, WEEKDAYS, bookingUrl } from "@/lib/data/business";
import { planById } from "@/lib/data/plans";
import { brl, brlCentavos, cn } from "@/lib/format";

const TABS = [
  { id: "negocio", label: "Dados do negócio" },
  { id: "horario", label: "Horário de funcionamento" },
  { id: "online", label: "Agendamento online" },
  { id: "lembretes", label: "Lembretes por WhatsApp" },
  { id: "plano", label: "Plano e cobrança" },
  { id: "usuarios", label: "Usuários e acessos" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const TOGGLES = {
  o1: true,
  o2: true,
  o3: false,
  r1: true,
  r2: true,
  r3: false,
  r4: true,
};

const USERS = [
  { name: "Rafael Souza", email: "rafael@barbeariacentral.com.br", role: "Proprietário · acesso total" },
  { name: "Ana Paula Reis", email: "recepcao@barbeariacentral.com.br", role: "Recepção · agenda e caixa" },
  { name: "Bruno Lima", email: "bruno@barbeariacentral.com.br", role: "Profissional" },
  { name: "Camila Rocha", email: "camila@barbeariacentral.com.br", role: "Profissional" },
  { name: "Juliana Alves", email: "juliana@barbeariacentral.com.br", role: "Profissional" },
];

const DEFAULT_MESSAGE = "Oi, {nome}! Seu horário com {profissional} é amanhã às {horario}. Responda 1 para confirmar ou 2 para remarcar.";

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-[-0.02em]">{title}</h2>
      <p className="text-muted">{subtitle}</p>
    </div>
  );
}

export function SettingsView() {
  const [tab, setTab] = useState<TabId>("negocio");
  const [toggles, setToggles] = useState(TOGGLES);
  const [days, setDays] = useState(() => Object.fromEntries(WEEKDAYS.map((d) => [d, OPENING_HOURS[d] !== null])));
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const plan = planById("equipe");
  const preview = message
    .replaceAll("{nome}", "Diego")
    .replaceAll("{profissional}", "Rafael")
    .replaceAll("{horario}", "16:30")
    .replaceAll("{servico}", "Corte + pigmentação");

  const toggle = (key: keyof typeof TOGGLES) => (v: boolean) => setToggles((t) => ({ ...t, [key]: v }));

  // Abas verticais: setas ↑/↓ navegam (padrão WAI-ARIA tabs).
  function onTabKey(e: KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === tab);
    const next = (i + (e.key === "ArrowDown" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`https://${bookingUrl()}`);
    } finally {
      setCopied(true);
    }
  }

  return (
    <>
      <PageHeader title="Configurações" subtitle="Dados do negócio, link de agendamento, lembretes e assinatura" />

      <div className="flex flex-wrap items-start gap-5">
        <div
          role="tablist"
          aria-label="Seções"
          aria-orientation="vertical"
          onKeyDown={onTabKey}
          className="flex flex-[1_1_220px] flex-col gap-0.5 rounded-2xl border border-line bg-surface p-2"
        >
          {TABS.map((t, i) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`painel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-[10px] px-3 text-left",
                  on ? "bg-sage font-semibold text-brand" : "text-body hover:bg-linen",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <Panel
          id={`painel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="flex min-w-0 flex-[999_1_560px] flex-col gap-5 px-7 py-6"
        >
          {tab === "negocio" && (
            <div className="flex flex-col gap-5">
              <SectionTitle title="Dados do negócio" subtitle="Aparecem no link de agendamento e nas mensagens aos clientes" />
              <div className="flex items-center gap-4">
                <LogoMark size={72} background="var(--color-graphite)" />
                <Button variant="secondary">Trocar logo</Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Nome do negócio" defaultValue={BUSINESS.name} name="nome" />
                <SelectField label="Tipo" options={["Barbearia", "Salão de beleza", "Barbearia e salão"]} defaultValue={BUSINESS.type} name="tipo" />
                <TextField label="WhatsApp do negócio" type="tel" defaultValue={BUSINESS.whatsapp} name="whatsapp" />
                <TextField label="Instagram" defaultValue={BUSINESS.instagram} name="instagram" />
                <TextField label="Endereço" defaultValue={BUSINESS.address} name="endereco" className="md:col-span-2" />
              </div>
            </div>
          )}

          {tab === "horario" && (
            <div className="flex flex-col gap-3.5">
              <SectionTitle title="Horário de funcionamento" subtitle="O horário de cada profissional fica dentro deste intervalo" />
              <ul>
                {WEEKDAYS.map((d) => {
                  const h = OPENING_HOURS[d] ?? { open: "09:00", close: "18:00" };
                  return (
                    <li key={d} className="grid min-h-14 grid-cols-[110px_56px_minmax(0,1fr)] items-center gap-3.5 border-b border-line-soft">
                      <strong className="font-semibold">{d}</strong>
                      <Switch checked={days[d]} onChange={(v) => setDays((s) => ({ ...s, [d]: v }))} label={`Aberto ${d.toLowerCase()}`} />
                      <span className={days[d] ? "text-graphite" : "text-muted"}>{days[d] ? `${h.open} – ${h.close}` : "Fechado"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {tab === "online" && (
            <div className="flex flex-col gap-[18px]">
              <SectionTitle title="Agendamento online" subtitle="Coloque o link na bio do Instagram e no WhatsApp Business" />
              <div className="flex flex-wrap items-center gap-2.5 rounded-xl bg-linen px-4 py-3.5">
                <strong className="flex-[1_1_220px] text-[15px] font-semibold">{bookingUrl()}</strong>
                <Button onClick={copy} aria-live="polite">
                  {copied ? "Link copiado" : "Copiar link"}
                </Button>
              </div>
              <div>
                <SwitchRow id="o1" label="Aceitar agendamentos pelo link" hint="Desligue para pausar novos agendamentos online" checked={toggles.o1} onChange={toggle("o1")} />
                <SwitchRow id="o2" label="Cliente escolhe o profissional" hint="Se desligado, o Trimox distribui pela agenda mais livre" checked={toggles.o2} onChange={toggle("o2")} />
                <SwitchRow
                  id="o3"
                  label="Cobrar sinal via Pix"
                  hint={`Para serviços acima de ${brl(150)}, como mechas e platinado`}
                  checked={toggles.o3}
                  onChange={toggle("o3")}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label="Antecedência mínima" options={["1 hora", "2 horas", "1 dia"]} defaultValue="2 horas" />
                <SelectField label="Cancelar ou remarcar até" options={["2 horas antes", "12 horas antes", "24 horas antes"]} defaultValue="12 horas antes" />
                <SelectField label="Intervalo da agenda" options={["10 min", "15 min", "30 min"]} defaultValue="15 min" />
              </div>
            </div>
          )}

          {tab === "lembretes" && (
            <div className="flex flex-col gap-[18px]">
              <SectionTitle title="Lembretes por WhatsApp" subtitle="Enviados automaticamente pelo número do seu negócio" />
              <div>
                <SwitchRow id="r1" label="Confirmação ao agendar" hint="Mensagem logo após o cliente marcar" checked={toggles.r1} onChange={toggle("r1")} />
                <SwitchRow id="r2" label="Lembrete 24 horas antes" hint="Com opção de confirmar ou remarcar" checked={toggles.r2} onChange={toggle("r2")} />
                <SwitchRow id="r3" label="Lembrete 2 horas antes" hint="Útil para quem costuma esquecer" checked={toggles.r3} onChange={toggle("r3")} />
                <SwitchRow id="r4" label="Convite de retorno" hint="Para clientes há mais de 45 dias sem visita" checked={toggles.r4} onChange={toggle("r4")} />
              </div>
              <div className="flex flex-wrap gap-5">
                <TextArea
                  label="Mensagem do lembrete de 24h"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  hint="Use {nome}, {profissional}, {horario} e {servico}"
                  className="flex-[1_1_300px]"
                />
                <div className="flex flex-[1_1_260px] flex-col gap-1.5">
                  <span className="font-semibold">Como o cliente recebe</span>
                  <div className="rounded-[14px] bg-sand p-4" aria-live="polite">
                    <div className="max-w-[260px] rounded-[12px_12px_12px_4px] bg-surface px-3 py-2.5 leading-[1.45] shadow-[0_1px_1px_rgba(21,23,26,0.06)]">
                      {preview}
                      <span className="mt-1 block text-right text-[11px] text-muted">16:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "plano" && (
            <div className="flex flex-col gap-[18px]">
              <SectionTitle title="Plano e cobrança" subtitle="Sua assinatura do Trimox" />
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] bg-graphite p-5 text-linen">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-on-dark-muted">Plano atual</span>
                  <strong className="text-[22px] font-bold">
                    {plan.name} · {plan.limitLabel}
                  </strong>
                  <span className="text-on-dark">{brl(plan.price)}/mês · próxima cobrança em 05/11</span>
                </div>
                <Button variant="light">Mudar de plano</Button>
              </div>
              <div className="flex min-h-[52px] items-center justify-between gap-3 border-b border-line-soft">
                <span className="flex flex-col gap-0.5">
                  <strong className="font-semibold">Forma de pagamento</strong>
                  <span className="text-[13px] text-muted">Cartão de crédito terminado em 4821</span>
                </span>
                <Button variant="secondary" size="sm" className="min-h-10">
                  Alterar
                </Button>
              </div>
              <div className="flex flex-col">
                <h3 className="mb-1.5 font-semibold">Faturas</h3>
                <ul>
                  {["05/10/2026", "05/09/2026", "05/08/2026", "05/07/2026"].map((d) => (
                    <li key={d} className="grid min-h-12 grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 border-b border-line-soft">
                      <span>{d}</span>
                      <span>{brlCentavos(plan.price)}</span>
                      <Badge tone="success">Paga</Badge>
                      <a href="#" className="font-semibold">
                        Baixar PDF<span className="sr-only"> da fatura de {d}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "usuarios" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionTitle title="Usuários e acessos" subtitle="Quem entra no Trimox do seu negócio" />
                <Button>Convidar usuário</Button>
              </div>
              <ul>
                {USERS.map((u) => (
                  <li key={u.email} className="grid min-h-14 grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Avatar name={u.name} />
                      <span className="flex min-w-0 flex-col">
                        <strong className="font-semibold">{u.name}</strong>
                        <span className="truncate text-xs text-muted">{u.email}</span>
                      </span>
                    </span>
                    <span className="text-body">{u.role}</span>
                    <a href="#" className="font-semibold">
                      Editar<span className="sr-only"> {u.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2.5 border-t border-line-soft pt-2">
            <Button variant="secondary">Descartar</Button>
            <Button className="px-5">Salvar alterações</Button>
          </div>
        </Panel>
      </div>
    </>
  );
}
