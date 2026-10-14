import type { Metadata } from "next";
import { TeamView } from "./TeamView";

export const metadata: Metadata = { title: "Profissionais" };

export default function TeamPage() {
  return <TeamView />;
}
