import type { Hours, Weekday } from "./business";

export type ProId = "rafael" | "bruno" | "camila" | "juliana";

export type Permission = "verAgendaEquipe" | "verFaturamento" | "registrarCaixa" | "darDescontos";

export const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "verAgendaEquipe", label: "Ver a agenda de toda a equipe" },
  { id: "verFaturamento", label: "Ver faturamento e relatórios" },
  { id: "registrarCaixa", label: "Registrar pagamentos no caixa" },
  { id: "darDescontos", label: "Dar descontos" },
];

export type Pro = {
  id: ProId;
  name: string;
  first: string;
  initials: string;
  role: string;
  shortRole: string;
  owner: boolean;
  /** % de comissão; `null` para o proprietário. */
  commission: number | null;
  occupancyToday: number;
  revenueMonth: number;
  services: string[];
  week: Record<Weekday, Hours>;
  permissions: Record<Permission, boolean>;
  avatarTone: "dark" | "sage" | "warm" | "sand";
};

const h = (open: string, close: string) => ({ open, close });

export const TEAM: Pro[] = [
  {
    id: "rafael",
    name: "Rafael Souza",
    first: "Rafael",
    initials: "RS",
    role: "Barbeiro · proprietário",
    shortRole: "Proprietário",
    owner: true,
    commission: null,
    occupancyToday: 86,
    revenueMonth: 6120,
    services: ["Corte masculino", "Corte degradê", "Barba completa", "Pigmentação de barba", "Corte + barba", "Corte, barba e sobrancelha"],
    week: { Segunda: null, Terça: h("09:00", "19:00"), Quarta: h("09:00", "19:00"), Quinta: h("09:00", "19:00"), Sexta: h("09:00", "19:00"), Sábado: h("08:00", "17:00"), Domingo: null },
    permissions: { verAgendaEquipe: true, verFaturamento: true, registrarCaixa: true, darDescontos: true },
    avatarTone: "dark",
  },
  {
    id: "bruno",
    name: "Bruno Lima",
    first: "Bruno",
    initials: "BL",
    role: "Barbeiro",
    shortRole: "Barbeiro",
    owner: false,
    commission: 45,
    occupancyToday: 82,
    revenueMonth: 4820,
    services: ["Corte masculino", "Corte degradê", "Corte infantil", "Barba completa", "Corte + barba", "Platinado"],
    week: { Segunda: h("10:00", "19:00"), Terça: h("09:00", "19:00"), Quarta: h("09:00", "19:00"), Quinta: null, Sexta: h("09:00", "20:00"), Sábado: h("08:00", "17:00"), Domingo: null },
    permissions: { verAgendaEquipe: false, verFaturamento: false, registrarCaixa: true, darDescontos: false },
    avatarTone: "sage",
  },
  {
    id: "camila",
    name: "Camila Rocha",
    first: "Camila",
    initials: "CR",
    role: "Cabeleireira e colorista",
    shortRole: "Cabeleireira",
    owner: false,
    commission: 40,
    occupancyToday: 78,
    revenueMonth: 6930,
    services: ["Corte feminino", "Escova + hidratação", "Coloração", "Mechas"],
    week: { Segunda: null, Terça: h("09:00", "18:00"), Quarta: h("09:00", "18:00"), Quinta: h("09:00", "18:00"), Sexta: h("09:00", "18:00"), Sábado: h("09:00", "16:00"), Domingo: null },
    permissions: { verAgendaEquipe: false, verFaturamento: false, registrarCaixa: true, darDescontos: false },
    avatarTone: "warm",
  },
  {
    id: "juliana",
    name: "Juliana Alves",
    first: "Juliana",
    initials: "JA",
    role: "Manicure e sobrancelhas",
    shortRole: "Manicure",
    owner: false,
    commission: 50,
    occupancyToday: 61,
    revenueMonth: 3410,
    services: ["Manicure", "Pedicure", "Manicure em gel", "Design de sobrancelha"],
    week: { Segunda: null, Terça: h("10:00", "19:00"), Quarta: h("10:00", "19:00"), Quinta: h("10:00", "19:00"), Sexta: h("10:00", "19:00"), Sábado: h("09:00", "17:00"), Domingo: null },
    permissions: { verAgendaEquipe: false, verFaturamento: false, registrarCaixa: false, darDescontos: false },
    avatarTone: "sand",
  },
];

export const proById = (id: ProId) => TEAM.find((p) => p.id === id)!;
export const OWNER = TEAM[0];
