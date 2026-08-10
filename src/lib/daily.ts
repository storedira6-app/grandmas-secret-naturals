import { useEffect, useState } from "react";

/** Local-date key, e.g. "2026-08-10" (uses the device's own calendar day). */
export function localDayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Stable day number since epoch, in the user's local timezone. */
export function localDayNumber(d = new Date()) {
  const local = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor(local / 86_400_000);
}

/**
 * Re-renders exactly when the local calendar day flips, so daily content
 * never gets stuck on a long-lived session.
 */
export function useDayKey() {
  const [key, setKey] = useState(() => localDayKey());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 500);
      timer = setTimeout(() => {
        setKey(localDayKey());
        schedule();
      }, Math.max(1000, next.getTime() - now.getTime()));
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") setKey(localDayKey());
    };

    setKey(localDayKey());
    schedule();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return key;
}

/** Deterministic daily rotation of any list — same order all day, shifts at midnight. */
export function rotateDaily<T>(items: T[], dayNumber = localDayNumber()) {
  if (items.length === 0) return items;
  const offset = ((dayNumber % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
