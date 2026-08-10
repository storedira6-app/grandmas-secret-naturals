import { createServerFn } from "@tanstack/react-start";

export type FxRates = { base: "USD"; rates: Record<string, number>; live: boolean };

/** Live USD-based FX rates with a static fallback so prices always render. */
export const getFxRates = createServerFn({ method: "GET" }).handler(async (): Promise<FxRates> => {
  const { FALLBACK_RATES } = await import("./store/currency");
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`fx ${res.status}`);
    const json = (await res.json()) as { result?: string; rates?: Record<string, number> };
    if (json.result !== "success" || !json.rates) throw new Error("fx payload");
    return { base: "USD", rates: { ...FALLBACK_RATES, ...json.rates }, live: true };
  } catch (error) {
    console.error("[fx] falling back to static rates:", error);
    return { base: "USD", rates: FALLBACK_RATES, live: false };
  }
});
