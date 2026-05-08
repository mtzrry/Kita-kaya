import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type TxType = "income" | "expense";
export type TxCategory =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Gift"
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Other";

export type Transaction = {
  id: string;
  type: TxType;
  amount: number; // stored in USD base
  category: TxCategory;
  note?: string;
  date: string; // ISO
};

const STORAGE_KEY = "kk_transactions";

const SEED: Transaction[] = [
  { id: "t1", type: "income", amount: 3200, category: "Salary", note: "Monthly salary", date: daysAgo(2) },
  { id: "t2", type: "expense", amount: 42, category: "Food", note: "Groceries", date: daysAgo(2) },
  { id: "t3", type: "expense", amount: 18, category: "Transport", note: "Ride share", date: daysAgo(3) },
  { id: "t4", type: "income", amount: 450, category: "Freelance", note: "Logo design", date: daysAgo(5) },
  { id: "t5", type: "expense", amount: 120, category: "Shopping", note: "New shoes", date: daysAgo(6) },
  { id: "t6", type: "expense", amount: 65, category: "Bills", note: "Internet", date: daysAgo(8) },
  { id: "t7", type: "expense", amount: 28, category: "Entertainment", note: "Movie night", date: daysAgo(10) },
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

type Ctx = {
  transactions: Transaction[];
  add: (tx: Omit<Transaction, "id" | "date"> & { date?: string }) => Transaction;
  remove: (id: string) => void;
  totals: { income: number; expense: number; net: number };
};

const TxContext = createContext<Ctx | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTransactions(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  const add: Ctx["add"] = (tx) => {
    const next: Transaction = {
      id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      date: tx.date ?? new Date().toISOString(),
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      note: tx.note,
    };
    setTransactions((prev) => [next, ...prev]);
    return next;
  };

  const remove = (id: string) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  return (
    <TxContext.Provider value={{ transactions, add, remove, totals }}>
      {children}
    </TxContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TxContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}

export const INCOME_CATEGORIES: TxCategory[] = ["Salary", "Freelance", "Investment", "Gift", "Other"];
export const EXPENSE_CATEGORIES: TxCategory[] = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];
