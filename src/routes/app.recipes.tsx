import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, CheckCircle2, Circle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { RECIPES } from "@/data/content";
import { RecipeCard } from "@/components/RecipeCard";
import { useAuth } from "@/lib/auth";
import {
  computeStreak,
  todayKey,
  useRoutineHistory,
  useUpdateRoutineToday,
} from "@/lib/user-data";

export const Route = createFileRoute("/app/recipes")({
  head: () => ({
    meta: [
      { title: "Trending natural recipes | سر الجدة — وصفات ترند" },
      {
        name: "description",
        content: "Three handpicked natural rituals every day: morning mask, day hydrator and night balm.",
      },
      { property: "og:title", content: "Trending natural recipes | سر الجدة" },
      { property: "og:description", content: "Daily natural beauty rituals with ingredients and steps." },
    ],
  }),
  component: RecipesTab,
});

const MOODS = [
  { key: "moodTired", emoji: "😴" },
  { key: "moodGlow", emoji: "✨" },
  { key: "moodDry", emoji: "🌵" },
  { key: "moodStress", emoji: "🌪️" },
];

function RecipesTab() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data: history = [] } = useRoutineHistory();
  const update = useUpdateRoutineToday();
  const today = history.find((d) => d.day === todayKey());
  const streak = computeStreak(history);

  const [localMood, setLocalMood] = useState<string | null>(null);
  const [localDone, setLocalDone] = useState(0);
  const mood = user ? (today?.mood ?? null) : localMood;
  const doneCount = user ? (today?.steps_done ?? 0) : localDone;

  const setMood = (m: string) => (user ? update.mutate({ mood: m }) : setLocalMood(m));
  const setDoneCount = (n: number) =>
    user ? update.mutate({ steps_done: n }) : setLocalDone(n);

  const routine = [t("onboard1d"), t("onboard2d"), t("onboard3d")];
  const complete = doneCount >= routine.length;

  return (
    <div className="space-y-5">
      <section className="glass-card animate-rise space-y-3 rounded-3xl p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold">{t("moodTitle")}</h2>
            <p className="truncate text-xs text-muted-foreground">{t("moodSub")}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/60 px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
            <Flame className="h-3 w-3" />
            {streak} {t("streak")}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMood(m.key)}
              className={`rounded-2xl border px-2 py-3 text-center transition-all duration-300 active:scale-95 ${
                mood === m.key
                  ? "gradient-warm border-gold glow-ring"
                  : "border-border bg-card/60"
              }`}
            >
              <span className="block text-xl">{m.emoji}</span>
              <span className="mt-1 block text-[10px] font-semibold">{t(m.key)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card animate-rise space-y-2 rounded-3xl p-4">
        <h2 className="text-base font-bold">{t("routine")}</h2>
        {routine.map((step, i) => {
          const isDone = i < doneCount;
          return (
            <button
              key={step}
              type="button"
              onClick={() => setDoneCount(isDone ? i : i + 1)}
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
        {complete && <p className="pt-1 text-center text-xs font-bold text-primary">{t("routineDone")}</p>}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">{t("today")}</h2>
          <p className="text-xs text-muted-foreground">{t("todaySub")}</p>
        </div>
        {RECIPES.map((r, i) => (
          <RecipeCard key={r.id} recipe={r} index={i} />
        ))}
      </section>
    </div>
  );
}
