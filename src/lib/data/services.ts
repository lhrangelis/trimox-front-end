import type { ProId } from "./team";

export const SERVICE_CATEGORIES = ["Cabelo", "Barba", "Combos", "Coloração", "Unhas e estética"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export type Service = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  minutes: number;
  price: number;
  commission: number;
  pros: ProId[];
  online: boolean;
};

const s = (
  id: string,
  name: string,
  description: string,
  category: ServiceCategory,
  minutes: number,
  price: number,
  commission: number,
  pros: ProId[],
  online = true,
): Service => ({ id, name, description, category, minutes, price, commission, pros, online });

export const SERVICES: Service[] = [
  s("corte-masculino", "Corte masculino", "Tesoura ou máquina, com lavagem", "Cabelo", 30, 45, 45, ["rafael", "bruno"]),
  s("corte-degrade", "Corte degradê", "Acabamento na navalha", "Cabelo", 40, 50, 45, ["rafael", "bruno"]),
  s("corte-infantil", "Corte infantil", "Até 12 anos", "Cabelo", 30, 40, 45, ["bruno"]),
  s("corte-feminino", "Corte feminino", "Com lavagem e finalização", "Cabelo", 60, 90, 40, ["camila"]),
  s("escova-hidratacao", "Escova + hidratação", "Hidratação profunda e escova modelada", "Cabelo", 60, 110, 40, ["camila"]),
  s("barba", "Barba completa", "Toalha quente e navalha", "Barba", 30, 35, 45, ["rafael", "bruno"]),
  s("pigmentacao", "Pigmentação de barba", "Preenche falhas", "Barba", 30, 40, 45, ["rafael"]),
  s("corte-barba", "Corte + barba", "O combo mais pedido", "Combos", 45, 75, 45, ["rafael", "bruno"]),
  s("completo", "Corte, barba e sobrancelha", "Completo", "Combos", 60, 90, 45, ["rafael", "bruno"]),
  s("platinado", "Platinado", "Exige avaliação prévia", "Coloração", 90, 180, 40, ["bruno"], false),
  s("coloracao", "Coloração", "Raiz ou global", "Coloração", 90, 180, 40, ["camila"]),
  s("mechas", "Mechas", "Exige avaliação prévia", "Coloração", 120, 320, 40, ["camila"], false),
  s("manicure", "Manicure", "Cutilagem e esmaltação", "Unhas e estética", 40, 35, 50, ["juliana"]),
  s("pedicure", "Pedicure", "Cutilagem e esmaltação", "Unhas e estética", 45, 40, 50, ["juliana"]),
  s("manicure-gel", "Manicure em gel", "Duração de até 3 semanas", "Unhas e estética", 60, 95, 50, ["juliana"]),
  s("sobrancelha", "Design de sobrancelha", "Com pinça ou linha", "Unhas e estética", 30, 40, 50, ["juliana"]),
];

export const serviceById = (id: string) => SERVICES.find((x) => x.id === id)!;
