"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthHeading, OrDivider } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { PasswordField, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

type View = "login" | "forgot" | "sent";

export function LoginFlow() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");

  function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Sem back-end ainda: qualquer login válido leva à agenda de demonstração.
    router.push("/app/agenda");
  }

  function onForgot(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setView("sent");
  }

  if (view === "sent") {
    return (
      <div className="flex flex-col gap-[18px] pt-10" role="status">
        <span className="flex size-14 items-center justify-center rounded-full bg-sage text-brand">
          <Icon name="mail" size={26} strokeWidth={2} />
        </span>
        <AuthHeading
          title="Confira sua caixa de entrada"
          subtitle="Se o endereço estiver cadastrado, o link chega em alguns minutos. Ele vale por 1 hora."
        />
        <Button variant="secondary" size="xl" className="border-line-strong" onClick={() => setView("login")}>
          Voltar para o login
        </Button>
      </div>
    );
  }

  if (view === "forgot") {
    return (
      <form method="post" onSubmit={onForgot} className="flex flex-col gap-[18px] pt-10">
        <AuthHeading title="Recuperar senha" subtitle="Enviamos um link para você criar uma senha nova." />
        <TextField label="E-mail ou WhatsApp" name="identificador" required autoComplete="username" placeholder="voce@email.com" large />
        <Button type="submit" size="xl">
          Enviar link
        </Button>
        <Button variant="ghost" onClick={() => setView("login")}>
          Voltar para o login
        </Button>
      </form>
    );
  }

  return (
    <form method="post" onSubmit={onLogin} className="flex flex-col gap-[18px] pt-10">
      <AuthHeading title="Entrar no Trimox" subtitle="Use o e-mail cadastrado no seu negócio." />
      <Button variant="secondary" size="lg" className="border-line-strong">
        Entrar com Google
      </Button>
      <OrDivider>ou</OrDivider>
      <TextField label="E-mail" name="email" type="email" required autoComplete="email" placeholder="voce@email.com" large />
      <PasswordField
        label="Senha"
        name="senha"
        required
        autoComplete="current-password"
        labelAction={
          <button type="button" onClick={() => setView("forgot")} className="min-h-8 cursor-pointer text-sm font-semibold text-brand">
            Esqueci minha senha
          </button>
        }
      />
      <label className="flex items-center gap-2.5 text-body">
        <input type="checkbox" name="manterConectado" defaultChecked className="size-[18px] accent-brand" />
        Manter conectado neste aparelho
      </label>
      <Button type="submit" size="xl" className="font-bold">
        Entrar
      </Button>
      <p className="border-t border-line pt-[18px] text-center text-body">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-bold">
          Criar conta grátis
        </Link>
      </p>
      <p className="text-center text-[13px] text-muted">É profissional de uma equipe? Use o convite que chegou no seu WhatsApp.</p>
    </form>
  );
}
