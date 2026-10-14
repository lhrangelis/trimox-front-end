import type { Metadata } from "next";
import { ReportsView } from "./ReportsView";

export const metadata: Metadata = { title: "Relatórios" };

export default function ReportsPage() {
  return <ReportsView />;
}
