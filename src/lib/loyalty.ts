/**
 * Client-side loyalty + lifecycle engine (localStorage only).
 * Handles: legal consent, install/version age, the teaching banner -> AdSense
 * switch after 7 days, the daily mystery box, purchase-linked earning and
 * the $50 withdrawal eligibility rules.
 */

/** Bump on major releases: resets the 7-day teaching banner window. */
export const APP_VERSION = "2026.08.25";

export const BANNER_DAYS = 7;
export const POINT_VALUE_USD = 0.01; // 100 points = $1
export const WITHDRAW_TARGET_USD = 50;
export const WITHDRAW_TARGET_POINTS = Math.round(WITHDRAW_TARGET_USD / POINT_VALUE_USD);
export const REQUIRED_PURCHASES = 6;
/** Margin engine: price = cost * 1.8 → net profit share of price. */
const PROFIT_SHARE_OF_PRICE = 0.8 / 1.8;
/** Share of net profit returned to the customer as points (safe, win-win). */
const REWARD_RATE = 0.1;

const K = {
  consent: "gs-legal-consent-v1",
  installAt: "gs-install-at",
  version: "gs-app-version",
  box: "gs-mystery-box-last",
  purchases: "gs-purchase-count",
  cash: "gs-cash-credit-usd",
  coupon: "gs-box-coupon",
  push2: "gs-push-day2-sent",
  withdraw: "gs-withdraw-requested",
  referCode: "gs-referral-code",
  referUsed: "gs-referral-used",
} as const;

/** Referral rewards: inviter gets 200 🌟, the new friend gets 100 🌟. */
export const REFERRAL_INVITER_POINTS = 200;
export const REFERRAL_FRIEND_POINTS = 100;

const has = () => typeof window !== "undefined";
const num = (key: string, fallback = 0) => {
  if (!has()) return fallback;
  const v = Number(window.localStorage.getItem(key));
  return Number.isFinite(v) ? v : fallback;
};

/* ---------------- consent ---------------- */

export function hasConsent() {
  return has() && window.localStorage.getItem(K.consent) === "true";
}

export function saveConsent() {
  if (!has()) return;
  window.localStorage.setItem(K.consent, "true");
  window.localStorage.setItem(`${K.consent}-at`, new Date().toISOString());
  ensureLifecycle();
}

/* ---------------- install / version age ---------------- */

/** Stamps install time and resets the banner window on a major version change. */
export function ensureLifecycle() {
  if (!has()) return;
  const storedVersion = window.localStorage.getItem(K.version);
  if (storedVersion !== APP_VERSION) {
    window.localStorage.setItem(K.version, APP_VERSION);
    window.localStorage.setItem(K.installAt, String(Date.now()));
    window.localStorage.removeItem(K.push2);
    return;
  }
  if (!window.localStorage.getItem(K.installAt)) {
    window.localStorage.setItem(K.installAt, String(Date.now()));
  }
}

export function daysSinceInstall() {
  if (!has()) return 0;
  const at = num(K.installAt, Date.now());
  return (Date.now() - at) / 86_400_000;
}

/** Teaching banner shows for the first 7 days; then the ad slot takes over. */
export function bannerActive() {
  return daysSinceInstall() < BANNER_DAYS;
}

/* ---------------- mystery box ---------------- */

export type BoxReward =
  | { kind: "points"; points: number }
  | { kind: "discount"; points: number; code: string; percent: number }
  | { kind: "cash"; points: number; usd: number };

export function boxLastOpened() {
  return num(K.box, 0);
}

export function boxMsRemaining() {
  const last = boxLastOpened();
  if (!last) return 0;
  return Math.max(0, 86_400_000 - (Date.now() - last));
}

export function canOpenBox() {
  return boxMsRemaining() === 0;
}

export function openMysteryBox(): BoxReward {
  if (!canOpenBox()) throw new Error("box-not-ready");
  window.localStorage.setItem(K.box, String(Date.now()));
  const roll = Math.random();
  if (roll > 0.995) {
    const usd = 0.25;
    window.localStorage.setItem(K.cash, String(cashCreditUsd() + usd));
    return { kind: "cash", points: 5, usd };
  }
  if (roll > 0.85) {
    const percent = 5;
    const code = `GLOW${percent}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    window.localStorage.setItem(K.coupon, code);
    return { kind: "discount", points: 3, code, percent };
  }
  const points = 2 + Math.floor(Math.random() * 6);
  return { kind: "points", points };
}

export function cashCreditUsd() {
  return num(K.cash, 0);
}

export function boxCoupon() {
  return has() ? window.localStorage.getItem(K.coupon) : null;
}

/* ---------------- purchases & withdrawal ---------------- */

/** Rough USD conversion for reward math only (never used for pricing). */
const USD_PER: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  MAD: 0.1,
  SAR: 0.27,
  AED: 0.27,
  EGP: 0.021,
};

export function purchaseRewardPoints(amount: number, currency: string) {
  const usd = amount * (USD_PER[currency.toUpperCase()] ?? 1);
  const netProfit = usd * PROFIT_SHARE_OF_PRICE;
  return Math.max(5, Math.round((netProfit * REWARD_RATE) / POINT_VALUE_USD));
}

export function purchaseCount() {
  return num(K.purchases, 0);
}

export function recordPurchase() {
  if (!has()) return 0;
  const next = purchaseCount() + 1;
  window.localStorage.setItem(K.purchases, String(next));
  return next;
}

export function withdrawalStatus(points: number) {
  const purchases = purchaseCount();
  return {
    points,
    purchases,
    requiredPoints: WITHDRAW_TARGET_POINTS,
    requiredPurchases: REQUIRED_PURCHASES,
    eligible: points >= WITHDRAW_TARGET_POINTS && purchases >= REQUIRED_PURCHASES,
    requested: has() && window.localStorage.getItem(K.withdraw) === "true",
    progress: Math.min(
      1,
      (Math.min(points / WITHDRAW_TARGET_POINTS, 1) + Math.min(purchases / REQUIRED_PURCHASES, 1)) / 2,
    ),
  };
}

export function markWithdrawalRequested() {
  if (has()) window.localStorage.setItem(K.withdraw, "true");
}

/* ---------------- push notifications ---------------- */

export function pushDay2Sent() {
  return has() && window.localStorage.getItem(K.push2) === "true";
}

export function markPushDay2Sent() {
  if (has()) window.localStorage.setItem(K.push2, "true");
}


/* ---------------- referrals ---------------- */

/** Stable personal referral code for this device/account. */
export function referralCode(): string {
  if (!has()) return "GLOW";
  let code = window.localStorage.getItem(K.referCode);
  if (!code) {
    code = `N${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    window.localStorage.setItem(K.referCode, code);
  }
  return code;
}

export function referralLink(): string {
  if (!has()) return "";
  return `${window.location.origin}/?ref=${referralCode()}`;
}

/**
 * Reads ?ref= on first open and returns the friend's welcome points once.
 * Returns 0 when there is no new referral to reward.
 */
export function claimReferral(): number {
  if (!has()) return 0;
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (!ref) return 0;
  if (ref === window.localStorage.getItem(K.referCode)) return 0;
  if (window.localStorage.getItem(K.referUsed)) return 0;
  window.localStorage.setItem(K.referUsed, ref);
  return REFERRAL_FRIEND_POINTS;
}
