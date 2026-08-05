import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const ROUTINE_STEPS = 3;

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export type RoutineDay = {
  day: string;
  steps_done: number;
  steps_total: number;
  mood: string | null;
};

export type ReminderSettings = {
  notifications_enabled: boolean;
  hydration_enabled: boolean;
  hydration_interval_min: number;
  morning_time: string;
  evening_time: string;
};

export const DEFAULT_REMINDERS: ReminderSettings = {
  notifications_enabled: false,
  hydration_enabled: true,
  hydration_interval_min: 90,
  morning_time: "08:00",
  evening_time: "21:00",
};

/** Consecutive completed days ending today or yesterday. */
export function computeStreak(days: RoutineDay[]) {
  const completed = new Set(
    days.filter((d) => d.steps_done >= d.steps_total).map((d) => d.day),
  );
  let streak = 0;
  const cursor = new Date();
  if (!completed.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (completed.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useSavedRecipes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-recipes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_recipes").select("recipe_id");
      if (error) throw error;
      return data.map((r) => r.recipe_id);
    },
  });
}

export function useToggleSavedRecipe() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recipeId, save }: { recipeId: string; save: boolean }) => {
      if (!user) throw new Error("not signed in");
      if (save) {
        const { error } = await supabase
          .from("saved_recipes")
          .upsert({ user_id: user.id, recipe_id: recipeId }, { onConflict: "user_id,recipe_id" });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_recipes")
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipeId);
        if (error) throw error;
      }
      return save;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-recipes", user?.id] }),
  });
}

export function useRoutineHistory() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["routine-days", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routine_days")
        .select("day, steps_done, steps_total, mood")
        .order("day", { ascending: false })
        .limit(120);
      if (error) throw error;
      return data as RoutineDay[];
    },
  });
}

export function useUpdateRoutineToday() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: { steps_done?: number; mood?: string | null }) => {
      if (!user) throw new Error("not signed in");
      const { error } = await supabase.from("routine_days").upsert(
        {
          user_id: user.id,
          day: todayKey(),
          steps_total: ROUTINE_STEPS,
          ...patch,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,day" },
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routine-days", user?.id] }),
  });
}

export function useReminderSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminder-settings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminder_settings")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return (data as ReminderSettings | null) ?? DEFAULT_REMINDERS;
    },
  });
}

export function useSaveReminderSettings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: ReminderSettings) => {
      if (!user) throw new Error("not signed in");
      const { error } = await supabase
        .from("reminder_settings")
        .upsert(
          { user_id: user.id, ...settings, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminder-settings", user?.id] }),
  });
}
