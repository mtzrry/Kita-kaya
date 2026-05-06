import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Sparkles, AlertTriangle } from "lucide-react";

const data = [
  { m: "Jan", income: 3200, expenses: 2400 },
  { m: "Feb", income: 3400, expenses: 2200 },
  { m: "Mar", income: 3100, expenses: 2800 },
  { m: "Apr", income: 3800, expenses: 2600 },
  { m: "May", income: 3600, expenses: 3100 },
  { m: "Jun", income: 4100, expenses: 2900 },
  { m: "Jul", income: 4287, expenses: 3300 },
];

export function FinancialTracker() {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="glass rounded-2xl p-5 xl:col-span-2 hover-lift">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              AI Financial Tracker
            </div>
            <h2 className="text-xl font-bold mt-1">Income vs Expenses</h2>
          </div>
          <div className="flex gap-2">
            <Stat label="Income" value="+$4,287" trend="up" color="var(--brand-emerald)" />
            <Stat label="Spend" value="-$3,300" trend="down" color="var(--brand-cyan)" />
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.76 0.17 160)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.76 0.17 160)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gEx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.16 210)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.16 210)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="m" stroke="oklch(0.72 0.03 255)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.72 0.03 255)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.22 0.04 265)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="income" stroke="oklch(0.76 0.17 160)" strokeWidth={2} fill="url(#gIn)" />
              <Area type="monotone" dataKey="expenses" stroke="oklch(0.78 0.16 210)" strokeWidth={2} fill="url(#gEx)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 hover-lift relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-30 blur-3xl"
             style={{ background: "var(--brand-violet)" }} />
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center"
               style={{ background: "var(--gradient-violet)" }}>
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Insight</div>
            <div className="font-semibold">Pact Intelligence</div>
          </div>
        </div>

        <div className="rounded-xl p-3 mb-3 border border-white/10 bg-white/5 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">Cash flow warning:</span> at current pace, you may
            run out before month-end. Suggest reducing <span className="text-gradient-violet font-semibold">"Wants"</span> by 15%.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <Row label="Needs" pct={62} color="var(--brand-cyan)" />
          <Row label="Wants" pct={28} color="var(--brand-violet)" />
          <Row label="Savings" pct={10} color="var(--brand-emerald)" />
        </div>

        <button className="mt-4 w-full text-sm font-semibold py-2.5 rounded-xl text-background hover-lift"
                style={{ background: "var(--gradient-violet)" }}>
          Apply AI Suggestion
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value, trend, color }: { label: string; value: string; trend: "up" | "down"; color: string }) {
  const Icon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="flex items-center gap-1 font-semibold text-sm" style={{ color }}>
        <Icon className="h-3 w-3" /> {value}
      </div>
    </div>
  );
}

function Row({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
