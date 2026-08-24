import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BottomNav } from "@/components/BottomNav";
import { LeafParticles } from "@/components/LeafParticles";
import { useDailyGlowBonus, useGlow } from "@/lib/glow";
import { hideBanner, initAds, showBanner } from "@/lib/ads";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { t } = useI18n();
  const { points } = useGlow();
  useDailyGlowBonus(t("glowDaily"));

  useEffect(() => {
    void initAds().then(showBanner);
    return () => {
      void hideBanner();
    };
  }, []);



  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <header className="sticky top-0 z-30 overflow-hidden border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <LeafParticles />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="gradient-forest grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm leading-tight font-bold">{t("brand")}</p>
              <p className="truncate text-[10px] font-semibold tracking-widest text-gold uppercase">
                {t("tagline")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              title={t("glowPoints")}
              className="flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold"
            >
              🌟 {points}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
      </header>


      <div className="px-4 pt-4 pb-28">
        <Outlet />
      </div>

      <BottomNav />
    </div>
  );
}
