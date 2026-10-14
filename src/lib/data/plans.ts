/**
 * Planos da Trimox. No design havia `R$ [PREÇO]` e `[N] dias` na landing e no cadastro,
 * mas o painel do CEO já usava estes valores — eles foram unificados aqui.
 * Decisão de produto pendente: confirmar preços e duração do teste.
 */
export const TRIAL_DAYS = 14;

export type PlanId = "solo" | "equipe" | "rede";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  /** Limite de profissionais; `null` = sem limite. */
  maxPros: number | null;
  audience: string;
  limitLabel: string;
  highlights: string[];
};

export const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Solo",
    price: 69,
    maxPros: 1,
    audience: "Para quem atende sozinho",
    limitLabel: "1 profissional",
    highlights: ["1 profissional", "Link de agendamento online", "Lembretes por WhatsApp", "Caixa do dia"],
  },
  {
    id: "equipe",
    name: "Equipe",
    price: 129,
    maxPros: 6,
    audience: "Até 6 profissionais",
    limitLabel: "até 6 profissionais",
    highlights: ["Tudo do Solo", "Agenda por profissional", "Comissões automáticas", "Relatórios e estoque"],
  },
  {
    id: "rede",
    name: "Rede",
    price: 349,
    maxPros: null,
    audience: "Para mais de uma unidade",
    limitLabel: "várias unidades",
    highlights: ["Tudo do Equipe", "Várias unidades em um login", "Relatório consolidado", "Atendimento prioritário"],
  },
];

export const planById = (id: PlanId) => PLANS.find((p) => p.id === id)!;
