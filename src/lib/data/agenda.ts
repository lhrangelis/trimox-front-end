import type { ProId } from "./team";

export type AppointmentStatus = "done" | "now" | "confirmed" | "pending";

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  done: "Concluído",
  now: "Em atendimento",
  confirmed: "Confirmado",
  pending: "A confirmar",
};

export type Appointment = {
  pro: ProId;
  /** Hora de início em horas decimais (14.25 = 14:15). */
  start: number;
  minutes: number;
  client: string;
  service: string;
  status: AppointmentStatus;
};

const a = (pro: ProId, start: number, minutes: number, client: string, service: string, status: AppointmentStatus): Appointment => ({
  pro,
  start,
  minutes,
  client,
  service,
  status,
});

/** Agenda de terça, 13/10 — "agora" são 14:20. */
export const NOW_HOUR = 14 + 20 / 60;

export const APPOINTMENTS: Appointment[] = [
  a("rafael", 9, 45, "Thiago Martins", "Corte + barba", "done"),
  a("rafael", 10, 30, "Lucas Pereira", "Corte degradê", "done"),
  a("rafael", 11, 60, "André Santos", "Corte, barba e sobrancelha", "done"),
  a("rafael", 13.5, 45, "Pedro Henrique", "Barba completa", "done"),
  a("rafael", 14.25, 45, "Gabriel Ramos", "Corte + barba", "now"),
  a("rafael", 15.5, 30, "Felipe Costa", "Corte social", "confirmed"),
  a("rafael", 16.5, 45, "Diego Ferraz", "Corte + pigmentação", "pending"),

  a("bruno", 9.5, 30, "Marcos Vieira", "Corte na máquina", "done"),
  a("bruno", 10.5, 60, "Rodrigo Alves", "Platinado", "done"),
  a("bruno", 13, 30, "Vinícius Teixeira", "Corte", "done"),
  a("bruno", 14, 45, "Caio Barros", "Corte + barba", "now"),
  a("bruno", 15, 30, "Henrique Lopes", "Corte infantil", "confirmed"),
  a("bruno", 16, 60, "Matheus Gomes", "Relaxamento", "confirmed"),
  a("bruno", 17.25, 30, "João Paulo", "Barba", "pending"),

  a("camila", 9, 90, "Fernanda Oliveira", "Coloração", "done"),
  a("camila", 11, 60, "Patrícia Nunes", "Escova + hidratação", "done"),
  a("camila", 13.5, 120, "Beatriz Cardoso", "Mechas", "now"),
  a("camila", 16, 60, "Larissa Mendes", "Corte feminino", "confirmed"),

  a("juliana", 10, 45, "Ana Clara Dias", "Manicure + pedicure", "done"),
  a("juliana", 11, 30, "Mariana Freitas", "Design de sobrancelha", "done"),
  a("juliana", 14.5, 60, "Renata Silva", "Manicure em gel", "confirmed"),
  a("juliana", 15.75, 45, "Camila Torres", "Pedicure", "pending"),
  a("juliana", 17, 45, "Sofia Ribeiro", "Manicure", "confirmed"),
];

export const AGENDA_SUMMARY = {
  expectedRevenue: 1865,
  receivedRevenue: 980,
  occupancy: 71,
  remindersSent: 20,
};
