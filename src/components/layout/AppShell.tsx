"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/format";

export type NavItem = { href: string; label: string; icon: IconName };

type Theme = "light" | "dark";

const theme = {
  light: {
    aside: "bg-sidebar border-line text-body",
    item: "text-body hover:bg-sand/60 hover:text-graphite",
    active: "bg-sage text-brand font-semibold hover:bg-sage hover:text-brand",
    bar: "bg-sidebar border-line",
  },
  dark: {
    aside: "bg-graphite border-graphite text-on-dark",
    item: "text-on-dark hover:bg-graphite-2 hover:text-white",
    active: "bg-graphite-2 text-white font-semibold hover:text-white",
    bar: "bg-graphite border-graphite text-linen",
  },
};

/**
 * Casca do app e do painel admin: menu lateral fixo no desktop e gaveta no celular.
 * No design original o menu só "quebrava linha" no mobile e virava um bloco enorme no topo.
 */
export function AppShell({
  nav,
  navLabel,
  tone = "light",
  badge,
  top,
  footer,
  children,
}: {
  nav: NavItem[];
  navLabel: string;
  tone?: Theme;
  badge?: ReactNode;
  top?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = theme[tone];
  // Item ativo = prefixo mais longo da URL atual (assim "/admin" não acende em "/admin/clientes").
  const activeHref = nav
    .filter((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const dark = tone === "dark";

  // Esc fecha a gaveta; clicar em um item do menu também (ver onClick abaixo).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const brand = (
    <Link href={nav[0].href} className="flex items-center gap-2.5 px-2 no-underline" aria-label="Trimox, início">
      <Logo size={32} tone={dark ? "dark" : "light"} wordmarkClassName="text-[22px]" />
      {badge}
    </Link>
  );

  return (
    <div className="min-h-dvh text-sm lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      {/* Barra superior (celular/tablet) */}
      <div className={cn("sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 lg:hidden", t.bar)}>
        {brand}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="app-nav"
          className={cn("flex size-11 cursor-pointer items-center justify-center rounded-[10px] border", dark ? "border-graphite-2" : "border-line bg-surface")}
        >
          <Icon name={open ? "close" : "menu"} size={20} strokeWidth={2} />
          <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        </button>
      </div>

      {open && <div className="fixed inset-0 z-30 bg-graphite/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        id="app-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(280px,85vw)] flex-col gap-6 overflow-y-auto border-r px-4 py-6 transition-transform",
          "lg:sticky lg:top-0 lg:h-dvh lg:w-auto lg:translate-x-0",
          // Fechada no celular, sai também da ordem de tabulação.
          open ? "translate-x-0" : "-translate-x-full max-lg:invisible",
          t.aside,
        )}
      >
        <div className="hidden lg:block">{brand}</div>
        {top}
        <nav aria-label={navLabel} className="flex flex-col gap-0.5">
          {nav.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn("flex min-h-11 items-center gap-3 rounded-[10px] px-3 no-underline", active ? t.active : t.item)}
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">{footer}</div>
      </aside>

      <main className="flex min-w-0 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
