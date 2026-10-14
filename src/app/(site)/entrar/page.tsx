import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginFlow } from "./LoginFlow";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <AuthLayout
      tone="dark"
      aside={
        <>
          <h2 className="text-[clamp(34px,3.4vw,48px)] font-bold leading-[1.04] tracking-[-0.04em] text-balance">
            Bom te ver <span className="editorial">de volta.</span>
          </h2>
          <div className="flex max-w-[360px] flex-col gap-2.5 rounded-2xl bg-linen px-[18px] py-4 text-graphite">
            <span className="eyebrow">Esperando por você hoje</span>
            {[
              ["Agendamentos", 23],
              ["Novos pelo link desde ontem", 6],
              ["Aguardando confirmação", 3],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span>{label}</span>
                <strong className="font-bold">{value}</strong>
              </div>
            ))}
          </div>
          <span className="text-[13px] text-on-dark-muted">Exemplo do resumo que aparece depois de entrar.</span>
        </>
      }
      asideFooter={
        <>
          Ainda não usa o Trimox?{" "}
          <Link href="/cadastro" className="font-bold text-white">
            Teste grátis
          </Link>
        </>
      }
    >
      <LoginFlow />
    </AuthLayout>
  );
}
