import type { Metadata } from "next";
import { AccountsView } from "./AccountsView";

export const metadata: Metadata = { title: "Clientes" };

export default function AdminAccountsPage() {
  return <AccountsView />;
}
