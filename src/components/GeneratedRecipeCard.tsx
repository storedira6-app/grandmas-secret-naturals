import { Clock, Leaf, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { GeneratedRecipe } from "@/lib/gemini.server";
import { useI18n } from "@/lib/i18n";
import { ProductRecommendations } from "@/components/store/ProductRecommendations";


export function GeneratedRecipeCard({ recipe }: { recipe: GeneratedRecipe }) {
  const { t } = useI18n();

  return (
    <article className="glass-card animate-rise space-y-3 overflow-hidden rounded-3xl p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3 className="flex min-w-0 items-start gap-2 text-base leading-snug font-semibold">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span className="min-w-0">{recipe.title}</span>
        </h3>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
          <Clock className="h-3 w-3" />
          {recipe.minutes} {t("min")}
        </span>
      </div>

      <div>
        <p className="mb-1 text-xs font-bold text-primary">{t("ingredients")}</p>
        <div className="flex flex-wrap gap-1.5">
          {recipe.ingredients.map((i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-full bg-accent/60 px-2.5 py-1 text-[11px] text-accent-foreground"
            >
              <Leaf className="h-3 w-3" />
              {i}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-bold text-primary">{t("steps")}</p>
        <ol className="space-y-1 text-sm text-muted-foreground">
          {recipe.steps.map((s, i) => (
            <li key={s} className="flex gap-2">
              <span className="gradient-gold grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-gold-foreground">
                {i + 1}
              </span>
              <span className="min-w-0">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {recipe.tip && (
        <p className="rounded-2xl bg-secondary/60 p-3 text-xs text-muted-foreground">🌿 {recipe.tip}</p>
      )}

      {recipe.precaution && (
        <p className="rounded-2xl border border-gold/40 bg-gold/10 p-3 text-xs text-foreground">
          ⚠️ {recipe.precaution}
        </p>
      )}

      {recipe.storeNote && (
        <Link
          to="/app/store"
          className="glass-card flex items-center gap-2 rounded-2xl p-3 text-xs font-semibold text-primary transition-transform active:scale-95"
        >
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span className="min-w-0">{recipe.storeNote}</span>
        </Link>
      )}
    </article>
  );
}
