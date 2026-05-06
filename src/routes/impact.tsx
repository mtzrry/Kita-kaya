import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ImpactSection } from "@/components/ImpactSection";

export const Route = createFileRoute("/impact")({
  head: () => ({ meta: [{ title: "Impact Hub — MicroPact" }, { name: "description", content: "Transparent on-chain donations supporting verified causes." }] }),
  component: () => (
    <DashboardLayout>
      <ImpactSection />
    </DashboardLayout>
  ),
});
