import type { Metadata } from "next";
import { ServicesView } from "./ServicesView";

export const metadata: Metadata = { title: "Serviços" };

export default function ServicesPage() {
  return <ServicesView />;
}
