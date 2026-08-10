import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShoppingBag, Megaphone, Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { PRODUCTS } from "@/data/content";
import { NOON_PRODUCTS, noonLinkFor } from "@/data/noon";
import { EGYPT_COUPON_CODE } from "@/lib/store/pricing";
import { useCatalog, useCountry, useCurrency } from "@/lib/store-client";
import { CheckoutDialog, type CheckoutItem } from "@/components/store/CheckoutDialog";

export const Route = createFileRoute("/app/store")({
  head: () => ({
    meta: [
      { title: "Natural store | سر الجدة — المتجر" },
      {
        name: "description",
        content:
          "Shop handpicked natural beauty products with fast delivery across the Gulf, Morocco and Egypt.",
      },
      { property: "og:title", content: "Natural store | سر الجدة" },
      {
        property: "og:description",
        content: "Premium natural beauty products picked with love, delivered to your country.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoreTab,
});

type Filter = "all" | "ours" | "noon" | "picks";

function StoreTab() {
  const { t, lang } = useI18n();
  const { country, noon, egypt } = useCountry();
  const { data: catalog = [], isLoading } = useCatalog();
  const { display } = useCurrency();
  const [filter, setFilter] = useState<Filter>("all");
  const [checkout, setCheckout] = useState<CheckoutItem | null>(null);

  const filters = useMemo(() => {
    const list: { key: Filter; label: string }[] = [
      { key: "all", label: t("storeAll") },
      { key: "ours", label: t("storeDropship") },
    ];
    if (noon) list.push({ key: "noon", label: t("storeNoon") });
    list.push({ key: "picks", label: t("storeAffiliate") });
    return list;
  }, [noon, t]);

  const showOurs = filter === "all" || filter === "ours";
  const showNoon = noon && (filter === "all" || filter === "noon");
  const showPicks = filter === "all" || filter === "picks";

  return (
    <div className="space-y-5">
      <header className="animate-rise">
        <h1 className="text-xl font-bold">{t("storeHero")}</h1>
        <p className="text-xs text-muted-foreground">{t("storeHeroSub")}</p>
      </header>

      {egypt && (
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(EGYPT_COUPON_CODE);
            toast.success(t("codeCopied"));
          }}
          className="gradient-warm animate-rise flex w-full items-center gap-3 rounded-3xl border border-gold/40 p-3 text-start"
        >
          <span className="gradient-gold grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-gold-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">{t("egyptCoupon")}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {t("egyptCouponSub")}
            </span>
          </span>
          <span className="glass-card flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-primary">
            <Copy className="h-3 w-3" />
            {EGYPT_COUPON_CODE}
          </span>
        </button>
      )}

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

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
              filter === f.key
                ? "gradient-forest text-primary-foreground"
                : "glass-card text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {showOurs && (
        <section className="space-y-3">
          <h2 className="text-base font-bold">{t("storeDropship")}</h2>
          {isLoading ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("storeLoading")}
            </p>
          ) : catalog.length === 0 ? (
            <p className="glass-card rounded-2xl p-4 text-xs text-muted-foreground">
              {t("storeEmpty")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {catalog.map((p, i) => {
                const price = display(p.price, p.currency);
                return (
                  <article
                    key={p.id}
                    className="glass-card animate-rise flex flex-col overflow-hidden rounded-3xl"
                    style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                  >
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        loading="lazy"
                        className="h-32 w-full object-cover"
                      />
                    )}
                    <div className="flex flex-1 flex-col gap-1.5 p-3">
                      <h3 className="line-clamp-2 text-sm leading-tight font-semibold">{p.name}</h3>
                      {p.description && (
                        <p className="line-clamp-2 text-[11px] leading-tight text-muted-foreground">
                          {p.description}
                        </p>
                      )}
                      <p className="mt-auto pt-1 text-base font-bold text-primary">{price}</p>
                      <button
                        type="button"
                        disabled={!p.in_stock}
                        onClick={() => setCheckout({ id: p.id, name: p.name, price })}
                        className="gradient-forest flex items-center justify-center gap-1.5 rounded-2xl py-2 text-[11px] font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {p.in_stock ? t("order") : t("outOfStock")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {showNoon && (
        <section className="space-y-3">
          <h2 className="text-base font-bold">{t("storeNoon")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {NOON_PRODUCTS.map((p, i) => (
              <article
                key={p.id}
                className="glass-card animate-rise flex flex-col overflow-hidden rounded-3xl"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <img
                  src={p.image}
                  alt={p.name[lang]}
                  loading="lazy"
                  className="h-32 w-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <h3 className="text-sm leading-tight font-semibold">{p.name[lang]}</h3>
                  <p className="text-[11px] leading-tight text-muted-foreground">{p.note[lang]}</p>
                  <p className="mt-auto pt-1 text-base font-bold text-primary">{p.price}</p>
                  <a
                    href={noonLinkFor(p, country)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-gold flex items-center justify-center gap-1.5 rounded-2xl py-2 text-[11px] font-bold text-gold-foreground transition-transform active:scale-95"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {t("buyNow")}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {showPicks && (
        <section className="space-y-3">
          <h2 className="text-base font-bold">{t("storeAffiliate")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map((p, i) => (
              <article
                key={p.id}
                className="glass-card animate-rise flex flex-col overflow-hidden rounded-3xl"
                style={{ animationDelay: `${i * 60}ms` }}
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
        </section>
      )}

      {checkout && (
        <CheckoutDialog
          item={checkout}
          country={country}
          egypt={egypt}
          onClose={() => setCheckout(null)}
        />
      )}
    </div>
  );
}
