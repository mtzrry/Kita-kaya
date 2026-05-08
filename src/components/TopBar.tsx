import { Wallet, Bell, Search, Check, Copy, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrency, type CurrencyCode } from "@/lib/currency";
import { useTransactions } from "@/lib/transactions";

type WalletId = "metamask" | "walletconnect" | "coinbase" | "phantom";

const WALLETS: { id: WalletId; name: string; icon: string; tag: string }[] = [
  { id: "metamask", name: "MetaMask", icon: "🦊", tag: "Popular" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗", tag: "Multi-chain" },
  { id: "coinbase", name: "Coinbase Wallet", icon: "🪙", tag: "Beginner" },
  { id: "phantom", name: "Phantom", icon: "👻", tag: "Solana" },
];

const STORAGE_KEY = "kk_wallet";

function randomAddress() {
  const hex = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += hex[Math.floor(Math.random() * 16)];
  return s;
}

function shorten(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState<WalletId | null>(null);
  const [wallet, setWallet] = useState<{ id: WalletId; address: string } | null>(null);
  const { currency, setCurrency, format } = useCurrency();
  const { totals } = useTransactions();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWallet(JSON.parse(raw));
    } catch {}
  }, []);

  const connect = async (id: WalletId) => {
    setConnecting(id);
    await new Promise((r) => setTimeout(r, 1100));
    const next = { id, address: randomAddress() };
    setWallet(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setConnecting(null);
    setOpen(false);
    toast.success(`${WALLETS.find((w) => w.id === id)?.name} connected`, {
      description: shorten(next.address),
    });
  };

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem(STORAGE_KEY);
    setOpen(false);
    toast("Wallet disconnected");
  };

  const copy = async () => {
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet.address);
    toast.success("Address copied");
  };

  const activeMeta = wallet ? WALLETS.find((w) => w.id === wallet.id) : null;

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Welcome back
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Hello, <span className="text-gradient-cyan">Sobat Kita Kaya</span> 👋
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
          <div className="font-bold text-lg tabular-nums">{format(4287.5)}</div>
        </div>

        <div className="hidden sm:flex glass rounded-xl p-0.5 text-xs font-semibold" role="group" aria-label="Currency">
          {(["USD", "IDR"] as CurrencyCode[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1.5 rounded-lg transition ${
                currency === c
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={currency === c ? { background: "var(--gradient-cyan)" } : undefined}
            >
              {c}
            </button>
          ))}
        </div>

        <button className="glass h-10 w-10 rounded-xl flex items-center justify-center hover-lift relative">
          <Bell className="h-4 w-4" />
          <span
            className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--brand-emerald)" }}
          />
        </button>

        {wallet ? (
          <button
            onClick={() => setOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold glass hover-lift"
          >
            <span className="text-base leading-none">{activeMeta?.icon}</span>
            <span className="tabular-nums">{shorten(wallet.address)}</span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--brand-emerald)" }}
            />
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-background hover-lift glow-cyan"
            style={{ background: "var(--gradient-cyan)" }}
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => !connecting && setOpen(false)}
        >
          <div
            className="glass-strong w-full max-w-md rounded-2xl p-6 relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => !connecting && setOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-lg glass flex items-center justify-center hover-lift"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {wallet ? (
              <div>
                <h2 className="text-xl font-bold mb-1">Wallet Connected</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Manage your active session
                </p>

                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg glass flex items-center justify-center text-xl">
                      {activeMeta?.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{activeMeta?.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--brand-emerald)" }}
                        />
                        Connected · Polygon
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Address
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono break-all">
                      {wallet.address}
                    </code>
                    <button
                      onClick={copy}
                      className="shrink-0 h-8 w-8 rounded-lg glass flex items-center justify-center hover-lift"
                      aria-label="Copy address"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={disconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold glass hover-lift text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-1">Connect a Wallet</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Choose a provider to start your on-chain impact journey
                </p>

                <div className="space-y-2">
                  {WALLETS.map((w) => {
                    const isLoading = connecting === w.id;
                    const disabled = connecting !== null && !isLoading;
                    return (
                      <button
                        key={w.id}
                        disabled={connecting !== null}
                        onClick={() => connect(w.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl glass hover-lift text-left transition ${
                          disabled ? "opacity-40" : ""
                        }`}
                      >
                        <div className="h-10 w-10 rounded-lg glass flex items-center justify-center text-xl">
                          {w.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{w.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {w.tag}
                          </div>
                        </div>
                        {isLoading ? (
                          <div className="h-4 w-4 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 opacity-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-muted-foreground text-center mt-5">
                  By connecting, you agree to our Terms & Privacy. Demo only — no
                  real signature required.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
