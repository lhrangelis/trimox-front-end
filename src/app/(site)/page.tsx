import Link from "next/link";
import type { ReactNode } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BUSINESS } from "@/lib/data/business";
import { PLANS, TRIAL_DAYS } from "@/lib/data/plans";
import { serviceById } from "@/lib/data/services";
import { brl, cn } from "@/lib/format";

const container = "mx-auto max-w-[1200px] px-6";
const h2 = "text-[clamp(34px,4vw,52px)] font-bold leading-[1.04] tracking-[-0.04em] text-balance";

function Em({ children }: { children: ReactNode }) {
  return <span className="editorial">{children}</span>;
}

const PREVIEW = [
  { time: "14:15", client: "Gabriel Ramos", detail: "Corte + barba · com Rafael", status: "now" },
  { time: "14:30", client: "Renata Silva", detail: "Manicure em gel · com Juliana", status: "ok" },
  { time: "15:00", client: "Henrique Lopes", detail: "Corte infantil · com Bruno", status: "ok" },
  { time: "15:45", client: "Camila Torres", detail: "Pedicure · com Juliana", status: "wait" },
  { time: "16:00", client: "Larissa Mendes", detail: "Corte feminino · com Camila", status: "ok" },
] as const;

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "calendarCheck",
    title: "Agendamento online 24h",
    text: "Seu link vai na bio do Instagram e no WhatsApp. O cliente escolhe serviço, profissional e horário sem precisar te chamar.",
  },
  {
    icon: "bell",
    title: "Lembretes que evitam faltas",
    text: "Confirmação e lembrete automáticos por WhatsApp. Quem não pode vir avisa antes, e o horário volta para a agenda.",
  },
  {
    icon: "percent",
    title: "Comissão sem planilha",
    text: "Defina a porcentagem por profissional e por serviço. No fim do mês, o fechamento de cada um já está pronto.",
  },
  {
    icon: "chart",
    title: "Caixa e relatórios",
    text: "Entradas do dia, formas de pagamento e ticket médio em uma tela. Veja quais serviços e horários mais vendem.",
  },
];

function Check({ className }: { className?: string }) {
  return <Icon name="check" size={18} strokeWidth={2.2} className={cn("mt-[3px] flex-none", className)} />;
}

export default function LandingPage() {
  return (
    <div className="text-base leading-normal">
      <header className="border-b border-line">
        <div className={cn(container, "flex flex-wrap items-center justify-between gap-4 py-[18px]")}>
          <Link href="/" aria-label="Trimox, página inicial" className="no-underline">
            <Logo size={34} />
          </Link>
          <nav aria-label="Navegação" className="flex flex-wrap items-center gap-x-7 gap-y-1 text-[15px]">
            {[
              ["#recursos", "Recursos"],
              ["#para-quem", "Para quem é"],
              ["#precos", "Preços"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="py-2.5 text-body no-underline hover:text-graphite">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink href="/entrar" variant="ghost" className="text-[15px] text-graphite">
              Entrar
            </ButtonLink>
            <ButtonLink href="/cadastro" className="text-[15px]">
              Teste grátis
            </ButtonLink>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={cn(container, "grid items-center gap-14 pb-24 pt-20 lg:grid-cols-2")}>
          <div className="flex flex-col gap-6">
            <span className="flex items-center gap-2 self-start rounded-full border border-disabled px-3 py-1.5 text-[13px] font-semibold text-body">
              <span className="size-1.5 rounded-full bg-brass" />
              Para barbearias e salões de beleza
            </span>
            <h1 className="text-[clamp(46px,6vw,80px)] font-bold leading-[0.98] tracking-[-0.045em] text-balance">
              Agenda cheia, <Em>cadeira girando.</Em>
            </h1>
            <p className="max-w-[520px] text-[19px] leading-[1.55] text-body text-pretty">
              Agendamento online, lembretes por WhatsApp, comissões e caixa no mesmo lugar. O Trimox cuida da parte chata para a sua
              equipe cuidar dos clientes.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <ButtonLink href="/cadastro" size="xl" iconRight="arrowRight">
                Começar teste grátis
              </ButtonLink>
              <ButtonLink href="#recursos" size="xl" variant="secondary" className="border-line-strong">
                Ver como funciona
              </ButtonLink>
            </div>
            <span className="text-sm text-muted">{TRIAL_DAYS} dias grátis · sem cartão de crédito · cancele quando quiser</span>
          </div>

          <div className="relative pb-10" aria-label="Exemplo da agenda do dia no Trimox" role="img">
            <div className="overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_24px_48px_-24px_rgba(21,23,26,0.18)]" aria-hidden="true">
              <div className="flex items-center justify-between border-b border-line-soft px-[22px] py-[18px]">
                <div className="flex flex-col gap-0.5">
                  <strong className="text-[17px] font-bold tracking-[-0.02em]">Hoje, terça</strong>
                  <span className="text-[13px] text-muted">13 de outubro · 23 agendamentos</span>
                </div>
                <Badge tone="success">71% ocupado</Badge>
              </div>
              <ul className="flex flex-col gap-0.5 px-2.5 pb-3 pt-2">
                {PREVIEW.map((row) => {
                  const now = row.status === "now";
                  return (
                    <li
                      key={row.time}
                      className={cn("grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-3", now && "bg-brand text-linen")}
                    >
                      <span className="tabular text-sm font-semibold">{row.time}</span>
                      <span className="flex min-w-0 flex-col">
                        <strong className="font-semibold">{row.client}</strong>
                        <span className={cn("text-[13px]", now ? "opacity-80" : "text-muted")}>{row.detail}</span>
                      </span>
                      {now ? (
                        <span className="rounded-full bg-linen/15 px-2 py-1 text-xs font-semibold">Na cadeira</span>
                      ) : row.status === "wait" ? (
                        <Badge tone="warning">A confirmar</Badge>
                      ) : (
                        <Badge tone="success">Confirmado</Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="absolute bottom-0 left-0 flex w-[290px] max-w-[80%] flex-col gap-1.5 rounded-2xl bg-graphite px-4 py-3.5 text-linen shadow-[0_20px_40px_-20px_rgba(21,23,26,0.45)] sm:-left-5" aria-hidden="true">
              <span className="flex items-center gap-2 text-xs text-on-dark-muted">
                <Icon name="chat" size={14} strokeWidth={2} />
                Lembrete automático · WhatsApp
              </span>
              <span className="text-sm leading-[1.45]">
                Oi, Diego! Seu horário com o Rafael é amanhã às 16:30. Responda <strong>1</strong> para confirmar ou <strong>2</strong> para
                remarcar.
              </span>
            </div>
          </div>
        </section>

        {/* Prova social — placeholders aguardando logos reais */}
        <section aria-label="Clientes" className="border-y border-line">
          <div className={cn(container, "flex flex-wrap items-center justify-between gap-x-8 gap-y-5 py-8")}>
            <span className="text-sm text-muted">Barbearias e salões de todo o Brasil já organizam a agenda com o Trimox</span>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i} className="flex h-11 w-[132px] items-center justify-center rounded-lg border border-dashed border-line-strong text-xs text-muted">
                  [Logo cliente]
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Recursos */}
        <section id="recursos" className={cn(container, "flex scroll-mt-6 flex-col gap-14 py-[104px]")}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className={cn(h2, "max-w-[680px]")}>
              Menos tempo no WhatsApp, <Em>mais tempo na cadeira.</Em>
            </h2>
            <p className="max-w-[380px] text-body text-pretty">
              Tudo o que hoje vive em caderno, planilha e conversa solta passa a ter um lugar — e a funcionar sozinho.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-3.5 border-t-[1.5px] border-graphite pt-6">
                <Icon name={f.icon} size={28} strokeWidth={1.7} className="text-brand" />
                <h3 className="text-xl font-bold tracking-[-0.02em]">{f.title}</h3>
                <p className="text-[15px] text-body text-pretty">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Link de agendamento */}
        <section className="bg-graphite text-linen">
          <div className={cn(container, "grid items-center gap-16 py-[104px] lg:grid-cols-2")}>
            <div className="flex flex-col gap-6">
              <span className="eyebrow text-[13px] tracking-[0.08em] text-on-dark-muted">Link de agendamento</span>
              <h2 className={h2}>
                O link que agenda <Em>enquanto você corta.</Em>
              </h2>
              <p className="max-w-[480px] text-lg text-on-dark text-pretty">
                Uma página com a cara do seu negócio, onde o cliente marca em menos de um minuto. Sem app para baixar, sem cadastro
                complicado.
              </p>
              <ul className="mt-2 flex flex-col gap-3.5">
                {[
                  "Só aparecem horários realmente livres de cada profissional",
                  "Sinal via Pix para serviços longos, se você quiser",
                  "Cliente remarca sozinho, dentro das regras que você definir",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="text-mint-on-dark" />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href={`/agendar/${BUSINESS.slug}`} variant="light" size="lg" iconRight="arrowRight" className="self-start">
                Ver um exemplo
              </ButtonLink>
            </div>
            <PhoneMock />
          </div>
        </section>

        {/* Para quem é */}
        <section id="para-quem" className={cn(container, "flex scroll-mt-6 flex-col gap-12 py-[104px]")}>
          <h2 className={cn(h2, "max-w-[720px]")}>
            Feito para o jeito que <Em>cada casa</Em> trabalha.
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            <Audience
              eyebrow="Barbearias"
              title="Encaixe, fila e cliente de toda semana."
              text="Fila de espera para quem chega sem horário, planos de assinatura para o cliente fiel e agenda que respeita o ritmo rápido de cortes de 30 minutos."
              tags={["Fila de espera", "Assinatura mensal", "Venda de produtos"]}
            />
            <Audience
              tinted
              eyebrow="Salões de beleza"
              title="Serviços longos, etapas e pacotes."
              text="Coloração com tempo de pausa, pacotes de manicure, ficha técnica de cada cliente e controle dos produtos usados em cada atendimento."
              tags={["Ficha da cliente", "Pacotes", "Controle de estoque"]}
            />
          </div>
        </section>

        {/* Preços */}
        <section id="precos" className="scroll-mt-6 border-t border-line">
          <div className={cn(container, "flex flex-col gap-12 py-[104px]")}>
            <div className="flex flex-col items-center gap-3.5 text-center">
              <h2 className={h2}>
                Planos simples, <Em>sem surpresa.</Em>
              </h2>
              <p className="text-body">Todos os planos começam com {TRIAL_DAYS} dias grátis.</p>
            </div>
            <div className="grid items-stretch gap-5 md:grid-cols-3">
              {PLANS.map((plan) => {
                const featured = plan.id === "equipe";
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "flex flex-col gap-5 rounded-[20px] p-8",
                      featured ? "bg-graphite text-linen" : "border border-line bg-surface",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <span className={cn("text-[15px]", featured ? "text-on-dark-muted" : "text-muted")}>{plan.audience}</span>
                      </div>
                      {featured && <Badge tone="brass">Mais escolhido</Badge>}
                    </div>
                    <p className="flex items-baseline gap-1">
                      <strong className="text-[40px] font-bold tracking-[-0.04em]">{brl(plan.price)}</strong>
                      <span className={featured ? "text-on-dark-muted" : "text-muted"}>/mês</span>
                    </p>
                    <ul className="flex flex-col gap-2.5 text-[15px]">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5">
                          <Check className={featured ? "text-mint-on-dark" : "text-brand"} />
                          {h}
                        </li>
                      ))}
                    </ul>
                    {plan.id === "rede" ? (
                      <ButtonLink href="mailto:contato@trimox.app" variant="secondary" size="lg" className="mt-auto border-line-strong">
                        Falar com a gente
                      </ButtonLink>
                    ) : (
                      <ButtonLink
                        href="/cadastro"
                        variant={featured ? "light" : "secondary"}
                        size="lg"
                        className={cn("mt-auto", !featured && "border-line-strong")}
                      >
                        Começar teste grátis
                      </ButtonLink>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className={cn(container, "pb-24")}>
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-brand p-[clamp(40px,6vw,72px)] text-linen">
            <div className="flex max-w-[620px] flex-col gap-3">
              <h2 className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.05] tracking-[-0.04em]">
                Pronto para encher <Em>a agenda?</Em>
              </h2>
              <p className="text-lg text-on-brand">Configure serviços e equipe em poucos minutos. A gente ajuda a importar seus clientes.</p>
            </div>
            <ButtonLink href="/cadastro" variant="light" iconRight="arrowRight" className="min-h-14 rounded-[14px] px-7 text-[17px] font-bold">
              Começar teste grátis
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className={cn(container, "flex flex-wrap items-center justify-between gap-5 pb-12 pt-10 text-sm text-muted")}>
          <div className="flex items-center gap-2.5">
            <LogoMark size={26} background="var(--color-graphite)" />
            <span>© 2026 Trimox</span>
          </div>
          <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/identidade" className="py-2 text-muted no-underline hover:text-graphite">
              Identidade visual
            </Link>
            {["Termos de uso", "Privacidade", "Contato"].map((l) => (
              <a key={l} href="#" className="py-2 text-muted no-underline hover:text-graphite">
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Audience({ eyebrow, title, text, tags, tinted }: { eyebrow: string; title: string; text: string; tags: string[]; tinted?: boolean }) {
  return (
    <div className={cn("flex min-h-80 flex-col gap-[18px] rounded-3xl p-10", tinted ? "bg-sage" : "border border-line bg-surface")}>
      <span className={cn("eyebrow text-[13px] tracking-[0.08em]", tinted && "text-brand-ink")}>{eyebrow}</span>
      <h3 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em]">{title}</h3>
      <p className={cn("text-pretty", tinted ? "text-brand-ink" : "text-body")}>{text}</p>
      <div className="mt-auto flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={cn("rounded-full px-3 py-1.5 text-[13px]", tinted ? "bg-surface" : "bg-chip")}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PhoneMock() {
  const options = ["corte-barba", "corte-masculino", "barba"].map(serviceById);
  return (
    <div className="flex justify-center" role="img" aria-label="Exemplo da página de agendamento no celular">
      <div className="w-[320px] max-w-full rounded-[36px] bg-linen p-2.5 text-graphite shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]" aria-hidden="true">
        <div className="flex flex-col overflow-hidden rounded-[28px] bg-surface">
          <div className="flex items-center gap-3 border-b border-line-soft px-5 pb-4 pt-[22px]">
            <LogoMark size={44} background="var(--color-graphite)" />
            <span className="flex flex-col">
              <strong className="font-bold">{BUSINESS.name}</strong>
              <span className="text-xs text-muted">{BUSINESS.addressShort}</span>
            </span>
          </div>
          <div className="flex flex-col gap-2.5 px-5 py-4">
            <span className="eyebrow">Escolha o serviço</span>
            {options.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-3",
                  i === 0 ? "border-[1.5px] border-brand bg-mint" : "border border-line",
                )}
              >
                <span className="flex flex-col">
                  <strong className="text-[15px] font-semibold">{s.name}</strong>
                  <span className="text-xs text-muted">{s.minutes} min</span>
                </span>
                <strong className="text-[15px]">{brl(s.price)}</strong>
              </div>
            ))}
          </div>
          <div className="px-5 pb-[22px] pt-1.5">
            <span className="flex min-h-12 items-center justify-center rounded-xl bg-brand font-semibold text-white">Continuar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
