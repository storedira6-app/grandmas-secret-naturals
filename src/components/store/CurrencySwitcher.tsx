import { Banknote, ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/store-client";
import type { SelectableCurrency } from "@/lib/store/currency-selection";

const OPTIONS: SelectableCurrency[] = ["MAD", "EUR", "USD"];

export function CurrencySwitcher() {
  const { currency, selectedCurrency, setCurrency } = useCurrency();

  return (
    <label className="glass-card relative flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-primary">
      <Banknote className="h-3.5 w-3.5" aria-hidden="true" />
      <select
        aria-label="Currency"
        value={selectedCurrency ?? "auto"}
        onChange={(event) => {
          const value = event.target.value;
          setCurrency(value === "auto" ? null : (value as SelectableCurrency));
        }}
        className="appearance-none bg-transparent pe-4 outline-none"
      >
        <option value="auto">Auto · {currency}</option>
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-2.5 h-3 w-3" aria-hidden="true" />
    </label>
  );
}