import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark size={56} />
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(32px,5vw,48px)] font-bold tracking-[-0.04em]">
          Essa página <span className="editorial">não existe.</span>
        </h1>
        <p className="text-body">O endereço pode estar errado ou o link de agendamento foi desativado.</p>
      </div>
      <ButtonLink href="/" size="lg">
        Voltar ao início
      </ButtonLink>
    </main>
  );
}
