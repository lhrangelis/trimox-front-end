import type { ProId } from "./team";

/* ───────── Caixa do dia ───────── */

export type PaymentMethod = "Pix" | "Crédito" | "Débito" | "Dinheiro";
export const PAYMENT_METHODS: PaymentMethod[] = ["Pix", "Crédito", "Débito", "Dinheiro"];

export type CashEntry = { time: string; client: string; items: string; pro: string; method: PaymentMethod; value: number; products: number };

export const CASH_ENTRIES: CashEntry[] = [
  { time: "09:48", client: "Thiago Martins", items: "Corte + barba · Pomada modeladora", pro: "Rafael", method: "Pix", value: 120, products: 45 },
  { time: "10:05", client: "Marcos Vieira", items: "Corte na máquina", pro: "Bruno", method: "Dinheiro", value: 40, products: 0 },
  { time: "10:35", client: "Lucas Pereira", items: "Corte degradê", pro: "Rafael", method: "Débito", value: 50, products: 0 },
  { time: "10:42", client: "Fernanda Oliveira", items: "Coloração", pro: "Camila", method: "Pix", value: 180, products: 0 },
  { time: "10:50", client: "Ana Clara Dias", items: "Manicure + pedicure", pro: "Juliana", method: "Débito", value: 70, products: 0 },
  { time: "11:35", client: "Mariana Freitas", items: "Design de sobrancelha", pro: "Juliana", method: "Pix", value: 40, products: 0 },
  { time: "11:38", client: "Rodrigo Alves", items: "Platinado", pro: "Bruno", method: "Crédito", value: 180, products: 0 },
  { time: "12:05", client: "André Santos", items: "Corte, barba e sobrancelha", pro: "Rafael", method: "Pix", value: 90, products: 0 },
  { time: "12:06", client: "Patrícia Nunes", items: "Escova + hidratação", pro: "Camila", method: "Crédito", value: 110, products: 0 },
  { time: "13:32", client: "Vinícius Teixeira", items: "Corte", pro: "Bruno", method: "Pix", value: 45, products: 0 },
  { time: "14:16", client: "Pedro Henrique", items: "Barba completa · Óleo para barba", pro: "Rafael", method: "Dinheiro", value: 55, products: 20 },
];

export const CASH_DRAWER = { openedAt: "08:52", openedBy: "Rafael", initialChange: 150, withdrawals: 0, remainingToday: 12 };

/* ───────── Comissões ───────── */

export type CommissionPeriod = {
  id: string;
  label: string;
  range: string;
  payLabel: string;
  payNote: string;
  paid: boolean;
  rows: Record<ProId, { appointments: number; revenue: number; advances: number }>;
};

export const COMMISSION_PERIODS: CommissionPeriod[] = [
  {
    id: "2026-10a",
    label: "1–15 out",
    range: "01 a 15 de outubro · em aberto",
    payLabel: "A pagar em 16/10",
    payNote: "fecha automaticamente no dia 15",
    paid: false,
    rows: {
      rafael: { appointments: 92, revenue: 6120, advances: 0 },
      bruno: { appointments: 88, revenue: 4820, advances: 200 },
      camila: { appointments: 41, revenue: 6930, advances: 0 },
      juliana: { appointments: 63, revenue: 3410, advances: 150 },
    },
  },
  {
    id: "2026-09b",
    label: "16–30 set",
    range: "16 a 30 de setembro · fechado",
    payLabel: "Pago em 01/10",
    payNote: "via Pix para cada profissional",
    paid: true,
    rows: {
      rafael: { appointments: 98, revenue: 6540, advances: 0 },
      bruno: { appointments: 95, revenue: 5140, advances: 0 },
      camila: { appointments: 44, revenue: 7200, advances: 300 },
      juliana: { appointments: 70, revenue: 3780, advances: 0 },
    },
  },
];

export type StatementLine = { date: string; what: string; sub: string; base: number | null; rate: number };

/** Extrato da quinzena em aberto. `base: null` = vale (rate guarda o valor negativo). */
export const STATEMENTS: Record<ProId, StatementLine[]> = {
  rafael: [],
  bruno: [
    { date: "13/10", what: "Corte", sub: "Vinícius Teixeira", base: 45, rate: 45 },
    { date: "13/10", what: "Platinado", sub: "Rodrigo Alves", base: 180, rate: 45 },
    { date: "13/10", what: "Corte na máquina", sub: "Marcos Vieira", base: 40, rate: 45 },
    { date: "12/10", what: "Corte + barba", sub: "Caio Barros", base: 75, rate: 45 },
    { date: "10/10", what: "Vale", sub: "adiantamento em dinheiro", base: null, rate: -200 },
  ],
  camila: [
    { date: "13/10", what: "Escova + hidratação", sub: "Patrícia Nunes", base: 110, rate: 40 },
    { date: "13/10", what: "Coloração", sub: "Fernanda Oliveira", base: 180, rate: 40 },
    { date: "10/10", what: "Mechas", sub: "Juliana Prado", base: 320, rate: 40 },
    { date: "09/10", what: "Corte feminino", sub: "Bianca Moraes", base: 90, rate: 40 },
  ],
  juliana: [
    { date: "13/10", what: "Design de sobrancelha", sub: "Mariana Freitas", base: 40, rate: 50 },
    { date: "13/10", what: "Manicure + pedicure", sub: "Ana Clara Dias", base: 70, rate: 50 },
    { date: "10/10", what: "Manicure em gel", sub: "Carla Mendes", base: 95, rate: 50 },
    { date: "09/10", what: "Vale", sub: "adiantamento via Pix", base: null, rate: -150 },
  ],
};

/* ───────── Relatórios ───────── */

export const MONTHLY_REVENUE = [
  { short: "Nov", full: "novembro/25", value: 30400 },
  { short: "Dez", full: "dezembro/25", value: 38600 },
  { short: "Jan", full: "janeiro", value: 31200 },
  { short: "Fev", full: "fevereiro", value: 32000 },
  { short: "Mar", full: "março", value: 33900 },
  { short: "Abr", full: "abril", value: 35100 },
  { short: "Mai", full: "maio", value: 34600 },
  { short: "Jun", full: "junho", value: 37000 },
  { short: "Jul", full: "julho", value: 38400 },
  { short: "Ago", full: "agosto", value: 40100 },
  { short: "Set", full: "setembro", value: 43200 },
  { short: "Out", full: "outubro (até dia 13)", value: 21300 },
];

/** Faturamento diário dos últimos 30 dias (14/09 a 13/10), gerado de forma determinística. */
export function dailyRevenue() {
  const byWeekday = [0, 1100, 1300, 1400, 1500, 2100, 2600];
  const names = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2026, 8, 14 + i);
    const wd = date.getDay();
    const isToday = i === 29;
    const value = isToday ? 980 : Math.round((byWeekday[wd] * (0.88 + 0.24 * (((i * 37) % 10) / 10))) / 10) * 10;
    const dm = `${date.getDate()}/${date.getMonth() + 1}`;
    return { short: dm, weekday: names[wd], full: `${names[wd]}, ${dm}${isToday ? " (hoje, parcial)" : ""}`, value };
  });
}

export const TOP_SERVICES = [
  { name: "Corte + barba", count: 148 },
  { name: "Corte degradê", count: 131 },
  { name: "Corte masculino", count: 96 },
  { name: "Barba completa", count: 74 },
  { name: "Manicure", count: 61 },
  { name: "Escova + hidratação", count: 44 },
];

export const CLIENT_MIX = [
  { month: "Mai", returning: 455, fresh: 62 },
  { month: "Jun", returning: 470, fresh: 71 },
  { month: "Jul", returning: 488, fresh: 58 },
  { month: "Ago", returning: 502, fresh: 80 },
  { month: "Set", returning: 520, fresh: 86 },
  { month: "Out", returning: 250, fresh: 44 },
];

export const TEAM_SEPTEMBER = [
  { name: "Rafael Souza", revenue: 12500, appointments: 196, ticket: 64, occupancy: 84 },
  { name: "Bruno Lima", revenue: 9900, appointments: 186, ticket: 53, occupancy: 80 },
  { name: "Camila Rocha", revenue: 13600, appointments: 86, ticket: 158, occupancy: 76 },
  { name: "Juliana Alves", revenue: 7200, appointments: 138, ticket: 52, occupancy: 63 },
];

/** Mapa de calor: média de atendimentos por dia da semana × hora. */
export function peakHours() {
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const days: [string, number][] = [["Seg", 0.55], ["Ter", 0.7], ["Qua", 0.75], ["Qui", 0.8], ["Sex", 1.0], ["Sáb", 1.15]];
  const hourFactor = [0.45, 0.75, 0.85, 0.6, 0.5, 0.6, 0.75, 0.85, 1.0, 0.85];
  const saturday = [0.95, 1.0, 1.0, 0.9, 0.7, 0.65, 0.7, 0.6, 0.45, 0.25];
  return {
    hours,
    rows: days.map(([day, factor], di) => ({
      day,
      cells: hours.map((hour, hi) => {
        const f = di === 5 ? saturday[hi] * 1.15 : factor * hourFactor[hi];
        return { hour, avg: Math.round(f * 10), level: Math.max(0, Math.min(5, Math.round(f * 5))) };
      }),
    })),
  };
}
