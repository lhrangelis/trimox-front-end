import type { Metadata } from "next";
import { CommissionsView } from "./CommissionsView";

export const metadata: Metadata = { title: "Comissões" };

export default function CommissionsPage() {
  return <CommissionsView />;
}
