/** Retail pricing rules for the Grandma's Secret dropshipping catalog. */

/** 80% profit margin applied on top of every supplier base cost. */
export const PROFIT_MARGIN = 0.8;

/** Egypt incentive: 10% discount coupon. */
export const EGYPT_COUPON_CODE = "NVLOT";
export const EGYPT_DISCOUNT = 0.1;

/**
 * Strict ceiling rounding: always rounds UP to the nearest 0.50 or whole unit.
 * 12.01–12.50 -> 12.50, 12.51–12.99 -> 13.00.
 */
export function roundUpHalf(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  // Guard against float noise (e.g. 12.500000001).
  return Math.ceil(Number((value * 2).toFixed(6))) / 2;
}

/** cost -> retail price (cost + 80%), rounded up to the nearest 0.50. */
export function retailPrice(baseCost: number): number {
  if (!Number.isFinite(baseCost) || baseCost <= 0) return 0;
  return roundUpHalf(baseCost * (1 + PROFIT_MARGIN));
}

/** Applies the Egypt 10% coupon to a retail price (still ceiling-rounded). */
export function applyEgyptCoupon(price: number): number {
  return roundUpHalf(price * (1 - EGYPT_DISCOUNT));
}


export function formatPrice(value: number, currency: string): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  const amount = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  return `${amount} ${currency}`;
}
