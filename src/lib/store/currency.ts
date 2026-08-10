/** Geolocation-driven currency engine for the store catalog. */
import { roundUpHalf } from "./pricing";


export const EUROZONE = [
  "FR", "DE", "ES", "IT", "PT", "BE", "NL", "LU", "IE", "AT", "FI", "GR",
  "SK", "SI", "EE", "LV", "LT", "CY", "MT", "HR",
];

/** Country -> display currency. Everything else falls back to USD. */
export const CURRENCY_BY_COUNTRY: Record<string, string> = {
  MA: "MAD",
  SA: "SAR",
  AE: "AED",
  EG: "EGP",
  ...Object.fromEntries(EUROZONE.map((c) => [c, "EUR"])),
};

export const DEFAULT_CURRENCY = "USD";

export function currencyForCountry(country: string | null | undefined): string {
  const code = (country ?? "").toUpperCase();
  return CURRENCY_BY_COUNTRY[code] ?? DEFAULT_CURRENCY;
}

/** Offline fallback: units of each currency per 1 USD. */
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  MAD: 9.9,
  SAR: 3.75,
  AED: 3.67,
  EGP: 48,
  KWD: 0.31,
  QAR: 3.64,
  BHD: 0.38,
  OMR: 0.385,
};

/** Converts an amount between currencies using USD-based rates, ceiling-rounded. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number> = FALLBACK_RATES,
): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const src = (from || DEFAULT_CURRENCY).toUpperCase();
  const dst = (to || DEFAULT_CURRENCY).toUpperCase();
  if (src === dst) return roundUpHalf(amount);
  const fromRate = rates[src] ?? FALLBACK_RATES[src];
  const toRate = rates[dst] ?? FALLBACK_RATES[dst];
  if (!fromRate || !toRate) return roundUpHalf(amount);
  return roundUpHalf((amount / fromRate) * toRate);
}

const SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
};

/** Formats a converted amount for display (always .00 or .50). */
export function formatMoney(value: number, currency: string, locale = "en"): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  const symbol = SYMBOLS[currency];
  const rounded = roundUpHalf(value);
  const amount = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2);
  void locale;
  return symbol ? `${symbol}${amount}` : `${amount} ${currency}`;
}

