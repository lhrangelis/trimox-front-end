import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Icon } from "@/components/ui/Icon";
import { TRIAL_DAYS } from "@/lib/data/plans";
import { SignupFlow } from "./SignupFlow";

export const metadata: Metadata = {
  title: "Criar conta e começar o teste",
  description: `Crie sua conta no Trimox e teste grátis por ${TRIAL_DAYS} dias, sem cartão de crédito.`,
};

export default function SignupPage() {
  return (
    <AuthLayout
      tone="brand"
      maxWidth={520}
      aside={
        <>
          <h2 className="text-[clamp(34px,3.4vw,48px)] font-bold leading-[1.04] tracking-[-0.04em] text-balance">
            Sua agenda organizada <span className="editorial">ainda hoje.</span>
          </h2>
          <ul className="flex flex-col gap-3.5 text-base">
            {[
              `${TRIAL_DAYS} dias grátis, sem cartão de crédito`,
              "Link de agendamento pronto na hora",
              "A gente ajuda a importar seus clientes",
              "Cancele quando quiser, sem multa",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="check" size={20} strokeWidth={2.2} className="mt-0.5 flex-none text-on-brand" />
                {item}
              </li>
            ))}
          </ul>
        </>
      }
      asideFooter={
        <>
          Já tem conta?{" "}
          <Link href="/entrar" className="font-bold text-white">
            Entrar
          </Link>
        </>
      }
    >
      <SignupFlow />
    </AuthLayout>
  );
}
