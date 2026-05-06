import { useState } from "react";
import { ShieldCheck, ExternalLink, HeartHandshake, Droplet, BookOpen, Utensils } from "lucide-react";

const ledger = [
  { id: "0xA1c…b3F", to: "Clean Water Fund", amount: 12.5, time: "2m ago", icon: Droplet, color: "var(--brand-cyan)" },
  { id: "0xE7d…91B", to: "School Meals Project", amount: 5.0, time: "14m ago", icon: Utensils, color: "var(--brand-emerald)" },
  { id: "0x3Fa…22C", to: "Literacy Initiative", amount: 8.75, time: "1h ago", icon: BookOpen, color: "var(--brand-violet)" },
  { id: "0xB0e…77A", to: "Refugee Shelter", amount: 25.0, time: "3h ago", icon: HeartHandshake, color: "var(--brand-emerald)" },
];

const causes = [
  { name: "Clean Water", raised: 8420, goal: 10000, color: "var(--brand-cyan)", icon: Droplet, sdg: 6 },
  { name: "Education", raised: 5210, goal: 8000, color: "var(--brand-violet)", icon: BookOpen, sdg: 4 },
  { name: "Food Security", raised: 11240, goal: 15000, color: "var(--brand-emerald)", icon: Utensils, sdg: 2 },
];

export function ImpactSection() {
  const [roundup, setRoundup] = useState(2);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        {causes.map((c) => {
          const pct = Math.round((c.raised / c.goal) * 100);
          return (
            <div key={c.name} className="glass rounded-2xl p-5 hover-lift flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                     style={{ background: c.color, opacity: 0.9 }}>
                  <c.icon className="h-5 w-5 text-background" />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" style={{ color: c.color }} /> Verified
                </span>
              </div>
              <h3 className="font-bold text-lg">{c.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">SDG {c.sdg} aligned</p>
              <div className="text-xs flex justify-between mb-1">
                <span className="text-muted-foreground">${c.raised.toLocaleString()}</span>
                <span className="font-semibold">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
              </div>
              <button className="mt-auto text-sm font-semibold py-2 rounded-xl border border-white/10 hover:bg-white/10 transition">
                Donate
              </button>
            </div>
          );
        })}

        <div className="glass-strong rounded-2xl p-5 md:col-span-3 hover-lift">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Round-Up to Donate</div>
              <h3 className="font-bold text-lg mt-1">
                Round spare change → <span className="text-gradient-emerald">${roundup.toFixed(2)}/wk</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Round each transaction to the nearest dollar. Difference goes to your selected cause.
              </p>
            </div>
            <div className="flex-1 max-w-md">
              <input
                type="range" min={0} max={10} step={0.5} value={roundup}
                onChange={(e) => setRoundup(Number(e.target.value))}
                className="w-full accent-emerald-400"
                style={{ accentColor: "oklch(0.76 0.17 160)" }}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>$0</span><span>$5</span><span>$10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Transparent Ledger</div>
            <h3 className="font-bold">Recent on-chain donations</h3>
          </div>
          <span className="h-2 w-2 rounded-full animate-pulse-glow"
                style={{ background: "var(--brand-emerald)" }} />
        </div>
        <div className="space-y-3">
          {ledger.map((l) => (
            <div key={l.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: `color-mix(in oklab, ${l.color} 25%, transparent)` }}>
                <l.icon className="h-4 w-4" style={{ color: l.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{l.to}</div>
                <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                  {l.id} <ExternalLink className="h-2.5 w-2.5" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold tabular-nums" style={{ color: l.color }}>
                  ${l.amount.toFixed(2)}
                </div>
                <div className="text-[10px] text-muted-foreground">{l.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
