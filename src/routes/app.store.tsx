import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Megaphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PRODUCTS } from "@/data/content";

export const Route = createFileRoute("/app/store")({
  head: () => ({
    meta: [
      { title: "Natural store | سر الجدة — المتجر" },
      {
        name: "description",
        content: "Shop handpicked natural products: argan oil, Atlas green clay, black soap and herbal kits.",
      },
      { property: "og:title", content: "Natural store | سر الجدة" },
      { property: "og:description", content: "Premium natural beauty products picked with love." },
    ],
  }),
  component: StoreTab,
});

function StoreTab() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-5">
      <a
        href="https://ko-fi.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="gradient-warm animate-rise flex items-center gap-3 rounded-3xl border border-gold/40 p-3"
      >
        <span className="gradient-gold grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-gold-foreground">
          <Megaphone className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {t("sponsor")}
          </span>
          <span className="block truncate text-sm font-semibold">{t("sponsorText")}</span>
        </span>
      </a>

      <div>
        <h2 className="text-xl font-bold">{t("storeTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("storeSub")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PRODUCTS.map((p, i) => (
          <article
            key={p.id}
            className="glass-card animate-rise flex flex-col overflow-hidden rounded-3xl"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative">
              <img
                src={p.image}
                alt={p.name[lang]}
                loading="lazy"
                width={1024}
                height={768}
                className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {p.badge && (
                <span className="gradient-gold absolute start-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                  {t(p.badge)}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <h3 className="text-sm leading-tight font-semibold">{p.name[lang]}</h3>
              <p className="text-[11px] leading-tight text-muted-foreground">{p.desc[lang]}</p>
              <p className="mt-auto pt-1 text-base font-bold text-primary">{p.price}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-forest flex items-center justify-center gap-1.5 rounded-2xl py-2 text-[11px] font-bold text-primary-foreground transition-transform active:scale-95"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {t("buy")}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
