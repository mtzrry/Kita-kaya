import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Trash2,
  Wallet,
  TrendingUp,
  TrendingDown,
  Sparkles,
  X,
  ShoppingBag,
  Bus,
  Utensils,
  Receipt,
  Film,
  HeartPulse,
  Briefcase,
  Gift,
  LineChart,
  Landmark,
  CircleHelp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { useCurrency } from "@/lib/currency";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TxCategory,
  TxType,
  useTransactions,
} from "@/lib/transactions";

const CAT_ICON: Record<TxCategory, React.ComponentType<{ className?: string }>> = {
  Salary: Briefcase,
  Freelance: Sparkles,
  Investment: LineChart,
  Gift: Gift,
  Food: Utensils,
  Transport: Bus,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Film,
  Health: HeartPulse,
  Other: CircleHelp,
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function WalletView() {
  const { format, currency, convert } = useCurrency();
  const { transactions, add, remove, totals } = useTransactions();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TxType>("expense");

  // 14-day chart series (in USD base, format() converts)
  const series = useMemo(() => {
    const days = 14;
    const buckets: { d: string; income: number; expense: number; net: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      buckets.push({
        d: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        income: 0,
        expense: 0,
        net: 0,
      });
    }
    transactions.forEach((t) => {
      const d = new Date(t.date);
      d.setHours(0, 0, 0, 0);
      const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < days) {
        const idx = days - 1 - diff;
        if (t.type === "income") buckets[idx].income += t.amount;
        else buckets[idx].expense += t.amount;
      }
    });
    let running = 0;
    buckets.forEach((b) => {
      running += b.income - b.expense;
      b.net = running;
    });
    return buckets;
  }, [transactions]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Wallet</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Detail <span className="text-gradient-cyan">Dompet & Transaksi</span>
          </h1>
        </div>
        <button
          onClick={() => { setType("expense"); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-background hover-lift glow-cyan"
          style={{ background: "var(--gradient-cyan)" }}
        >
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Saldo Bersih"
          value={format(totals.net, { decimals: currency === "IDR" ? 0 : 2 })}
          icon={<Wallet className="h-4 w-4" />}
          accent="violet"
        />
        <KpiCard
          label="Total Pemasukan"
          value={`+${format(totals.income, { decimals: currency === "IDR" ? 0 : 2 })}`}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="emerald"
        />
        <KpiCard
          label="Total Pengeluaran"
          value={`-${format(totals.expense, { decimals: currency === "IDR" ? 0 : 2 })}`}
          icon={<TrendingDown className="h-4 w-4" />}
          accent="cyan"
        />
        <KpiCard
          label="Transaksi"
          value={`${transactions.length}`}
          icon={<Sparkles className="h-4 w-4" />}
          accent="cyan"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="glass rounded-2xl p-5 xl:col-span-2 hover-lift">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">14 Hari Terakhir</div>
              <h2 className="text-xl font-bold mt-1">Arus Kas Harian</h2>
            </div>
            <div className="text-xs text-muted-foreground">
              Real-time · {currency}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series.map(s => ({ ...s, income: convert(s.income), expense: convert(s.expense), net: convert(s.net) }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.76 0.17 160)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.76 0.17 160)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="wEx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.16 210)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.78 0.16 210)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="d" stroke="oklch(0.72 0.03 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.03 255)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.04 265)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) =>
                    currency === "IDR"
                      ? `Rp${v.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`
                      : `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
                  }
                />
                <Area type="monotone" dataKey="income" stroke="oklch(0.76 0.17 160)" strokeWidth={2} fill="url(#wIn)" />
                <Area type="monotone" dataKey="expense" stroke="oklch(0.78 0.16 210)" strokeWidth={2} fill="url(#wEx)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick add */}
        <div className="glass rounded-2xl p-5 hover-lift">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Aksi Cepat</div>
          <h2 className="text-xl font-bold mt-1 mb-4">Catat Transaksi</h2>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => { setType("income"); setOpen(true); }}
              className="rounded-xl p-4 border border-emerald-400/20 bg-emerald-400/5 hover-lift text-left"
            >
              <ArrowUpRight className="h-5 w-5 text-emerald-400 mb-2" />
              <div className="font-semibold text-sm">Pemasukan</div>
              <div className="text-[11px] text-muted-foreground">Gaji, freelance, dll</div>
            </button>
            <button
              onClick={() => { setType("expense"); setOpen(true); }}
              className="rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5 hover-lift text-left"
            >
              <ArrowDownRight className="h-5 w-5 text-cyan-400 mb-2" />
              <div className="font-semibold text-sm">Pengeluaran</div>
              <div className="text-[11px] text-muted-foreground">Makan, belanja, tagihan</div>
            </button>
          </div>

          <div className="rounded-xl p-3 border border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-1.5">
              <Landmark className="h-3.5 w-3.5 text-violet-300" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Tip</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Catat setiap transaksi untuk melihat perubahan saldo, ringkasan, dan grafik 14 hari secara real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Transactions list */}
      <div className="glass rounded-2xl p-5 hover-lift">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Riwayat</div>
            <h2 className="text-xl font-bold mt-1">Semua Transaksi</h2>
          </div>
          <span className="text-xs text-muted-foreground">{transactions.length} entri</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">
            Belum ada transaksi. Tambah yang pertama!
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {transactions.map((t) => {
              const Icon = CAT_ICON[t.category] ?? CircleHelp;
              const isIncome = t.type === "income";
              return (
                <li key={t.id} className="flex items-center gap-3 py-3 group">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? "bg-emerald-400/10 text-emerald-400" : "bg-cyan-400/10 text-cyan-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {t.note || t.category}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.category} · {fmtDate(t.date)}
                    </div>
                  </div>
                  <div
                    className={`font-bold tabular-nums text-sm ${
                      isIncome ? "text-emerald-400" : "text-cyan-300"
                    }`}
                  >
                    {isIncome ? "+" : "-"}{format(t.amount, { decimals: currency === "IDR" ? 0 : 2 })}
                  </div>
                  <button
                    onClick={() => { remove(t.id); toast("Transaksi dihapus"); }}
                    className="h-8 w-8 rounded-lg glass flex items-center justify-center hover-lift opacity-0 group-hover:opacity-100 transition"
                    aria-label="Hapus transaksi"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {open && (
        <AddTxModal
          initialType={type}
          onClose={() => setOpen(false)}
          onSubmit={(payload) => {
            add(payload);
            setOpen(false);
            toast.success(
              payload.type === "income" ? "Pemasukan ditambahkan" : "Pengeluaran ditambahkan",
              { description: `${payload.category} · ${format(payload.amount, { decimals: currency === "IDR" ? 0 : 2 })}` }
            );
          }}
        />
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: "cyan" | "emerald" | "violet";
}) {
  const grad =
    accent === "emerald"
      ? "var(--gradient-emerald)"
      : accent === "violet"
      ? "var(--gradient-violet)"
      : "var(--gradient-cyan)";
  return (
    <div className="glass rounded-2xl p-4 hover-lift relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center text-background"
          style={{ background: grad }}
        >
          {icon}
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function AddTxModal({
  initialType,
  onClose,
  onSubmit,
}: {
  initialType: TxType;
  onClose: () => void;
  onSubmit: (p: { type: TxType; amount: number; category: TxCategory; note?: string }) => void;
}) {
  const { currency, symbol } = useCurrency();
  const [type, setType] = useState<TxType>(initialType);
  const [amountStr, setAmountStr] = useState("");
  const [category, setCategory] = useState<TxCategory>(
    initialType === "income" ? "Salary" : "Food"
  );
  const [note, setNote] = useState("");

  const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const submit = () => {
    const amt = Number(amountStr);
    if (!amt || amt <= 0) {
      toast.error("Masukkan jumlah yang valid");
      return;
    }
    // amountStr is in current currency — normalize to USD base
    const usd = currency === "IDR" ? amt / 16000 : amt;
    onSubmit({ type, amount: usd, category, note: note.trim() || undefined });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="glass-strong w-full max-w-md rounded-2xl p-6 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg glass flex items-center justify-center hover-lift"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-bold mb-1">Tambah Transaksi</h2>
        <p className="text-sm text-muted-foreground mb-5">Catat pemasukan atau pengeluaran baru</p>

        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => { setType("income"); setCategory("Salary"); }}
            className={`rounded-xl p-3 border text-sm font-semibold transition flex items-center justify-center gap-2 ${
              type === "income"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-muted-foreground"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" /> Pemasukan
          </button>
          <button
            onClick={() => { setType("expense"); setCategory("Food"); }}
            className={`rounded-xl p-3 border text-sm font-semibold transition flex items-center justify-center gap-2 ${
              type === "expense"
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 bg-white/5 text-muted-foreground"
            }`}
          >
            <ArrowDownRight className="h-4 w-4" /> Pengeluaran
          </button>
        </div>

        {/* Amount */}
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
          Jumlah ({currency})
        </label>
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
            {symbol}
          </span>
          <input
            type="number"
            min={0}
            step={currency === "IDR" ? 1000 : 0.01}
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0"
            autoFocus
            className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-lg font-bold tabular-nums focus:border-cyan-400/40"
          />
        </div>

        {/* Category */}
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
          Kategori
        </label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cats.map((c) => {
            const Icon = CAT_ICON[c] ?? CircleHelp;
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-xl p-2.5 border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                  active
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {c}
              </button>
            );
          })}
        </div>

        {/* Note */}
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
          Catatan (opsional)
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="cth. Makan siang"
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none text-sm focus:border-cyan-400/40 mb-5"
        />

        <button
          onClick={submit}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-background hover-lift glow-cyan"
          style={{ background: "var(--gradient-cyan)" }}
        >
          Simpan Transaksi
        </button>
      </div>
    </div>
  );
}
