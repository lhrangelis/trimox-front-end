import type { Metadata } from "next";
import { FinanceView } from "./FinanceView";

export const metadata: Metadata = { title: "Financeiro" };

export default function AdminFinancePage() {
  return <FinanceView />;
}
