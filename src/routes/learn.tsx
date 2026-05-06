import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LearnSection } from "@/components/LearnSection";

export const Route = createFileRoute("/learn")({
  head: () => ({ meta: [{ title: "Learn — MicroPact" }, { name: "description", content: "Bite-sized financial literacy and SDG education." }] }),
  component: () => (
    <DashboardLayout>
      <LearnSection />
    </DashboardLayout>
  ),
});
