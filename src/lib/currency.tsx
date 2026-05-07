import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CurrencyCode = "USD" | "IDR";

const RATE: Record<CurrencyCode, number> = {
  USD: 1,
  IDR: 16000,
};

const SYMBOL: Record<CurrencyCode, string> = {
  USD: "$",
  IDR: "Rp",
};

const STORAGE_KEY = "kk_currency";

type Ctx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  symbol: string;
  /** Convert a USD-denominated number to the current currency (number). */
  convert: (usd: number) => number;
  /** Format a USD-denominated number into a localized string with symbol. */
  format: (usd: number, opts?: { decimals?: number }) => string;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (raw === "USD" || raw === "IDR") setCurrencyState(raw);
    } catch {}
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch {}
  };

  const convert = (usd: number) => usd * RATE[currency];

  const format = (usd: number, opts?: { decimals?: number }) => {
    const value = convert(usd);
    if (currency === "IDR") {
      const d = opts?.decimals ?? 0;
      return `Rp${value.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
    }
    const d = opts?.decimals ?? 2;
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol: SYMBOL[currency], convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
