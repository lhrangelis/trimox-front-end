/** Negócio de demonstração usado no app da barbearia e no link de agendamento. */
export const BUSINESS = {
  name: "Barbearia Central",
  unit: "Centro",
  slug: "barbearia-central",
  type: "Barbearia e salão",
  whatsapp: "(11) 3000-0000",
  instagram: "@barbeariacentral",
  address: "Rua das Palmeiras, 120 · Centro · São Paulo/SP",
  addressShort: "Rua das Palmeiras, 120 · Centro",
  /** "Hoje" nos dados de exemplo. */
  today: { weekday: "Terça", day: 13, month: "outubro", year: 2026 },
};

export const bookingUrl = (slug = BUSINESS.slug) => `trimox.app/${slug}`;

export type Weekday = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo";
export const WEEKDAYS: Weekday[] = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export type Hours = { open: string; close: string } | null;

/**
 * Horário de funcionamento. No design a casa ficava fechada na segunda, mas o Bruno
 * atendia segunda das 10h às 19h — o horário da casa precisa conter o da equipe.
 */
export const OPENING_HOURS: Record<Weekday, Hours> = {
  Segunda: { open: "10:00", close: "19:00" },
  Terça: { open: "09:00", close: "20:00" },
  Quarta: { open: "09:00", close: "20:00" },
  Quinta: { open: "09:00", close: "20:00" },
  Sexta: { open: "09:00", close: "20:00" },
  Sábado: { open: "08:00", close: "17:00" },
  Domingo: null,
};
