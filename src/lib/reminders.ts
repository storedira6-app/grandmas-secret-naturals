import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useReminderSettings } from "@/lib/user-data";

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported" as const;
  return Notification.requestPermission();
}

function notify(title: string, body: string) {
  toast(title, { description: body });
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon: "/favicon.ico" });
    } catch {
      /* some browsers require a service worker; the in-app toast still shows */
    }
  }
}

function minutesOfDay(hhmm: string) {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
}

/**
 * In-app + browser reminders while the app is open:
 * hydration on an interval, plus morning/evening routine timing.
 */
export function useReminderScheduler() {
  const { t } = useI18n();
  const { data: settings } = useReminderSettings();
  const fired = useRef<Record<string, string>>({});
  const lastHydration = useRef<number>(Date.now());

  useEffect(() => {
    if (!settings?.notifications_enabled) return;
    lastHydration.current = Date.now();

    const tick = () => {
      const now = new Date();
      const dayKey = now.toISOString().slice(0, 10);
      const nowMin = now.getHours() * 60 + now.getMinutes();

      if (
        settings.hydration_enabled &&
        Date.now() - lastHydration.current >= settings.hydration_interval_min * 60_000
      ) {
        lastHydration.current = Date.now();
        notify(t("hydration"), t("hydrationMsg"));
      }

      const slots: { key: string; at: number; title: string; msg: string }[] = [
        {
          key: "morning",
          at: minutesOfDay(settings.morning_time),
          title: t("morningRoutine"),
          msg: t("morningMsg"),
        },
        {
          key: "evening",
          at: minutesOfDay(settings.evening_time),
          title: t("eveningRoutine"),
          msg: t("eveningMsg"),
        },
      ];

      for (const slot of slots) {
        if (nowMin >= slot.at && nowMin < slot.at + 15 && fired.current[slot.key] !== dayKey) {
          fired.current[slot.key] = dayKey;
          notify(slot.title, slot.msg);
        }
      }
    };

    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [settings, t]);
}

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  useEffect(() => setPermission(notificationPermission()), []);
  return {
    permission,
    request: async () => {
      const result = await requestNotificationPermission();
      setPermission(result);
      return result;
    },
  };
}
