import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { GlobalBrandSuggestions } from "./GlobalBrandMarket";

/**
 * Smart in-recipe product recommendations — sourced ONLY from our affiliate
 * partner brands (Global Beauty Market).
 */
export function ProductRecommendations({
  ingredients,
  seed,
}: {
  ingredients: string[];
  seed?: string;
}) {
  const { t } = useI18n();

  return (
    <section className="space-y-2 rounded-2xl border border-gold/30 bg-gold/5 p-3">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          {t("recommendedForRecipe")}
        </p>
        <p className="text-[11px] text-muted-foreground">{t("recommendedSub")}</p>
      </div>

      <GlobalBrandSuggestions keywords={ingredients} limit={3} {...(seed ? { seed } : {})} />
    </section>
  );
}
