import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircleHeart, Sparkles, ShoppingBag, MapPinned } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ITEMS = [
  { to: "/app/chat", key: "navChat", Icon: MessageCircleHeart },
  { to: "/app/recipes", key: "navRecipes", Icon: Sparkles },
  { to: "/app/store", key: "navStore", Icon: ShoppingBag },
  { to: "/app/directory", key: "navMap", Icon: MapPinned },
] as const;

export function BottomNav() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-3">
      <div className="glass-card flex items-center justify-around rounded-3xl px-2 py-2">
        {ITEMS.map(({ to, key, Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 transition-all duration-300"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                  active
                    ? "gradient-forest text-primary-foreground scale-110 glow-ring"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span
                className={`w-full truncate text-center text-[10px] font-semibold transition-colors ${
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
