"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AuthHeading, OrDivider } from "@/components/layout/AuthLayout";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FilterChips } from "@/components/ui/Choice";
import { PasswordField, TextField } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BUSINESS, bookingUrl } from "@/lib/data/business";
import { PLANS, TRIAL_DAYS, type PlanId } from "@/lib/data/plans";
import { brl, cn } from "@/lib/format";

const STEPS = ["conta", "negocio", "plano", "pronto"] as const;
type Step = (typeof STEPS)[number];

const TYPES: { id: string; label: string; icon: IconName }[] = [
  { id: "barbearia", label: "Barbearia", icon: "scissors" },
  { id: "salao", label: "Salão de beleza", icon: "drop" },
  { id: "ambos", label: "Os dois", icon: "lines" },
];

const TEAM_SIZES = [
  { value: 0, label: "Só eu" },
  { value: 1, label: "2 a 3" },
  { value: 2, label: "4 a 6" },
  { value: 3, label: "7 ou mais" },
];

const PLAN_DESC: Record<PlanId, string> = {
  solo: "Para quem atende sozinho",
  equipe: "Até 6 profissionais, com comissões",
  rede: "Mais de uma unidade ou equipe grande",
};

function trialEnd() {
  const d = new Date(2026, 9, 13 + TRIAL_DAYS);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}

export function SignupFlow() {
  const [step, setStep] = useState<Step>("conta");
  const [type, setType] = useState("barbearia");
  const [team, setTeam] = useState(1);
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const index = STEPS.indexOf(step);
  const recommended: PlanId = team === 0 ? "solo" : team === 3 ? "rede" : "equipe";
  const chosen = plan ?? recommended;
  const slug = "seu-negocio";

  // Ao trocar de passo, o foco vai para o novo título (leitores de tela anunciam a mudança).
  useEffect(() => {
    if (moved.current) headingRef.current?.querySelector("h1")?.focus();
  }, [step]);

  function go(next: Step) {
    moved.current = true;
    setStep(next);
  }

  function submit(e: FormEvent<HTMLFormElement>, next: Step) {
    e.preventDefault();
    go(next);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`https://${bookingUrl(slug)}`);
    } finally {
      setCopied(true);
    }
  }

  const backButton = (to: Step) => (
    <Button variant="secondary" size="xl" className="flex-1 border-line-strong" onClick={() => go(to)}>
      Voltar
    </Button>
  );

  return (
    <div ref={headingRef} className="flex flex-col gap-7 [&_h1]:outline-none">
      {step !== "pronto" && (
        <div className="flex flex-col gap-3">
          <span className="self-end text-[13px] text-muted">Passo {index + 1} de 3</span>
          <div aria-hidden="true" className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn("h-1 rounded-full", i <= index ? "bg-brand" : "bg-disabled")} />
            ))}
          </div>
        </div>
      )}

      {step === "conta" && (
        <form method="post" onSubmit={(e) => submit(e, "negocio")} className="flex flex-col gap-[18px]">
          <AuthHeading title="Crie sua conta grátis" subtitle="Leva menos de dois minutos." />
          <Button variant="secondary" size="lg" className="border-line-strong">
            Continuar com Google
          </Button>
          <OrDivider>ou com seu e-mail</OrDivider>
          <TextField label="Seu nome" name="nome" required autoComplete="name" placeholder="Como você quer ser chamado" large />
          <div className="grid gap-3.5 sm:grid-cols-2">
            <TextField label="E-mail" name="email" type="email" required autoComplete="email" placeholder="voce@email.com" large />
            <TextField label="WhatsApp" name="whatsapp" type="tel" required autoComplete="tel" placeholder="(00) 00000-0000" large />
          </div>
          <PasswordField label="Senha" name="senha" required minLength={8} autoComplete="new-password" placeholder="Mínimo de 8 caracteres" />
          <label className="flex items-start gap-2.5 text-sm leading-[1.45] text-body">
            <input type="checkbox" name="termos" required className="mt-0.5 size-[18px] flex-none accent-brand" />
            <span>
              Li e aceito os <a href="#">Termos de uso</a> e a <a href="#">Política de privacidade</a>.
            </span>
          </label>
          <Button type="submit" size="xl" className="font-bold">
            Continuar
          </Button>
        </form>
      )}

      {step === "negocio" && (
        <form method="post" onSubmit={(e) => submit(e, "plano")} className="flex flex-col gap-5">
          <AuthHeading title="Conte sobre o seu negócio" subtitle="Assim o Trimox já vem com os serviços certos." />
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 font-semibold">Tipo de negócio</legend>
            <div className="grid grid-cols-3 gap-2.5">
              {TYPES.map((t) => {
                const on = type === t.id;
                return (
                  <label
                    key={t.id}
                    className={cn(
                      "flex min-h-24 cursor-pointer flex-col items-start gap-2.5 rounded-[14px] border-[1.5px] p-3.5 font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand",
                      on ? "border-brand bg-mint" : "border-line bg-surface",
                    )}
                  >
                    <input type="radio" name="tipo" value={t.id} checked={on} onChange={() => setType(t.id)} className="sr-only" />
                    <Icon name={t.icon} size={22} className="text-brand" />
                    {t.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <TextField label="Nome do negócio" name="negocio" required placeholder="Ex.: Barbearia Central" large />
            <TextField label="Cidade" name="cidade" required placeholder="Cidade / UF" autoComplete="address-level2" large />
          </div>
          <fieldset>
            <legend className="mb-2.5 font-semibold">Quantas pessoas atendem?</legend>
            <FilterChips
              label="Quantas pessoas atendem"
              options={TEAM_SIZES}
              value={team}
              onChange={(v) => {
                setTeam(v);
                setPlan(null);
              }}
            />
          </fieldset>
          <div className="flex gap-2.5">
            {backButton("conta")}
            <Button type="submit" size="xl" className="flex-[2] font-bold">
              Continuar
            </Button>
          </div>
        </form>
      )}

      {step === "plano" && (
        <form method="post" onSubmit={(e) => submit(e, "pronto")} className="flex flex-col gap-[18px]">
          <AuthHeading title="Escolha o plano para depois do teste" subtitle="Você não paga nada agora e pode trocar quando quiser." />
          <fieldset className="flex flex-col gap-2.5">
            <legend className="sr-only">Plano</legend>
            {PLANS.map((p) => {
              const on = chosen === p.id;
              return (
                <label
                  key={p.id}
                  className={cn(
                    "grid cursor-pointer grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-[14px] border-[1.5px] px-[18px] py-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand",
                    on ? "border-brand bg-mint" : "border-line bg-surface",
                  )}
                >
                  <input type="radio" name="plano" value={p.id} checked={on} onChange={() => setPlan(p.id)} className="sr-only" />
                  <span
                    aria-hidden="true"
                    className={cn("size-5 rounded-full bg-white", on ? "border-[6px] border-brand" : "border-2 border-line-strong")}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-[17px] font-bold">{p.name}</strong>
                      {p.id === recommended && <Badge tone="brass">Indicado para você</Badge>}
                    </span>
                    <span className="text-sm text-muted">{PLAN_DESC[p.id]}</span>
                  </span>
                  <span className="whitespace-nowrap font-bold">
                    {brl(p.price)}
                    <span className="font-normal text-muted">/mês</span>
                  </span>
                </label>
              );
            })}
          </fieldset>
          <div className="flex gap-3 rounded-xl bg-sage px-4 py-3.5 text-sm leading-[1.45] text-brand-ink">
            <Icon name="clock" size={20} strokeWidth={2} className="flex-none" />
            <span>
              Seu teste vai até {trialEnd()}. Avisamos 3 dias antes e só cobramos se você cadastrar um cartão.
            </span>
          </div>
          <div className="flex gap-2.5">
            {backButton("negocio")}
            <Button type="submit" size="xl" className="flex-[2] font-bold">
              Começar meu teste grátis
            </Button>
          </div>
        </form>
      )}

      {step === "pronto" && (
        <div className="flex flex-col gap-[22px]">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand text-white">
            <Icon name="check" size={30} strokeWidth={2.4} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 tabIndex={-1} className="text-[34px] font-bold tracking-[-0.035em]">
              Tudo pronto!
            </h1>
            <p className="text-body">
              Sua conta foi criada e o teste do plano {PLANS.find((p) => p.id === chosen)!.name} já começou.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3.5">
            <span className="flex flex-[1_1_200px] flex-col gap-0.5">
              <span className="text-xs text-muted">Seu link de agendamento</span>
              <strong className="font-semibold">{bookingUrl(slug)}</strong>
            </span>
            <Button variant="secondary" className="border-line-strong" onClick={copy} aria-live="polite">
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <ol className="flex flex-col gap-3">
            {["Confira os serviços e preços que já sugerimos", "Convide sua equipe pelo WhatsApp", "Coloque o link na bio do Instagram"].map(
              (item, i) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex size-7 flex-none items-center justify-center rounded-full bg-sand text-[13px] font-bold">{i + 1}</span>
                  {item}
                </li>
              ),
            )}
          </ol>
          <ButtonLink href="/app/agenda" size="xl" iconRight="arrowRight" className="font-bold">
            Ir para minha agenda
          </ButtonLink>
          <p className="text-center text-sm text-muted">
            Prefere ver como fica para o cliente? <Link href={`/agendar/${BUSINESS.slug}`}>Abrir exemplo</Link>
          </p>
        </div>
      )}
    </div>
  );
}
