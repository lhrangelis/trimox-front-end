"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader, Panel, PanelTitle } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Choice";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { ACCOUNTS_TOTAL, BETAS, FEATURES, MRR_BY_PLAN } from "@/lib/data/admin";
import { PLANS, type PlanId } from "@/lib/data/plans";
import { brl, num } from "@/lib/format";

const LEVELS = [
  { value: 0, label: "Desligado" },
  { value: 1, label: "10%" },
  { value: 2, label: "50%" },
  { value: 3, label: "Todos" },
];
const REACH = [0, 0.1, 0.5, 1];

const AUDIENCES = [`Todos os clientes (${num(ACCOUNTS_TOTAL)})`, "Só barbearias", "Só salões", "Plano Solo", "Contas em teste"];

export function PlansView() {
  const [matrix, setMatrix] = useState(() => FEATURES.map((f) => ({ ...f.plans })));
  const [betas, setBetas] = useState(() => BETAS.map((b) => b.level));
  const [confirming, setConfirming] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [audience, setAudience] = useState(AUDIENCES[0]);

  function onSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setConfirming(true);
  }

  return (
    <>
      <PageHeader title="Planos e recursos" subtitle="Preços, o que cada plano libera, recursos em teste e comunicados">
        <Button>Salvar alterações</Button>
      </PageHeader>

      <section aria-label="Planos" className="grid gap-3 md:grid-cols-3">
        {PLANS.map((p) => {
          const stats = MRR_BY_PLAN.find((m) => m.plan.id === p.id)!;
          return (
            <Panel key={p.id} className="flex flex-col gap-3 px-5 py-[18px]">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold">{p.name}</h2>
                <span className="text-[13px] text-muted">{p.limitLabel}</span>
              </div>
              <TextField label="Preço mensal (R$)" type="number" min={0} step={1} defaultValue={p.price} className="text-[13px] text-body [&_input]:text-lg [&_input]:font-bold" />
              <div className="flex justify-between text-[13px] text-body">
                <span>{num(stats.clients)} clientes</span>
                <span>MRR {brl(stats.mrr)}</span>
              </div>
            </Panel>
          );
        })}
      </section>

      <Panel aria-label="Recursos por plano" className="overflow-x-auto px-[22px] py-5">
        <table className="w-full min-w-[620px]">
          <caption className="pb-2.5 text-left">
            <span className="text-lg font-bold tracking-[-0.02em]">O que cada plano libera</span>
          </caption>
          <thead>
            <tr className="border-b border-line">
              <td />
              {PLANS.map((p) => (
                <th key={p.id} scope="col" className="w-[18%] pb-2.5 text-center">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f, i) => (
              <tr key={f.label} className="h-12 border-b border-line-soft last:border-0">
                <th scope="row" className="text-left font-normal">
                  {f.label}
                </th>
                {PLANS.map((p) => (
                  <td key={p.id} className="text-center">
                    <span className="inline-flex">
                      <Switch
                        checked={matrix[i][p.id as PlanId]}
                        onChange={(v) => setMatrix((m) => m.map((row, j) => (j === i ? { ...row, [p.id]: v } : row)))}
                        label={`${f.label} no plano ${p.name}`}
                      />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel aria-label="Recursos em teste" className="flex flex-col gap-1.5 px-[22px] py-5">
          <PanelTitle title="Recursos em teste" subtitle="Libere aos poucos e acompanhe antes de abrir para todos" />
          <ul className="mt-1.5">
            {BETAS.map((b, i) => (
              <li key={b.name} className="flex flex-col gap-2.5 border-b border-line-soft py-3.5 last:border-0">
                <div className="flex flex-col gap-0.5">
                  <strong className="font-semibold">{b.name}</strong>
                  <span className="text-[13px] text-muted">
                    {b.description} · {betas[i] === 0 ? "desligado" : `${num(Math.round(ACCOUNTS_TOTAL * REACH[betas[i]]))} contas com acesso`}
                  </span>
                </div>
                <Segmented
                  label={`Liberação de ${b.name}`}
                  size="sm"
                  tone="dark"
                  value={betas[i]}
                  onChange={(v) => setBetas((s) => s.map((x, j) => (j === i ? v : x)))}
                  options={LEVELS}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel id="comunicado" aria-label="Comunicados" className="flex scroll-mt-6 flex-col gap-3.5 px-[22px] py-5">
          <PanelTitle title="Enviar comunicado" subtitle="Novidades, manutenções e avisos para os seus clientes" />
          <form method="post" onSubmit={onSend} className="flex flex-col gap-3.5">
            <TextField label="Título" name="titulo" required defaultValue="Novo: lista de espera inteligente" />
            <TextArea
              label="Mensagem"
              name="mensagem"
              required
              rows={3}
              defaultValue="Quando um cliente desmarca, o Trimox avisa automaticamente quem estava esperando por aquele horário."
            />
            <SelectField label="Para quem" name="publico" options={AUDIENCES} value={audience} onChange={(e) => setAudience(e.target.value)} />
            <fieldset className="flex flex-wrap gap-x-5 gap-y-2">
              <legend className="mb-2 font-semibold">Canais</legend>
              {[
                ["app", "Aviso dentro do app", true],
                ["email", "E-mail", true],
                ["whatsapp", "WhatsApp", false],
              ].map(([id, label, checked]) => (
                <label key={id as string} className="flex min-h-9 items-center gap-2">
                  <input type="checkbox" name="canais" value={id as string} defaultChecked={checked as boolean} className="size-[18px] accent-brand" />
                  {label}
                </label>
              ))}
            </fieldset>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={sentTo !== null}>
                {sentTo ? "Comunicado enviado" : "Enviar comunicado"}
              </Button>
              <span className="text-[13px] text-muted" aria-live="polite">
                {sentTo ? `Entregue para: ${sentTo}` : "Você confirma o público antes do envio"}
              </span>
            </div>
          </form>
        </Panel>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Enviar comunicado agora?"
        confirmLabel="Enviar"
        onClose={() => setConfirming(false)}
        onConfirm={() => setSentTo(audience)}
      >
        O comunicado vai para <strong>{audience}</strong>. Não é possível cancelar o envio depois de confirmado.
      </ConfirmDialog>
    </>
  );
}
