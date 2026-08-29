import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircleHeart, Flower2, Sparkles, ShoppingBag, Gift } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useGlow } from "@/lib/glow";

const ITEMS = [
  { to: "/app/chat", key: "navChat", Icon: MessageCircleHeart },
  { to: "/app/recipes", key: "navRecipes", Icon: Flower2 },
  { to: "/app/skin", key: "navSkin", Icon: Sparkles },
  { to: "/app/store", key: "navStore", Icon: ShoppingBag },
  { to: "/app/wallet", key: "walletTitle", Icon: Gift },
] as const;

export function BottomNav() {
  const { t } = useI18n();
  const { points } = useGlow();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-3">
      <div className="glass-card flex items-center justify-around rounded-[28px] border border-gold/25 px-1.5 py-2 shadow-lg shadow-primary/10">
        {ITEMS.map(({ to, key, Icon }) => {
          const active = pathname === to;
          const wallet = to === "/app/wallet";
          return (
            <Link
              key={to}
              to={to}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-0.5 py-1.5 transition-all duration-300"
            >
              {active && (
                <span className="gradient-gold absolute -top-0.5 h-1 w-6 rounded-full opacity-90" />
              )}
              <span
                className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-2xl transition-all duration-300 ${
                  active
                    ? "gradient-forest text-primary-foreground scale-110 glow-ring"
                    : wallet
                      ? "bg-gold/15 text-gold"
                      : "bg-secondary/60 text-muted-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {wallet && !active && (
                  <span className="gradient-gold absolute -end-1 -top-1 grid h-4 min-w-4 animate-pulse place-items-center rounded-full px-1 text-[8px] font-bold text-gold-foreground">
                    {points}
                  </span>
                )}
              </span>
              <span
                className={`w-full truncate text-center text-[9px] font-semibold transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
