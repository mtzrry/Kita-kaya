import { Wallet, Bell, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Welcome back
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Hello, <span className="text-gradient-cyan">Aria</span> 👋
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex glass items-center gap-2 px-3 py-2 rounded-xl text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search impact..."
            className="bg-transparent outline-none placeholder:text-muted-foreground w-48"
          />
        </div>

        <div className="glass px-4 py-2 rounded-xl">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Balance</div>
          <div className="font-bold text-lg tabular-nums">$4,287.50</div>
        </div>

        <button className="glass h-10 w-10 rounded-xl flex items-center justify-center hover-lift relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--brand-emerald)" }} />
        </button>

        <button
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-background hover-lift glow-cyan"
          style={{ background: "var(--gradient-cyan)" }}
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
