import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, HeartHandshake, GraduationCap, User } from "lucide-react";

const items = [
  { url: "/", icon: LayoutDashboard, label: "Home" },
  { url: "/wallet", icon: Wallet, label: "Wallet" },
  { url: "/impact", icon: HeartHandshake, label: "Impact" },
  { url: "/learn", icon: GraduationCap, label: "Learn" },
  { url: "/profile", icon: User, label: "You" },
];

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-2xl px-2 py-2 flex justify-around">
      {items.map((item) => {
        const active = pathname === item.url;
        return (
          <Link key={item.url} to={item.url}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition ${
              active ? "text-foreground bg-white/10" : "text-muted-foreground"
            }`}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
