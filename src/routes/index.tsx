import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FinancialTracker } from "@/components/FinancialTracker";
import { ImpactSection } from "@/components/ImpactSection";
import { LearnSection } from "@/components/LearnSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MicroPact — Finance, Impact, Literacy" },
      { name: "description", content: "MicroPact is a Web3-inspired dashboard combining personal finance, transparent donations, and financial literacy for global impact." },
      { property: "og:title", content: "MicroPact Dashboard" },
      { property: "og:description", content: "Track money, donate transparently, learn responsibly." },
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
