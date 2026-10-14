import type { Metadata } from "next";
import { PlansView } from "./PlansView";

export const metadata: Metadata = { title: "Planos e recursos" };

export default function AdminPlansPage() {
  return <PlansView />;
}
