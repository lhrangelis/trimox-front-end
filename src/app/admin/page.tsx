import type { Metadata } from "next";
import { OverviewView } from "./OverviewView";

export const metadata: Metadata = { title: { absolute: "Visão geral · Admin Trimox" } };

export default function AdminOverviewPage() {
  return <OverviewView />;
}
