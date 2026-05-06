import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — MicroPact" }, { name: "description", content: "Your MicroPact profile and impact stats." }] }),
  component: () => (
    <DashboardLayout>
      <div className="glass rounded-2xl p-10 text-center">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Account, wallet & impact summary — coming soon.</p>
      </div>
    </DashboardLayout>
  ),
});
