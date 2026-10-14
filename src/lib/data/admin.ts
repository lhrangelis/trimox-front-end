import { PLANS, type PlanId } from "./plans";

/* ───────── Base de assinantes ───────── */

export const SUBSCRIBERS: Record<PlanId, number> = { solo: 512, equipe: 748, rede: 152 };

/** MRR por plano = preço × assinantes. O total é derivado, para nunca divergir da soma. */
export const MRR_BY_PLAN = PLANS.map((p) => ({ plan: p, clients: SUBSCRIBERS[p.id], mrr: p.price * SUBSCRIBERS[p.id] })).sort(
  (a, b) => b.mrr - a.mrr,
);
export const MRR = MRR_BY_PLAN.reduce((sum, p) => sum + p.mrr, 0);
export const PAYING = MRR_BY_PLAN.reduce((sum, p) => sum + p.clients, 0);
export const TRIALS = 214;
export const ACCOUNTS_TOTAL = PAYING + TRIALS;
export const MRR_SEPTEMBER = 175500;

export const MRR_HISTORY = [
  { short: "Nov", full: "novembro de 2025", value: 98200 },
  { short: "Dez", full: "dezembro de 2025", value: 106500 },
  { short: "Jan", full: "janeiro", value: 113900 },
  { short: "Fev", full: "fevereiro", value: 121000 },
  { short: "Mar", full: "março", value: 129800 },
  { short: "Abr", full: "abril", value: 137200 },
  { short: "Mai", full: "maio", value: 145600 },
  { short: "Jun", full: "junho", value: 152100 },
  { short: "Jul", full: "julho", value: 160400 },
  { short: "Ago", full: "agosto", value: 168900 },
  { short: "Set", full: "setembro", value: MRR_SEPTEMBER },
  { short: "Out", full: "outubro (hoje)", value: MRR },
];

export const SIGNUP_FLOW = [
  { month: "Mai", fresh: 118, churned: 24 },
  { month: "Jun", fresh: 124, churned: 27 },
  { month: "Jul", fresh: 131, churned: 25 },
  { month: "Ago", fresh: 129, churned: 29 },
  { month: "Set", fresh: 142, churned: 28 },
];

/** Ponte do MRR em outubro. Cancelamentos fecham exatamente no MRR atual. */
const NEW = 11240;
const UPGRADES = 2180;
const DOWNGRADES = -640;
export const MRR_BRIDGE = [
  { label: "MRR em 1º de outubro", value: MRR_SEPTEMBER, kind: "base" as const },
  { label: "Novos clientes", value: NEW, kind: "delta" as const },
  { label: "Upgrades de plano", value: UPGRADES, kind: "delta" as const },
  { label: "Downgrades", value: DOWNGRADES, kind: "delta" as const },
  { label: "Cancelamentos", value: MRR - MRR_SEPTEMBER - NEW - UPGRADES - DOWNGRADES, kind: "delta" as const },
  { label: "MRR hoje", value: MRR, kind: "base" as const },
];

export const RECEIVED_OCTOBER = 92310;

/* ───────── Contas (clientes da Trimox) ───────── */

export type AccountStatus = "ativo" | "teste" | "inadimplente" | "cancelado" | "suspenso";
export type Health = "Boa" | "Atenção" | "Risco" | "—";

export type Account = {
  id: string;
  name: string;
  type: "Barbearia" | "Salão";
  city: string;
  plan: PlanId;
  status: AccountStatus;
  pros: number;
  bookings30d: number;
  health: Health;
  lastAccess: string;
  owner: string;
  since: string;
  weeks: number[];
};

const acc = (
  name: string,
  type: Account["type"],
  city: string,
  plan: PlanId,
  status: AccountStatus,
  pros: number,
  bookings30d: number,
  health: Health,
  lastAccess: string,
  owner: string,
  since: string,
  weeks: number[],
): Account => ({
  id: name.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").trim().replace(/ +/g, "-"),
  name,
  type,
  city,
  plan,
  status,
  pros,
  bookings30d,
  health,
  lastAccess,
  owner,
  since,
  weeks,
});

export const ACCOUNTS: Account[] = [
  acc("Barbearia Navalha de Ouro", "Barbearia", "São Paulo/SP", "equipe", "ativo", 5, 812, "Boa", "há 5 min", "Marcelo Tavares", "mar/2025", [180, 186, 192, 198, 201, 205, 199, 207]),
  acc("Studio Bella Pele", "Salão", "Rio de Janeiro/RJ", "equipe", "inadimplente", 4, 455, "Risco", "há 2 dias", "Priscila Moura", "jun/2025", [120, 118, 121, 116, 112, 110, 108, 104]),
  acc("Barbearia Dom Bigode", "Barbearia", "Belo Horizonte/MG", "solo", "ativo", 1, 96, "Atenção", "há 9 dias", "Jorge Almeida", "jan/2026", [64, 66, 61, 58, 44, 31, 22, 18]),
  acc("Salão Flor de Lis", "Salão", "Curitiba/PR", "equipe", "teste", 3, 0, "Atenção", "há 4 dias", "Helena Duarte", "out/2026", [0, 0, 0, 0, 0, 0, 0, 0]),
  acc("Corte Fino Barbershop", "Barbearia", "Porto Alegre/RS", "rede", "ativo", 14, 2310, "Boa", "há 1 hora", "Ricardo Peixoto", "nov/2024", [520, 538, 545, 551, 560, 571, 576, 590]),
  acc("Espaço Mariana Lopes", "Salão", "São Paulo/SP", "solo", "ativo", 1, 188, "Boa", "hoje", "Mariana Lopes", "ago/2025", [42, 45, 44, 47, 46, 48, 47, 49]),
  acc("The Barber Club", "Barbearia", "Campinas/SP", "equipe", "ativo", 6, 1024, "Boa", "há 20 min", "Felipe Andrade", "fev/2025", [230, 238, 242, 250, 255, 252, 260, 262]),
  acc("Salão Vitória Régia", "Salão", "Manaus/AM", "equipe", "ativo", 6, 690, "Boa", "ontem", "Tereza Lima", "abr/2025", [160, 165, 170, 168, 172, 175, 171, 178]),
  acc("Barbearia Seu Zé", "Barbearia", "Recife/PE", "solo", "cancelado", 1, 0, "—", "há 41 dias", "José Carlos Silva", "set/2025", [38, 30, 22, 0, 0, 0, 0, 0]),
  acc("Studio Glamour", "Salão", "Goiânia/GO", "equipe", "teste", 4, 137, "Boa", "há 3 horas", "Daniela Rocha", "set/2026", [0, 0, 0, 0, 18, 29, 41, 49]),
  acc("Barbearia Cabra Macho", "Barbearia", "Fortaleza/CE", "equipe", "ativo", 4, 602, "Boa", "hoje", "Cícero Nunes", "jul/2025", [140, 142, 145, 149, 150, 151, 148, 153]),
  acc("Salão Bem Me Quer", "Salão", "Salvador/BA", "solo", "ativo", 1, 211, "Atenção", "hoje", "Luciana Santos", "mai/2026", [58, 55, 57, 54, 52, 53, 51, 50]),
];

export const ALERTS = [
  { account: "Studio Bella Pele", kind: "Pagamento recusado", why: "cartão falhou há 3 dias", icon: "card", tone: "danger" },
  { account: "Barbearia Dom Bigode", kind: "Uso em queda", why: "agendamentos −62% em 30 dias", icon: "trendDown", tone: "warning" },
  { account: "Salão Flor de Lis", kind: "Teste acabando", why: "faltam 2 dias, nenhum agendamento ainda", icon: "clock", tone: "warning" },
  { account: "Salão Bem Me Quer", kind: "Suporte", why: "4 chamados abertos esta semana", icon: "chat", tone: "info" },
] as const;

export const SIGNUPS_TODAY = [
  { time: "14:02", name: "Barber Lab", city: "Florianópolis/SC" },
  { time: "13:21", name: "Espaço Beleza Pura", city: "Londrina/PR" },
  { time: "11:05", name: "Barbearia Velho Chico", city: "Petrolina/PE" },
  { time: "10:40", name: "Studio Nails Bia", city: "Fortaleza/CE" },
  { time: "09:12", name: "Barbearia Alfa", city: "Santos/SP" },
];

/* ───────── Faturas ───────── */

export type InvoiceStatus = "Paga" | "Em aberto" | "Atrasada" | "Falhou";

export const INVOICES: { id: string; account: string; plan: PlanId; due: string; method: "Cartão" | "Pix" | "Boleto"; status: InvoiceStatus }[] = [
  { id: "#48213", account: "Corte Fino Barbershop", plan: "rede", due: "05/10", method: "Cartão", status: "Paga" },
  { id: "#48214", account: "Barbearia Navalha de Ouro", plan: "equipe", due: "05/10", method: "Cartão", status: "Paga" },
  { id: "#48215", account: "Studio Bella Pele", plan: "equipe", due: "05/10", method: "Cartão", status: "Falhou" },
  { id: "#48230", account: "The Barber Club", plan: "equipe", due: "08/10", method: "Pix", status: "Paga" },
  { id: "#48241", account: "Salão Bem Me Quer", plan: "solo", due: "09/10", method: "Boleto", status: "Atrasada" },
  { id: "#48252", account: "Espaço Mariana Lopes", plan: "solo", due: "10/10", method: "Cartão", status: "Paga" },
  { id: "#48266", account: "Barbearia Cabra Macho", plan: "equipe", due: "12/10", method: "Pix", status: "Paga" },
  { id: "#48270", account: "Barbearia Dom Bigode", plan: "solo", due: "12/10", method: "Cartão", status: "Falhou" },
  { id: "#48288", account: "Salão Vitória Régia", plan: "equipe", due: "15/10", method: "Cartão", status: "Em aberto" },
  { id: "#48302", account: "Barbearia Navalha de Ouro", plan: "equipe", due: "05/11", method: "Cartão", status: "Em aberto" },
];

/* ───────── Planos e recursos ───────── */

export const FEATURES: { label: string; plans: Record<PlanId, boolean> }[] = [
  { label: "Agendamento online", plans: { solo: true, equipe: true, rede: true } },
  { label: "Lembretes por WhatsApp", plans: { solo: true, equipe: true, rede: true } },
  { label: "Caixa e relatórios básicos", plans: { solo: true, equipe: true, rede: true } },
  { label: "Comissões automáticas", plans: { solo: false, equipe: true, rede: true } },
  { label: "Controle de estoque", plans: { solo: false, equipe: true, rede: true } },
  { label: "Sinal via Pix", plans: { solo: false, equipe: true, rede: true } },
  { label: "Várias unidades", plans: { solo: false, equipe: false, rede: true } },
  { label: "Acesso por API e integrações", plans: { solo: false, equipe: false, rede: true } },
];

export const BETAS = [
  { name: "Assinatura mensal para clientes finais", description: "O cliente paga um plano fixo e corta quantas vezes quiser", level: 1 },
  { name: "Lista de espera inteligente", description: "Avisa quem está esperando quando um horário vaga", level: 2 },
  { name: "App do profissional", description: "Agenda e comissões no celular de cada profissional", level: 0 },
];
