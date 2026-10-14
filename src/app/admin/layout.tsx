import type { Metadata } from "next";
import Link from "next/link";
import { AppShell, type NavItem } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Trimox" },
  robots: { index: false },
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Visão geral", icon: "grid" },
  { href: "/admin/clientes", label: "Clientes", icon: "store" },
  { href: "/admin/financeiro", label: "Financeiro", icon: "receipt" },
  { href: "/admin/planos", label: "Planos e recursos", icon: "layers" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AppShell
      nav={NAV}
      navLabel="Menu do administrador"
      tone="dark"
      badge={<span className="rounded-full bg-brass px-2 py-0.5 text-[11px] font-bold text-graphite">Admin</span>}
      footer={
        <div className="flex flex-col gap-3.5">
          <Link
            href="/app/agenda"
            className="flex min-h-11 items-center gap-2.5 rounded-[10px] border border-body px-3 font-semibold text-linen no-underline hover:text-white"
          >
            <Icon name="external" size={18} />
            Ver o app de um cliente
          </Link>
          <div className="flex items-center gap-2.5 border-t border-graphite-2 px-2 pt-3">
            <Avatar name="Luis" initials="LU" size={36} tone="light" />
            <span className="flex flex-col gap-px">
              <strong className="font-semibold text-linen">Luis</strong>
              <span className="text-xs text-on-dark-muted">CEO</span>
            </span>
          </div>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
