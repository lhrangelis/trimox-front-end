import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BUSINESS } from "@/lib/data/business";
import { BookingFlow } from "./BookingFlow";

/** Por enquanto só existe o negócio de demonstração; com API, viria a lista de slugs. */
export function generateStaticParams() {
  return [{ slug: BUSINESS.slug }];
}

export const metadata: Metadata = {
  title: `Agendar em ${BUSINESS.name}`,
  description: `Escolha serviço, profissional e horário em ${BUSINESS.name}. Agendamento online pelo Trimox.`,
};

async function Booking({ params }: { params: PageProps<"/agendar/[slug]">["params"] }) {
  const { slug } = await params;
  if (slug !== BUSINESS.slug) notFound();
  return <BookingFlow />;
}

export default function BookingPage({ params }: PageProps<"/agendar/[slug]">) {
  return (
    <div className="flex min-h-dvh justify-center bg-sand/60 sm:py-8">
      <Suspense fallback={<div className="w-full max-w-[420px] bg-linen" />}>
        <Booking params={params} />
      </Suspense>
    </div>
  );
}
