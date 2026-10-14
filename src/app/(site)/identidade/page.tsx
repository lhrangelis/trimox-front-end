import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Identidade visual",
  description: "Logo, cores e tipografia da marca Trimox.",
};

const COLORS = [
  { name: "Verde Navalha", hex: "#1F4A3E", use: "ações e marca", className: "bg-brand" },
  { name: "Grafite", hex: "#15171A", use: "texto e superfícies escuras", className: "bg-graphite" },
  { name: "Linho", hex: "#F5F3EE", use: "fundo", className: "bg-linen border border-line" },
  { name: "Sálvia", hex: "#E4ECE7", use: "estados e destaques suaves", className: "bg-sage" },
  { name: "Latão", hex: "#B8873B", use: "detalhe, uso pontual", className: "bg-brass" },
];

const card = "flex flex-col rounded-[20px] border border-line bg-surface px-7 py-6";

export default function IdentityPage() {
  return (
    <main className="mx-auto flex max-w-[1312px] flex-col gap-10 px-6 py-16">
      <Link href="/" className="self-start font-semibold no-underline">
        ← Voltar ao site
      </Link>
      <header className="flex flex-wrap items-end justify-between gap-12">
        <div className="flex flex-col gap-3.5">
          <span className="eyebrow text-[13px] tracking-[0.08em]">Trimox · Identidade visual · v1</span>
          <h1 className="text-[clamp(40px,5vw,60px)] font-bold leading-[1.02] tracking-[-0.035em]">
            Agenda cheia, <span className="editorial">cadeira girando.</span>
          </h1>
        </div>
        <p className="max-w-[400px] text-base leading-[1.55] text-muted">
          Software de gestão para barbearias e salões de beleza. O símbolo une uma tesoura aberta à letra X — o ofício e a marca no
          mesmo traço.
        </p>
      </header>

      <section aria-label="Versões do logo" className="grid gap-5 lg:grid-cols-3">
        <div className={`${card} min-h-[300px]`}>
          <span className="eyebrow">Principal · fundo claro</span>
          <div className="flex flex-1 items-center justify-center gap-3.5">
            <LogoMark size={64} />
            <Wordmark className="text-[64px] tracking-[-0.055em]" />
          </div>
        </div>
        <div className="flex min-h-[300px] flex-col rounded-[20px] bg-graphite px-7 py-6">
          <span className="eyebrow text-on-dark-muted">Negativo · fundo escuro</span>
          <div className="flex flex-1 items-center justify-center gap-3.5">
            <LogoMark size={64} background="var(--color-linen)" foreground="var(--color-graphite)" />
            <Wordmark className="text-[64px] tracking-[-0.055em] text-linen" />
          </div>
        </div>
        <div className="flex min-h-[300px] flex-col rounded-[20px] bg-brand px-7 py-6">
          <span className="eyebrow text-on-brand">Cor da marca</span>
          <div className="flex flex-1 flex-col items-center justify-center gap-[18px]">
            <LogoMark size={96} background="none" />
            <Wordmark className="text-[40px] text-linen" />
          </div>
        </div>
      </section>

      <section aria-label="Símbolo, cores e tipografia" className="grid gap-5 lg:grid-cols-3">
        <div className={`${card} gap-5`}>
          <span className="eyebrow">Símbolo · ícone do app</span>
          <div className="flex flex-1 items-end gap-7">
            {[
              [104, "App"],
              [56, "Avatar"],
              [32, "Favicon"],
            ].map(([size, label]) => (
              <div key={label} className="flex flex-col items-center gap-2.5">
                <LogoMark size={size as number} />
                <span className="text-xs text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${card} gap-4`}>
          <span className="eyebrow">Cores</span>
          <ul className="flex flex-col gap-2.5">
            {COLORS.map((c) => (
              <li key={c.hex} className="flex items-center gap-3.5">
                <span className={`size-10 flex-none rounded-[10px] ${c.className}`} />
                <span className="flex flex-col gap-0.5">
                  <strong className="text-[15px] font-semibold">{c.name}</strong>
                  <span className="text-[13px] text-muted">
                    {c.hex} · {c.use}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${card} gap-4`}>
          <span className="eyebrow">Tipografia</span>
          <div className="flex items-baseline gap-[18px]">
            <span className="text-8xl font-bold leading-[0.9] tracking-[-0.05em]">Aa</span>
            <span className="editorial text-8xl leading-[0.9]">Aa</span>
          </div>
          <div className="mt-auto flex flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <strong className="text-[15px] font-semibold">Schibsted Grotesk</strong>
              <span className="text-[13px] text-muted">Títulos, interface e números — 400 a 800</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <strong className="editorial text-[19px]">Instrument Serif Itálico</strong>
              <span className="text-[13px] text-muted">Só em destaques editoriais do site</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
