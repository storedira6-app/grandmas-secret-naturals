import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useBeautyProfile, profileKeywords } from "@/lib/store/beauty-profile";
import { GlobalBrandSuggestions } from "./GlobalBrandMarket";

/**
 * Featured spotlight: Grandma's Recommendations personalized to the visitor's
 * skin/hair profile — always from our affiliate partner brands only.
 */
export function GrandmaPicks() {
  const { t } = useI18n();
  const profile = useBeautyProfile();
  const keywords = profileKeywords(profile);

  return (
    <section className="animate-rise space-y-3 rounded-3xl border border-gold/40 bg-gold/5 p-3">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-base font-bold text-primary">
            <Sparkles className="h-4 w-4 shrink-0 text-gold" />
            <span className="truncate">{t("picksTitle")}</span>
          </h2>
          <p className="truncate text-[11px] text-muted-foreground">
            {profile ? t("picksForYou") : t("picksSub")}
          </p>
        </div>
        {!profile && (
          <Link
            to="/app/quiz"
            className="gradient-gold shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold text-gold-foreground"
          >
            {t("picksQuizCta")}
          </Link>
        )}
      </header>

      <GlobalBrandSuggestions
        keywords={keywords}
        seed={`picks-${profile?.skin ?? "guest"}`}
        limit={3}
      />
    </section>
  );
}
