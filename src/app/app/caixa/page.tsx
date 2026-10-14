import type { Metadata } from "next";
import { CashView } from "./CashView";

export const metadata: Metadata = { title: "Caixa" };

export default function CashPage() {
  return <CashView />;
}
