import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — MicroPact" }, { name: "description", content: "Track your spending and income in MicroPact." }] }),
  component: () => (
    <DashboardLayout>
      <div className="glass rounded-2xl p-10 text-center">
        <h1 className="text-2xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground">Detailed transaction tracker — coming soon.</p>
      </div>
    </DashboardLayout>
  ),
});
