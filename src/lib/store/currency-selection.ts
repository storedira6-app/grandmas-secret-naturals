import { useEffect, useSyncExternalStore } from "react";

export type SelectableCurrency = "MAD" | "EUR" | "USD";

const STORAGE_KEY = "grandmas-secret-currency";
const listeners = new Set<() => void>();
let selectedCurrency: SelectableCurrency | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function setSelectedCurrency(currency: SelectableCurrency | null) {
  selectedCurrency = currency;
  if (typeof window !== "undefined") {
    if (currency) window.localStorage.setItem(STORAGE_KEY, currency);
    else window.localStorage.removeItem(STORAGE_KEY);
  }
  emit();
}

export function useSelectedCurrency() {
  const selected = useSyncExternalStore(subscribe, () => selectedCurrency, () => null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "MAD" || stored === "EUR" || stored === "USD") {
      setSelectedCurrency(stored);
    }
  }, []);

  return { selected, setSelectedCurrency };
}