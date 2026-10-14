import type { Metadata } from "next";
import { AppShell, type NavItem } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS } from "@/lib/data/business";
import { OWNER } from "@/lib/data/team";

export const metadata: Metadata = {
  title: { default: "App", template: "%s · Trimox" },
  robots: { index: false },
};

const NAV: NavItem[] = [
  { href: "/app/agenda", label: "Agenda", icon: "calendar" },
  { href: "/app/clientes", label: "Clientes", icon: "users" },
  { href: "/app/servicos", label: "Serviços", icon: "tag" },
  { href: "/app/profissionais", label: "Profissionais", icon: "idBadge" },
  { href: "/app/caixa", label: "Caixa", icon: "wallet" },
  { href: "/app/comissoes", label: "Comissões", icon: "percent" },
  { href: "/app/relatorios", label: "Relatórios", icon: "chart" },
  { href: "/app/configuracoes", label: "Configurações", icon: "sliders" },
];

export default function SalonLayout({ children }: LayoutProps<"/app">) {
  return (
    <AppShell
      nav={NAV}
      navLabel="Menu principal"
      top={
        <button
          type="button"
          className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-left"
        >
          <span className="flex flex-col gap-px">
            <span className="text-xs text-muted">Unidade</span>
            <strong className="font-semibold text-graphite">
              {BUSINESS.name} · {BUSINESS.unit}
            </strong>
          </span>
          <Icon name="chevronDown" size={16} strokeWidth={2} className="text-muted" />
        </button>
      }
      footer={
        <div className="flex items-center gap-2.5 border-t border-line px-2 pt-3">
          <Avatar name={OWNER.name} initials={OWNER.initials} size={36} tone="dark" />
          <span className="flex flex-col gap-px">
            <strong className="font-semibold text-graphite">{OWNER.name}</strong>
            <span className="text-xs text-muted">{OWNER.shortRole}</span>
          </span>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
