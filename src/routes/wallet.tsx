import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { WalletView } from "@/components/WalletView";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — Kita Kaya" },
      { name: "description", content: "Track your income and expenses with live updates on Kita Kaya." },
    ],
  }),
  component: () => (
    <DashboardLayout>
      <WalletView />
    </DashboardLayout>
  ),
});
