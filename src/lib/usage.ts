/**
 * Daily free-usage limiter (localStorage only).
 * Each AI feature gets a small number of free runs per day; extra runs are
 * unlocked by watching a sponsored video (Adsterra smart link).
 */
import { useCallback, useEffect, useState } from "react";

/** Free runs granted every day, per feature. */
export const FREE_DAILY_USES = 3;
/** Extra runs granted after watching one sponsored video. */
export const USES_PER_VIDEO = 2;
/** Seconds the sponsored page must stay open before the reward unlocks. */
export const VIDEO_WATCH_SECONDS = 15;

export const AD_SMARTLINK =
  "https://www.profitableratecpmnetwork.com/um8m35en?key=13489f94fd5bb2be769110e122aaadc5";

export type UsageFeature = "chat" | "skin" | "scan";

const has = () => typeof window !== "undefined";

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function storageKey(feature: UsageFeature) {
  return `gs-usage-${feature}`;
}

type Record_ = { day: string; used: number; bonus: number };

function read(feature: UsageFeature): Record_ {
  const fresh: Record_ = { day: dayKey(), used: 0, bonus: 0 };
  if (!has()) return fresh;
  try {
    const raw = window.localStorage.getItem(storageKey(feature));
    if (!raw) return fresh;
    const parsed = JSON.parse(raw) as Record_;
    if (parsed.day !== dayKey()) return fresh;
    return { day: parsed.day, used: Number(parsed.used) || 0, bonus: Number(parsed.bonus) || 0 };
  } catch {
    return fresh;
  }
}

function write(feature: UsageFeature, rec: Record_) {
  if (!has()) return;
  window.localStorage.setItem(storageKey(feature), JSON.stringify(rec));
  window.dispatchEvent(new Event("gs-usage-change"));
}

export function remainingUses(feature: UsageFeature) {
  const rec = read(feature);
  return Math.max(0, FREE_DAILY_USES + rec.bonus - rec.used);
}

export function consumeUse(feature: UsageFeature) {
  const rec = read(feature);
  write(feature, { ...rec, day: dayKey(), used: rec.used + 1 });
}

export function grantBonusUses(feature: UsageFeature, amount = USES_PER_VIDEO) {
  const rec = read(feature);
  write(feature, { ...rec, day: dayKey(), bonus: rec.bonus + amount });
}

/** Opens the sponsored smart link in a new tab. */
export function openSponsoredVideo() {
  if (!has()) return;
  window.open(AD_SMARTLINK, "_blank", "noopener,noreferrer");
}

/** Reactive daily quota for one feature (hydration-safe). */
export function useDailyUses(feature: UsageFeature) {
  const [left, setLeft] = useState(FREE_DAILY_USES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setLeft(remainingUses(feature));
    sync();
    setReady(true);
    window.addEventListener("gs-usage-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gs-usage-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [feature]);

  const consume = useCallback(() => consumeUse(feature), [feature]);
  const grant = useCallback((n = USES_PER_VIDEO) => grantBonusUses(feature, n), [feature]);

  return { left, ready, consume, grant, limitReached: ready && left <= 0 };
}
