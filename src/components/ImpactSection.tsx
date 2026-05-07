import { useMemo, useState } from "react";
import {
  ShieldCheck, ExternalLink, HeartHandshake, BookOpen, Utensils,
  Copy, Share2, Download, X, Hash, Layers, Wallet, CheckCircle2, Sparkles,
} from "lucide-react";
import { useCurrency } from "@/lib/currency";

type Campaign = {
  id: string;
  name: string;
  subtitle: string;
  raised: number;
  goal: number;
  color: string;
  icon: typeof BookOpen;
  sdg: number;
  sdgLabel: string;
  share: number; // share of round-up allocation 0-1
};

const campaigns: Campaign[] = [
  {
    id: "earthquake",
    name: "Bantuan Tanggap Darurat Gempa",
    subtitle: "Earthquake Disaster Relief",
    raised: 18420, goal: 25000, color: "var(--brand-cyan)",
    icon: HeartHandshake, sdg: 11, sdgLabel: "Sustainable Cities",
    share: 0.45,
  },
  {
    id: "education",
    name: "Beasiswa Pendidikan",
    subtitle: "Student Education Fund",
    raised: 9210, goal: 15000, color: "var(--brand-violet)",
    icon: BookOpen, sdg: 4, sdgLabel: "Quality Education",
    share: 0.30,
  },
  {
    id: "poverty",
    name: "Bantuan Sembako",
    subtitle: "Poverty Alleviation",
    raised: 12740, goal: 20000, color: "var(--brand-emerald)",
    icon: Utensils, sdg: 1, sdgLabel: "No Poverty",
    share: 0.25,
  },
];

type LedgerEntry = {
  id: string;
  to: string;
  amount: number;
  time: string;
  icon: typeof BookOpen;
  color: string;
  txHash: string;
  block: number;
  network: string;
  fromWallet: string;
  toWallet: string;
  gas: string;
  confirmations: number;
  sdg: number;
};

const ledger: LedgerEntry[] = [
  { id: "0xA1c…b3F", to: "Bantuan Tanggap Darurat Gempa", amount: 25.0, time: "2m ago", icon: HeartHandshake, color: "var(--brand-cyan)",
    txHash: "0xA1c4f8b2e9d7a6c5b4e3f2a1d0c9b8e7f6a5d4c3b2a1e0d9c8b7a6f5e4d3c2b3F",
    block: 19284731, network: "Polygon", fromWallet: "0x7E9a…2D4f", toWallet: "0xQuakeRelief…001",
    gas: "0.0021 MATIC", confirmations: 142, sdg: 11 },
  { id: "0xE7d…91B", to: "Bantuan Sembako", amount: 5.0, time: "14m ago", icon: Utensils, color: "var(--brand-emerald)",
    txHash: "0xE7d3a1b9c8f7e6d5c4b3a2e1d0f9c8b7a6e5d4c3b2a1f0e9d8c7b6a5f4e3d291B",
    block: 19284602, network: "Polygon", fromWallet: "0x7E9a…2D4f", toWallet: "0xSembako…044",
    gas: "0.0019 MATIC", confirmations: 271, sdg: 1 },
  { id: "0x3Fa…22C", to: "Beasiswa Pendidikan", amount: 8.75, time: "1h ago", icon: BookOpen, color: "var(--brand-violet)",
    txHash: "0x3Fa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f022C",
    block: 19283194, network: "Polygon", fromWallet: "0x7E9a…2D4f", toWallet: "0xBeasiswa…077",
    gas: "0.0023 MATIC", confirmations: 1622, sdg: 4 },
];

export function ImpactSection() {
  const [roundup, setRoundup] = useState(2);
  const [selected, setSelected] = useState<LedgerEntry | null>(null);
  const [success, setSuccess] = useState<Campaign | null>(null);
  const { format } = useCurrency();

  const breakdown = useMemo(() => {
    const monthly = roundup * 4.345;
    const yearly = roundup * 52;
    const items = campaigns.map((c) => ({
      campaign: c,
      weekly: roundup * c.share,
      monthly: monthly * c.share,
      yearly: yearly * c.share,
      pct: Math.round(c.share * 100),
    }));
    return { monthly, yearly, items };
  }, [roundup]);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        {campaigns.map((c) => {
          const pct = Math.round((c.raised / c.goal) * 100);
          return (
            <div key={c.id} className="glass rounded-2xl p-5 hover-lift flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                     style={{ background: c.color, opacity: 0.9 }}>
                  <c.icon className="h-5 w-5 text-background" />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" style={{ color: c.color }} /> Verified
                </span>
              </div>
              <h3 className="font-bold text-base leading-tight">{c.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{c.subtitle} · SDG {c.sdg}</p>
              <div className="text-xs flex justify-between mb-1 mt-auto">
                <span className="text-muted-foreground">{format(c.raised, { decimals: 0 })}</span>
                <span className="font-semibold">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
              </div>
              <button
                onClick={() => setSuccess(c)}
                className="text-sm font-semibold py-2 rounded-xl text-background hover-lift"
                style={{ background: c.color }}
              >
                Donate
              </button>
            </div>
          );
        })}

        {/* Round-up + live impact preview */}
        <div className="glass-strong rounded-2xl p-5 md:col-span-3 hover-lift">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Round-Up to Donate</div>
              <h3 className="font-bold text-lg mt-1">
                Spare change → <span className="text-gradient-emerald">{format(roundup)}/wk</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Round each transaction up. The difference is split across verified SDG causes.
              </p>
              <input
                type="range" min={0} max={10} step={0.5} value={roundup}
                onChange={(e) => setRoundup(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "oklch(0.76 0.17 160)" }}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{format(0, { decimals: 0 })}</span>
                <span>{format(5, { decimals: 0 })}</span>
                <span>{format(10, { decimals: 0 })}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-xl border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly</div>
                  <div className="text-lg font-bold tabular-nums text-gradient-emerald">
                    {format(breakdown.monthly)}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Yearly</div>
                  <div className="text-lg font-bold tabular-nums text-gradient-cyan">
                    {format(breakdown.yearly)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" style={{ color: "var(--brand-emerald)" }} />
                  Live SDG Breakdown
                </div>
                <span className="text-[10px] text-muted-foreground">Per week</span>
              </div>

              {/* Stacked bar */}
              <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-white/5 mb-4">
                {breakdown.items.map((it) => (
                  <div key={it.campaign.id} className="h-full transition-all duration-300"
                       style={{ width: `${it.pct}%`, background: it.campaign.color }} />
                ))}
              </div>

              <div className="space-y-2.5">
                {breakdown.items.map((it) => (
                  <div key={it.campaign.id}
                       className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                         style={{ background: `color-mix(in oklab, ${it.campaign.color} 25%, transparent)` }}>
                      <it.campaign.icon className="h-4 w-4" style={{ color: it.campaign.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{it.campaign.subtitle}</div>
                      <div className="text-[10px] text-muted-foreground">
                        SDG {it.campaign.sdg} · {it.campaign.sdgLabel} · {it.pct}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums" style={{ color: it.campaign.color }}>
                        {format(it.weekly)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {format(it.monthly)}/mo
                      </div>
                    </div>
                  </div>
                ))}
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
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/15 transition"
            >
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
                  {format(l.amount)}
                </div>
                <div className="text-[10px] text-muted-foreground">{l.time}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <DonationModal entry={selected} onClose={() => setSelected(null)} />}
      {success && <SuccessModal campaign={success} onClose={() => setSuccess(null)} />}
    </section>
  );
}

function SuccessModal({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const amount = 10;
  const { format } = useCurrency();
  const txHash = "0x" + Math.random().toString(16).slice(2, 10) + "…" + Math.random().toString(16).slice(2, 6);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-3xl p-8 w-full max-w-md text-center relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "var(--shadow-glow-emerald)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-5" style={{ animation: "success-pop 0.6s ease-out" }}>
          <svg viewBox="0 0 96 96" className="h-24 w-24 mx-auto">
            <defs>
              <radialGradient id="sg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.76 0.17 160)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.76 0.17 160)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="48" cy="48" r="46" fill="url(#sg)" />
            <circle
              cx="48" cy="48" r="36"
              fill="none"
              stroke="oklch(0.76 0.17 160)"
              strokeWidth="3"
              strokeDasharray="226"
              strokeDashoffset="226"
              style={{ animation: "circle-draw 0.6s ease-out forwards" }}
            />
            <path
              d="M30 50 L44 64 L66 38"
              fill="none"
              stroke="oklch(0.76 0.17 160)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset="60"
              style={{ animation: "check-draw 0.4s ease-out 0.5s forwards" }}
            />
          </svg>
        </div>

        <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
          Donation Successful
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You 💚</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Your <span className="font-semibold text-foreground">{format(amount)}</span> donation to{" "}
          <span className="font-semibold text-foreground">{campaign.name}</span> is verified on the transparent ledger.
        </p>

        <div className="rounded-2xl border border-white/10 p-4 mb-5 text-left space-y-2"
             style={{ background: `color-mix(in oklab, ${campaign.color} 8%, transparent)` }}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Impact</span>
            <span className="font-semibold">SDG {campaign.sdg} · {campaign.sdgLabel}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Network</span>
            <span className="font-semibold">Polygon</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tx Hash</span>
            <span className="font-mono">{txHash}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1 border-t border-white/5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified on the transparent ledger
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="text-sm font-semibold py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="text-sm font-semibold py-2.5 rounded-xl text-background hover-lift flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-emerald)" }}
          >
            <Share2 className="h-4 w-4" /> Share Impact
          </button>
        </div>
      </div>
    </div>
  );
}

function DonationModal({ entry, onClose }: { entry: LedgerEntry; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const { format } = useCurrency();

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const share = async () => {
    const url = `https://polygonscan.com/tx/${entry.txHash}`;
    const text = `I just donated ${format(entry.amount)} to ${entry.to} on-chain via Kita Kaya 💚`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Kita Kaya Donation", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
      }
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {/* user dismissed */}
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kitakaya-donation-${entry.txHash.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center"
               style={{ background: `color-mix(in oklab, ${entry.color} 30%, transparent)` }}>
            <entry.icon className="h-6 w-6" style={{ color: entry.color }} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Donation Receipt</div>
            <h2 className="text-lg font-bold">{entry.to}</h2>
          </div>
        </div>

        <div className="rounded-xl p-4 mb-4 border border-white/10"
             style={{ background: `color-mix(in oklab, ${entry.color} 8%, transparent)` }}>
          <div className="text-xs text-muted-foreground">Amount</div>
          <div className="text-3xl font-bold tabular-nums" style={{ color: entry.color }}>
            {format(entry.amount)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Verified on {entry.network} · SDG {entry.sdg}
          </div>
        </div>

        <div className="space-y-2.5 mb-5">
          <DetailRow icon={Hash} label="Transaction Hash" value={entry.txHash} mono onCopy={() => copy(entry.txHash)} />
          <DetailRow icon={Layers} label="Block" value={`#${entry.block.toLocaleString()} · ${entry.confirmations} conf.`} />
          <DetailRow icon={Wallet} label="From" value={entry.fromWallet} mono />
          <DetailRow icon={Wallet} label="To" value={entry.toWallet} mono />
          <DetailRow icon={Sparkle} label="Network Fee" value={entry.gas} />
        </div>

        <a
          href={`https://polygonscan.com/tx/${entry.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full text-sm font-semibold py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition mb-3"
        >
          View on Polygonscan <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={share}
            className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            <Share2 className="h-4 w-4" />
            {shared ? "Shared!" : "Share"}
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl text-background hover-lift"
            style={{ background: "var(--gradient-emerald)" }}
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        {copied && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-400 text-background">
            Copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon, label, value, mono, onCopy,
}: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean; onCopy?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/5">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`text-xs truncate ${mono ? "font-mono" : "font-semibold"}`}>{value}</div>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-white/10 transition">
          <Copy className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function Sparkle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}
