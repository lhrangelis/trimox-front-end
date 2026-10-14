import { cn } from "@/lib/format";

type MarkProps = {
  size?: number;
  /** Cor do quadrado. `none` desenha só a tesoura. */
  background?: string;
  /** Cor do traço da tesoura. */
  foreground?: string;
  className?: string;
};

/** Símbolo Trimox: tesoura aberta formando um X. */
export function LogoMark({
  size = 32,
  background = "var(--color-brand)",
  foreground = "var(--color-linen)",
  className,
}: MarkProps) {
  // Em tamanhos pequenos o traço engrossa para continuar legível (versão favicon).
  const small = size <= 32;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className={className}>
      {background !== "none" && <rect width="64" height="64" rx={small ? 14 : 16} fill={background} />}
      {small ? (
        <g stroke={foreground} strokeLinecap="round" fill="none">
          <path d="M20 12 L42 42" strokeWidth="6.5" />
          <path d="M44 12 L22 42" strokeWidth="6.5" />
          <circle cx="45" cy="47" r="6" strokeWidth="5.5" />
          <circle cx="19" cy="47" r="6" strokeWidth="5.5" />
        </g>
      ) : (
        <g stroke={foreground} strokeLinecap="round" fill="none">
          <path d="M21 13 L41.5 41" strokeWidth="5" />
          <path d="M43 13 L22.5 41" strokeWidth="5" />
          <circle cx="44.5" cy="46" r="5.5" strokeWidth="4" />
          <circle cx="19.5" cy="46" r="5.5" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={cn("font-extrabold tracking-[-0.05em] leading-none", className)}>trimox</span>;
}

type LogoProps = MarkProps & { wordmarkClassName?: string; tone?: "light" | "dark" };

/** Símbolo + nome lado a lado. `tone="dark"` é a versão negativa para fundos escuros. */
export function Logo({ size = 34, tone = "light", wordmarkClassName, className, ...mark }: LogoProps) {
  const dark = tone === "dark";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark
        size={size}
        background={mark.background ?? (dark ? "var(--color-linen)" : "var(--color-brand)")}
        foreground={mark.foreground ?? (dark ? "var(--color-graphite)" : "var(--color-linen)")}
      />
      <Wordmark className={cn("text-2xl", dark ? "text-linen" : "text-graphite", wordmarkClassName)} />
    </span>
  );
}
