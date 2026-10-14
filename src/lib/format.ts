const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const brlCents = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

/** R$ 1.865 · R$ 33,75 (centavos só quando existem). */
export function brl(value: number): string {
  return brlFormatter.format(value).replace(/ /g, " ");
}

/** Sempre com centavos: R$ 129,00. */
export function brlCentavos(value: number): string {
  return brlCents.format(value).replace(/ /g, " ");
}

/** Valor com sinal explícito para extratos: + R$ 20 / − R$ 200. */
export function brlSigned(value: number): string {
  const sign = value < 0 ? "− " : "+ ";
  return sign + brl(Math.abs(value));
}

export function num(value: number): string {
  return numberFormatter.format(value);
}

export function pct(value: number, digits = 0): string {
  return `${value.toFixed(digits).replace(".", ",")}%`;
}

/** 9.25 → "09:15" */
export function hourToLabel(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
