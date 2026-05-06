import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Sparkles, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

const data = [
  { m: "Jan", income: 3200, expenses: 2400 },
  { m: "Feb", income: 3400, expenses: 2200 },
  { m: "Mar", income: 3100, expenses: 2800 },
  { m: "Apr", income: 3800, expenses: 2600 },
  { m: "May", income: 3600, expenses: 3100 },
  { m: "Jun", income: 4100, expenses: 2900 },
  { m: "Jul", income: 4287, expenses: 3300 },
];

// baseline allocation
const BASE = { needs: 62, wants: 28, savings: 10 };

export function FinancialTracker() {
  const [wantsCut, setWantsCut] = useState(15); // % reduction in Wants

  const insights = useMemo(() => {
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    const avgIncome = data.reduce((s, d) => s + d.income, 0) / data.length;
    const avgExp = data.reduce((s, d) => s + d.expenses, 0) / data.length;
    const burn = last.expenses / 30; // daily burn
    const today = 18; // assume mid-month sim
    const remainingDays = 30 - today;

    // projected baseline month-end net
    const wantsDollars = last.expenses * (BASE.wants / 100);
    const saved = wantsDollars * (wantsCut / 100);
    const projectedExp = last.expenses - saved;
    const monthEndNet = last.income - projectedExp;
    const baselineNet = last.income - last.expenses;

    const expDelta = ((last.expenses - prev.expenses) / prev.expenses) * 100;
    const incDelta = ((last.income - prev.income) / prev.income) * 100;

    const tips: { tone: "warn" | "good" | "tip"; text: string }[] = [];
    if (expDelta > 8) tips.push({ tone: "warn", text: `Spend up ${expDelta.toFixed(1)}% MoM — driven by Wants category.` });
    if (incDelta > 0) tips.push({ tone: "good", text: `Income trending +${incDelta.toFixed(1)}% — direct surplus to Savings.` });
    if (last.expenses / last.income > 0.75) tips.push({ tone: "warn", text: `Expense ratio at ${((last.expenses / last.income) * 100).toFixed(0)}% — above safe 75% threshold.` });
    tips.push({ tone: "tip", text: `Avg monthly burn $${burn.toFixed(0)}/day. ${remainingDays} days left this cycle.` });
    if (saved > 0) tips.push({ tone: "good", text: `Cutting Wants ${wantsCut}% saves $${saved.toFixed(0)} → month-end net $${monthEndNet.toFixed(0)}.` });

    return { avgIncome, avgExp, monthEndNet, baselineNet, saved, projectedExp, tips };
  }, [wantsCut]);

  const newWants = Math.max(0, BASE.wants * (1 - wantsCut / 100));
  const reclaimed = BASE.wants - newWants;
  const newSavings = BASE.savings + reclaimed;

  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="glass rounded-2xl p-5 xl:col-span-2 hover-lift">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              AI Financial Tracker
            </div>
            <h2 className="text-xl font-bold mt-1">Income vs Expenses</h2>
          </div>
          <div className="flex gap-2">
            <Stat label="Income" value={`+$${data[data.length - 1].income.toLocaleString()}`} trend="up" color="var(--brand-emerald)" />
            <Stat label="Spend" value={`-$${insights.projectedExp.toFixed(0)}`} trend="down" color="var(--brand-cyan)" />
            <Stat label="Net" value={`$${insights.monthEndNet.toFixed(0)}`} trend={insights.monthEndNet >= 0 ? "up" : "down"} color="var(--brand-violet)" />
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
              <ReferenceLine y={insights.avgExp} stroke="oklch(0.78 0.16 210 / 0.4)" strokeDasharray="4 4" label={{ value: "Avg spend", fill: "oklch(0.72 0.03 255)", fontSize: 10, position: "insideTopRight" }} />
              <Area type="monotone" dataKey="income" stroke="oklch(0.76 0.17 160)" strokeWidth={2} fill="url(#gIn)" />
              <Area type="monotone" dataKey="expenses" stroke="oklch(0.78 0.16 210)" strokeWidth={2} fill="url(#gEx)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <KPI label="Avg Income" value={`$${insights.avgIncome.toFixed(0)}`} />
          <KPI label="Avg Spend" value={`$${insights.avgExp.toFixed(0)}`} />
          <KPI label="Sim. Saved" value={`+$${insights.saved.toFixed(0)}`} accent />
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

        <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
          {insights.tips.map((t, i) => {
            const Icon = t.tone === "warn" ? AlertTriangle : t.tone === "good" ? CheckCircle2 : Lightbulb;
            const color = t.tone === "warn" ? "text-amber-400" : t.tone === "good" ? "text-emerald-400" : "text-cyan-400";
            return (
              <div key={i} className="rounded-xl p-2.5 border border-white/10 bg-white/5 flex gap-2">
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
                <p className="text-xs leading-relaxed">{t.text}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl p-3 border border-white/10 bg-white/5 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Simulate: Reduce Wants</span>
            <span className="text-xs font-bold text-gradient-violet">−{wantsCut}%</span>
          </div>
          <input
            type="range" min={0} max={50} step={5} value={wantsCut}
            onChange={(e) => setWantsCut(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "oklch(0.7 0.2 295)" }}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>0%</span><span>25%</span><span>50%</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <Row label="Needs" pct={BASE.needs} color="var(--brand-cyan)" />
          <Row label="Wants" pct={Math.round(newWants)} color="var(--brand-violet)" was={wantsCut > 0 ? BASE.wants : undefined} />
          <Row label="Savings" pct={Math.round(newSavings)} color="var(--brand-emerald)" was={wantsCut > 0 ? BASE.savings : undefined} />
        </div>

        <div className="mt-4 rounded-xl p-3 border border-emerald-400/20 bg-emerald-400/5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Projected Month-End</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gradient-emerald">${insights.monthEndNet.toFixed(0)}</span>
            <span className="text-xs text-muted-foreground">vs ${insights.baselineNet.toFixed(0)} baseline</span>
          </div>
        </div>
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

function KPI({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl p-2.5 border border-white/10 bg-white/5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-bold ${accent ? "text-gradient-emerald" : ""}`}>{value}</div>
    </div>
  );
}

function Row({ label, pct, color, was }: { label: string; pct: number; color: string; was?: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">
          {was !== undefined && <span className="text-muted-foreground line-through mr-1">{was}%</span>}
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
