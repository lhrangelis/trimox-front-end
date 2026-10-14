import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Trimox · Gestão para barbearias e salões de beleza",
    template: "%s · Trimox",
  },
  description:
    "Agendamento online, lembretes por WhatsApp, comissões e caixa no mesmo lugar. O Trimox cuida da parte chata para a sua equipe cuidar dos clientes.",
  applicationName: "Trimox",
};

export const viewport: Viewport = {
  themeColor: "#1F4A3E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${schibsted.variable} ${instrument.variable}`}>
      <body className="min-h-dvh bg-linen text-graphite">{children}</body>
    </html>
  );
}
