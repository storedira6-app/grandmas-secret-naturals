import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

const POINTS_KEY = "gs-glow-points";
const DAILY_KEY = "gs-glow-daily";

type GlowValue = {
  points: number;
  award: (amount: number, reason: string) => void;
};

const GlowContext = createContext<GlowValue | null>(null);

export function GlowProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);

  const award = useCallback((amount: number, reason: string) => {
    setPoints((prev) => {
      const next = prev + amount;
      window.localStorage.setItem(POINTS_KEY, String(next));
      return next;
    });
    toast(`+${amount} 🌟`, { description: reason });
  }, []);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(POINTS_KEY) ?? 0);
    setPoints(Number.isFinite(stored) ? stored : 0);
  }, []);

  const value = useMemo(() => ({ points, award }), [points, award]);

  return <GlowContext.Provider value={value}>{children}</GlowContext.Provider>;
}

export function useGlow() {
  const ctx = useContext(GlowContext);
  if (!ctx) throw new Error("useGlow must be used inside GlowProvider");
  return ctx;
}

/** Awards the daily-open bonus once per calendar day. */
export function useDailyGlowBonus(reason: string) {
  const { award } = useGlow();
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (window.localStorage.getItem(DAILY_KEY) === today) return;
    window.localStorage.setItem(DAILY_KEY, today);
    const id = window.setTimeout(() => award(10, reason), 900);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
