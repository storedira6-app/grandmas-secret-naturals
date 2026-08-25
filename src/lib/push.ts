import { daysSinceInstall, markPushDay2Sent, pushDay2Sent } from "./loyalty";

/** Asks for web-push permission (PWA); silently no-ops when unsupported. */
export async function requestPushPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  try {
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    return await Notification.requestPermission();
  } catch {
    return "unsupported";
  }
}

async function show(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" });
      return;
    }
    new Notification(title, { body, icon: "/icon-192.png" });
  } catch (e) {
    console.warn("[push] failed", e);
  }
}

/**
 * Sends Grandma's day-2 reminder once, when the app is opened at least two
 * days after install/major update.
 */
export async function maybeSendDay2Reminder(title: string, body: string) {
  if (pushDay2Sent()) return;
  if (daysSinceInstall() < 2) return;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  markPushDay2Sent();
  await show(title, body);
}
