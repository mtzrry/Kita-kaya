import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <AppSidebar />
      <div className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 lg:pb-10">
          <TopBar />
          {children}
          <Footer />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}

function Footer() {
  const sdgs = [
    { num: 1, label: "No Poverty", color: "var(--brand-emerald)" },
    { num: 4, label: "Quality Education", color: "var(--brand-violet)" },
    { num: 8, label: "Decent Work", color: "var(--brand-cyan)" },
    { num: 10, label: "Reduced Inequalities", color: "var(--brand-emerald)" },
    { num: 12, label: "Responsible Consumption", color: "var(--brand-violet)" },
  ];
  return (
    <footer className="mt-12 glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Aligned with UN SDGs
        </div>
        <div className="flex flex-wrap gap-2">
          {sdgs.map((s) => (
            <div key={s.num} title={s.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-white/10 hover-lift">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              SDG {s.num}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 Kita Kaya</p>
    </footer>
  );
}
