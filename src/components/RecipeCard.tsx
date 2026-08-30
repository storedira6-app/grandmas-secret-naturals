import { useState } from "react";
import { Clock, Leaf, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useGlow } from "@/lib/glow";
import { useSavedRecipes, useToggleSavedRecipe } from "@/lib/user-data";
import type { Recipe } from "@/data/content";
import { ProductRecommendations } from "@/components/store/ProductRecommendations";


export function RecipeCard({ recipe, index = 0 }: { recipe: Recipe; index?: number }) {
  const { lang, t } = useI18n();
  const { user } = useAuth();
  const { award } = useGlow();
  const [open, setOpen] = useState(false);
  const { data: savedIds = [] } = useSavedRecipes();
  const toggle = useToggleSavedRecipe();
  const saved = savedIds.includes(recipe.id);


  return (
    <article
      className="glass-card animate-rise overflow-hidden rounded-3xl"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title[lang]}
          loading="lazy"
          width={1024}
          height={768}
          className="h-44 w-full object-cover"
        />
        <span className="gradient-gold absolute start-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold text-gold-foreground">
          {recipe.tag[lang]}
        </span>
        <button
          type="button"
          onClick={() => {
            if (!user) {
              toast(t("loginRequired"));
              return;
            }
            toggle.mutate(
              { recipeId: recipe.id, save: !saved },
              {
                onSuccess: (didSave) => {
                  toast(didSave ? t("savedToast") : t("unsavedToast"));
                  if (didSave) award(5, t("glowSaved"));
                },
              },
            );

          }}
          aria-label={t("saveRecipe")}
          className="glass-card absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full text-primary transition-transform active:scale-90"
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <h3 className="min-w-0 text-base leading-snug font-semibold">{recipe.title[lang]}</h3>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
            <Clock className="h-3 w-3" />
            {recipe.minutes} {t("min")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{recipe.desc[lang]}</p>

        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
            🧾 {recipe.steps[lang].length}
          </span>
          <span className="rounded-full bg-gold/15 px-2 py-1 text-gold">
            ✨ {recipe.ingredients[lang][0]}
          </span>
          <span className="rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
            🌙 {recipe.tag[lang]}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipe.ingredients[lang].slice(0, 3).map((i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-full bg-accent/60 px-2.5 py-1 text-[11px] text-accent-foreground"
            >
              <Leaf className="h-3 w-3" />
              {i}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="gradient-forest w-full rounded-2xl py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {open ? "—" : t("steps")}
        </button>

        {open && (
          <div className="animate-rise space-y-3 rounded-2xl bg-secondary/60 p-3">
            <div>
              <p className="mb-1 text-xs font-bold text-primary">{t("ingredients")}</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {recipe.ingredients[lang].map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-primary">{t("steps")}</p>
              <ol className="space-y-1 text-sm text-muted-foreground">
                {recipe.steps[lang].map((s, i) => (
                  <li key={s} className="flex gap-2">
                    <span className="gradient-gold grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-gold-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <ProductRecommendations
              ingredients={recipe.ingredients[lang]}
              seed={recipe.id}
            />
          </div>
        )}

      </div>
    </article>
  );
}
