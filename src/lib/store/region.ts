export type RegionMode = "gulf" | "morocco" | "egypt" | "other";

export const GULF_COUNTRIES = ["SA", "AE", "KW", "QA", "BH", "OM"];

/** Countries where Noon affiliate offers are shown. */
export const NOON_COUNTRIES = ["SA", "AE"];

export function regionModeFor(country: string | null | undefined): RegionMode {
  const code = (country ?? "").toUpperCase();
  if (GULF_COUNTRIES.includes(code)) return "gulf";
  if (code === "MA") return "morocco";
  if (code === "EG") return "egypt";
  return "other";
}

/** Gulf + Morocco run the dropshipping catalog; Egypt runs the coupon flow. */
export function showsDropship(mode: RegionMode) {
  return mode === "gulf" || mode === "morocco" || mode === "other";
}

export function showsNoon(country: string | null | undefined) {
  return NOON_COUNTRIES.includes((country ?? "").toUpperCase());
}

export function showsEgyptCoupon(mode: RegionMode) {
  return mode === "egypt";
}

export const COUNTRY_CURRENCY: Record<string, string> = {
  SA: "SAR",
  AE: "AED",
  KW: "KWD",
  QA: "QAR",
  BH: "BHD",
  OM: "OMR",
  MA: "MAD",
  EG: "EGP",
};
