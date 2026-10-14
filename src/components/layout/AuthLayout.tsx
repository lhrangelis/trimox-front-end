import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/format";

/** Layout em duas colunas de Entrar e Criar conta: painel de marca + formulário. */
export function AuthLayout({
  tone,
  aside,
  asideFooter,
  topRight,
  maxWidth = 440,
  children,
}: {
  tone: "brand" | "dark";
  aside: ReactNode;
  asideFooter: ReactNode;
  topRight?: ReactNode;
  maxWidth?: number;
  children: ReactNode;
}) {
  const brand = tone === "brand";
  return (
    <div className="flex min-h-dvh flex-wrap text-[15px]">
      <aside
        className={cn(
          "flex flex-[1_1_400px] flex-col gap-12 px-6 py-10 text-linen sm:px-12",
          brand ? "bg-brand" : "bg-graphite",
        )}
      >
        <Link href="/" aria-label="Trimox, voltar ao site" className="self-start no-underline">
          <Logo
            size={34}
            background={brand ? "var(--color-linen)" : "var(--color-brand)"}
            foreground={brand ? "var(--color-brand)" : "var(--color-linen)"}
            wordmarkClassName="text-linen"
          />
        </Link>
        <div className="my-auto flex flex-col gap-7">{aside}</div>
        <p className={brand ? "text-on-brand" : "text-on-dark"}>{asideFooter}</p>
      </aside>

      <main className="flex min-w-0 flex-[999_1_560px] justify-center px-6 pb-12 pt-8">
        <div className="flex w-full flex-col gap-7" style={{ maxWidth }}>
          <div className="flex min-h-11 items-center justify-between gap-3">
            <Link href="/" className="flex min-h-11 items-center gap-1.5 font-semibold text-body no-underline">
              <Icon name="chevronLeft" size={18} strokeWidth={2} />
              Voltar ao site
            </Link>
            {topRight}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 tabIndex={-1} className="text-[32px] font-bold leading-tight tracking-[-0.035em]">{title}</h1>
      <p className="text-body">{subtitle}</p>
    </div>
  );
}

export function OrDivider({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-3 text-[13px] text-muted">
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
