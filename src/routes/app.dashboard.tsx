import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Flame, CheckCircle2, Circle, Bell, Droplets, Sunrise, Moon, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { SignInCard } from "@/components/SignIn";
import { RecipeCard } from "@/components/RecipeCard";
import { RECIPES } from "@/data/content";
import {
  ROUTINE_STEPS,
  computeStreak,
  todayKey,
  useReminderSettings,
  useRoutineHistory,
  useSaveReminderSettings,
  useSavedRecipes,
  useUpdateRoutineToday,
  DEFAULT_REMINDERS,
  type ReminderSettings,
} from "@/lib/user-data";
import { useNotificationPermission } from "@/lib/reminders";

export const Route = createFileRoute("/app/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Daily Routine dashboard | سر الجدة — Grandma's Secret" },
      {
        name: "description",
        content:
          "Your personalized natural beauty plan: daily routine checklist, saved recipes, streak progress and hydration reminders.",
      },
      { property: "og:title", content: "Daily Routine dashboard | Grandma's Secret" },
      {
        property: "og:description",
        content: "Track your streak, save recipes and set hydration and beauty routine reminders.",
      },
    ],
  }),
  component: DashboardTab,
});

function DashboardTab() {
  const { t } = useI18n();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="glass-card h-40 animate-pulse rounded-3xl" />;
  }

  if (!user) {
    return (
      <div className="space-y-5">
        <Header />
        <SignInCard />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <Header name={(user.user_metadata?.["full_name"] as string) ?? user.email ?? ""} />
        <button
          type="button"
          onClick={() => signOut()}
          aria-label={t("signOut")}
          className="glass-card grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      <StreakCard />
      <RoutineCard />
      <RemindersCard />
      <SavedRecipesCard />
    </div>
  );
}

function Header({ name }: { name?: string }) {
  const { t } = useI18n();
  return (
    <div className="min-w-0">
      <h1 className="truncate text-xl font-bold">{t("dashboard")}</h1>
      <p className="truncate text-xs text-muted-foreground">
        {name ? `${t("hello")} ${name.split(" ")[0]} · ${t("dashboardSub")}` : t("dashboardSub")}
      </p>
    </div>
  );
}

function StreakCard() {
  const { t } = useI18n();
  const { data: history = [] } = useRoutineHistory();
  const streak = useMemo(() => computeStreak(history), [history]);

  const week = useMemo(() => {
    const map = new Map(history.map((d) => [d.day, d]));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = todayKey(d);
      const row = map.get(key);
      return {
        key,
        label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
        done: !!row && row.steps_done >= row.steps_total,
      };
    });
  }, [history]);

  const best = useMemo(() => {
    const done = history
      .filter((d) => d.steps_done >= d.steps_total)
      .map((d) => d.day)
      .sort();
    let best = 0;
    let run = 0;
    let prev: string | null = null;
    for (const day of done) {
      if (prev) {
        const diff = (Date.parse(day) - Date.parse(prev)) / 86_400_000;
        run = diff === 1 ? run + 1 : 1;
      } else run = 1;
      best = Math.max(best, run);
      prev = day;
    }
    return best;
  }, [history]);

  return (
    <section className="glass-card animate-rise space-y-3 rounded-3xl p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">{t("streakTitle")}</h2>
          <p className="truncate text-xs text-muted-foreground">
            {t("bestStreak")}: {best} {t("days")}
          </p>
        </div>
        <span className="gradient-gold flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-gold-foreground">
          <Flame className="h-4 w-4" />
          {streak}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {week.map((d) => (
          <div key={d.key} className="text-center">
            <span
              className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold transition-all ${
                d.done
                  ? "gradient-forest text-primary-foreground glow-ring"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoutineCard() {
  const { t } = useI18n();
  const { data: history = [] } = useRoutineHistory();
  const update = useUpdateRoutineToday();
  const today = history.find((d) => d.day === todayKey());
  const doneCount = today?.steps_done ?? 0;

  const steps = [t("morningRoutine"), t("hydration"), t("eveningRoutine")];
  const pct = Math.round((doneCount / ROUTINE_STEPS) * 100);

  return (
    <section className="glass-card animate-rise space-y-3 rounded-3xl p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-base font-bold">{t("routine")}</h2>
        <span className="shrink-0 text-xs font-bold text-primary">
          {t("progressToday")}: {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="gradient-forest h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const isDone = i < doneCount;
          return (
            <button
              key={step}
              type="button"
              onClick={() => update.mutate({ steps_done: isDone ? i : i + 1 })}
              className="flex w-full items-center gap-3 rounded-2xl bg-secondary/50 px-3 py-2.5 text-start transition-colors"
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span className={`min-w-0 truncate text-sm ${isDone ? "line-through opacity-60" : ""}`}>
                {step}
              </span>
            </button>
          );
        })}
      </div>
      {doneCount >= ROUTINE_STEPS && (
        <p className="text-center text-xs font-bold text-primary">{t("routineDone")}</p>
      )}
    </section>
  );
}

function RemindersCard() {
  const { t } = useI18n();
  const { data } = useReminderSettings();
  const save = useSaveReminderSettings();
  const { permission, request } = useNotificationPermission();
  const [form, setForm] = useState<ReminderSettings>(DEFAULT_REMINDERS);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const patch = (p: Partial<ReminderSettings>) => setForm((f) => ({ ...f, ...p }));

  return (
    <section className="glass-card animate-rise space-y-3 rounded-3xl p-4">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Bell className="h-4 w-4 text-gold" />
          {t("reminders")}
        </h2>
        <p className="text-xs text-muted-foreground">{t("remindersSub")}</p>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/50 px-3 py-2.5">
        <span className="min-w-0 truncate text-sm font-semibold">
          {form.notifications_enabled ? t("notificationsOn") : t("enableNotifications")}
        </span>
        <input
          type="checkbox"
          checked={form.notifications_enabled}
          onChange={async (e) => {
            const on = e.target.checked;
            if (on && permission !== "granted") await request();
            patch({ notifications_enabled: on });
          }}
          className="h-5 w-9 shrink-0 accent-[var(--primary)]"
        />
      </label>
      {permission === "denied" && (
        <p className="text-[11px] text-muted-foreground">{t("notificationsBlocked")}</p>
      )}

      <label className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/50 px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-2 truncate text-sm">
          <Droplets className="h-4 w-4 shrink-0 text-primary" />
          {t("hydration")}
        </span>
        <input
          type="checkbox"
          checked={form.hydration_enabled}
          onChange={(e) => patch({ hydration_enabled: e.target.checked })}
          className="h-5 w-9 shrink-0 accent-[var(--primary)]"
        />
      </label>

      <div className="rounded-2xl bg-secondary/50 px-3 py-2.5">
        <p className="mb-2 text-xs font-semibold">
          {t("everyMinutes").replace("{n}", String(form.hydration_interval_min))}
        </p>
        <input
          type="range"
          min={30}
          max={240}
          step={15}
          value={form.hydration_interval_min}
          onChange={(e) => patch({ hydration_interval_min: Number(e.target.value) })}
          className="w-full accent-[var(--primary)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="rounded-2xl bg-secondary/50 px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <Sunrise className="h-3.5 w-3.5" />
            {t("morningRoutine")}
          </span>
          <input
            type="time"
            value={form.morning_time}
            onChange={(e) => patch({ morning_time: e.target.value })}
            className="mt-1 w-full bg-transparent text-sm font-bold outline-none"
          />
        </label>
        <label className="rounded-2xl bg-secondary/50 px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <Moon className="h-3.5 w-3.5" />
            {t("eveningRoutine")}
          </span>
          <input
            type="time"
            value={form.evening_time}
            onChange={(e) => patch({ evening_time: e.target.value })}
            className="mt-1 w-full bg-transparent text-sm font-bold outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={save.isPending}
        onClick={() =>
          save.mutate(form, { onSuccess: () => toast.success(t("settingsSaved")) })
        }
        className="gradient-forest w-full rounded-2xl py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {t("saveSettings")}
      </button>
    </section>
  );
}

function SavedRecipesCard() {
  const { t } = useI18n();
  const { data: saved = [] } = useSavedRecipes();
  const recipes = RECIPES.filter((r) => saved.includes(r.id));

  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold">{t("savedRecipes")}</h2>
      {recipes.length === 0 ? (
        <p className="glass-card rounded-3xl p-4 text-xs text-muted-foreground">{t("noSaved")}</p>
      ) : (
        recipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)
      )}
    </section>
  );
}
