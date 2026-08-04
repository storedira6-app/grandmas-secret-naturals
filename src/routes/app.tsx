import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Leaf, Flame } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { t } = useI18n();

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl">
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
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-accent/60 px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
            <Flame className="h-3 w-3" />7
          </span>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="px-4 pt-4 pb-28">
        <Outlet />
      </div>

      <BottomNav />
    </div>
  );
}
