/** Retail pricing rules for the Grandma's Secret dropshipping catalog. */

/** 50% profit margin applied on top of every supplier base cost. */
export const PROFIT_MARGIN = 0.5;

/** Egypt incentive: 10% discount coupon. */
export const EGYPT_COUPON_CODE = "NVLOT";
export const EGYPT_DISCOUNT = 0.1;

/** cost -> retail price (cost + 50%), rounded to 2 decimals. */
export function retailPrice(baseCost: number): number {
  if (!Number.isFinite(baseCost) || baseCost <= 0) return 0;
  return Math.round(baseCost * (1 + PROFIT_MARGIN) * 100) / 100;
}

/** Applies the Egypt 10% coupon to a retail price. */
export function applyEgyptCoupon(price: number): number {
  return Math.round(price * (1 - EGYPT_DISCOUNT) * 100) / 100;
}

export function formatPrice(value: number, currency: string): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  const amount = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  return `${amount} ${currency}`;
}
