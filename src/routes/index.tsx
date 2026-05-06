import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FinancialTracker } from "@/components/FinancialTracker";
import { ImpactSection } from "@/components/ImpactSection";
import { LearnSection } from "@/components/LearnSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
  { title: "Kita Kaya — Finance, Impact, Literacy" },
  { name: "description", content: "Kita Kaya is a Web3-inspired dashboard..." },
  { property: "og:title", content: "Kita Kaya Dashboard" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FinancialTracker />
        <ImpactSection />
        <LearnSection />
      </div>
    </DashboardLayout>
  );
}
