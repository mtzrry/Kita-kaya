import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  HeartHandshake,
  GraduationCap,
  User,
  Sparkles,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Wallet", url: "/wallet", icon: Wallet },
  { title: "Impact Hub", url: "/impact", icon: HeartHandshake },
  { title: "Learn", url: "/learn", icon: GraduationCap },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 flex-col p-4">
      <div className="glass rounded-2xl flex-1 flex flex-col p-5">
        <Link to="/" className="flex items-center gap-2 px-2 mb-8 group">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
               style={{ background: "var(--gradient-cyan)" }}>
            <Sparkles className="h-5 w-5 text-background" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight">Kita Kaya</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Finance · Impact
            </div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-white/10 text-foreground glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--brand-cyan)" }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto glass-strong rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full animate-pulse-glow"
                  style={{ background: "var(--brand-emerald)" }} />
            <span className="font-medium">Network: Sepolia</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            All donations verified on-chain via transparent ledger.
          </p>
        </div>
      </div>
    </aside>
  );
}
