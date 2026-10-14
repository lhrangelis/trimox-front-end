export type ClientTag = "Frequente" | "Regular" | "Sumido" | "Novo";

export type Client = {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  visits: number;
  totalSpent: number;
  preferredPro: string;
  tag: ClientTag;
  since: string;
  avgTicket: number;
  returnsEvery: string;
  notes: string;
  history: { date: string; service: string; pro: string; value: number }[];
};

const c = (
  name: string,
  phone: string,
  lastVisit: string,
  visits: number,
  totalSpent: number,
  preferredPro: string,
  tag: ClientTag,
  since: string,
  avgTicket: number,
  returnsEvery: string,
  notes: string,
  service: string,
  value: number,
  dates: string[],
): Client => ({
  id: name.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").replace(/ /g, "-"),
  name,
  phone,
  lastVisit,
  visits,
  totalSpent,
  preferredPro,
  tag,
  since,
  avgTicket,
  returnsEvery,
  notes,
  history: dates.map((date) => ({ date, service, pro: preferredPro, value })),
});

export const CLIENT_TOTALS = { registered: 1284, newThisMonth: 86 };

export const CLIENTS: Client[] = [
  c("Gabriel Ramos", "(11) 98765-4321", "Hoje", 38, 2470, "Rafael", "Frequente", "mar/2023", 65, "15 dias", "Prefere degradê baixo. Barba com toalha quente.", "Corte + barba", 75, ["13/10", "28/09", "14/09"]),
  c("Fernanda Oliveira", "(11) 99812-3344", "Hoje", 22, 4180, "Camila", "Frequente", "jan/2024", 190, "30 dias", "Coloração 7.1 com matizador. Sensível a amônia: usar linha sem amônia.", "Coloração", 180, ["13/10", "12/09", "10/08"]),
  c("Lucas Pereira", "(11) 97654-1029", "Hoje", 15, 690, "Rafael", "Frequente", "ago/2024", 46, "15 dias", "Corte a cada duas semanas, sempre às terças.", "Corte degradê", 50, ["13/10", "29/09", "15/09"]),
  c("Thiago Martins", "(11) 98345-6677", "Hoje", 31, 2015, "Rafael", "Frequente", "mai/2023", 65, "20 dias", "Costuma levar pomada modeladora.", "Corte + barba", 75, ["13/10", "22/09", "01/09"]),
  c("Marcos Vieira", "(11) 98456-1200", "Hoje", 27, 1215, "Bruno", "Frequente", "fev/2024", 45, "21 dias", "Máquina 2 nas laterais.", "Corte na máquina", 40, ["13/10", "22/09", "01/09"]),
  c("Patrícia Nunes", "(11) 99234-5566", "Hoje", 12, 1560, "Camila", "Regular", "out/2024", 130, "30 dias", "Prefere horários pela manhã.", "Escova + hidratação", 110, ["13/10", "15/09", "18/08"]),
  c("Renata Silva", "(11) 99654-8890", "Há 18 dias", 14, 980, "Juliana", "Regular", "jun/2024", 70, "21 dias", "Esmalte em gel, tons nude.", "Manicure em gel", 95, ["25/09", "04/09", "14/08"]),
  c("Diego Ferraz", "(11) 98123-7788", "Há 32 dias", 9, 585, "Rafael", "Regular", "nov/2024", 65, "30 dias", "Horário hoje às 16:30, ainda não confirmou o lembrete.", "Corte + pigmentação", 85, ["11/09", "12/08", "10/07"]),
  c("Leonardo Batista", "(11) 97788-3412", "Há 61 dias", 6, 270, "Bruno", "Sumido", "jan/2025", 45, "30 dias", "Corte infantil para o filho, 8 anos.", "Corte infantil", 40, ["13/08", "10/07", "09/06"]),
  c("Eduardo Nogueira", "(11) 97230-9981", "Há 74 dias", 8, 1120, "Bruno", "Sumido", "set/2024", 140, "45 dias", "Platinado: retocar raiz a cada 6 semanas.", "Platinado", 180, ["31/07", "16/06", "02/05"]),
  c("Ana Clara Dias", "(11) 99102-4455", "Hoje", 3, 240, "Juliana", "Novo", "set/2026", 80, "—", "Chegou pelo link do Instagram.", "Manicure + pedicure", 70, ["13/10", "27/09", "13/09"]),
  c("Sofia Ribeiro", "(11) 99871-2234", "Há 9 dias", 5, 300, "Juliana", "Novo", "ago/2026", 60, "14 dias", "Indicação da Renata Silva.", "Manicure", 35, ["04/10", "20/09", "06/09"]),
];
