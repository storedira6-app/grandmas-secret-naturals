import { useState } from "react";
import { Sparkles, ShoppingBag, Flame, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { noonLinkFor } from "@/data/noon";
import { useCatalog, useCountry, useCurrency, recommendForIngredients } from "@/lib/store-client";
import { useBeautyProfile, profileKeywords } from "@/lib/store/beauty-profile";
import { CheckoutDialog, type CheckoutItem } from "./CheckoutDialog";
import { GlobalBrandSuggestions } from "./GlobalBrandMarket";

/**
 * Featured spotlight: Grandma's Recommendations personalized to the visitor's
 * skin/hair profile (from the skin quiz) plus current seasonal trends.
 */
export function GrandmaPicks() {
  const { t, lang } = useI18n();
  const { country, noon, egypt } = useCountry();
  const { data: catalog = [] } = useCatalog();
  const { display, displayLabel } = useCurrency();
  const profile = useBeautyProfile();
  const [checkout, setCheckout] = useState<CheckoutItem | null>(null);

  const keywords = profileKeywords(profile);
  const picks = recommendForIngredients(keywords, {
    catalog,
    noon,
    seed: `picks-${profile?.updatedAt ?? "guest"}`,
    limit: 4,
  });


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

      <GlobalBrandSuggestions keywords={keywords} seed={`picks-${profile?.skin ?? "guest"}`} />

      <div className="grid grid-cols-2 gap-3">
        {picks.map((pick, i) => {
          const trend = i < 2;
          if (pick.kind === "catalog") {
            const p = pick.product;
            const price = display(p.price, p.currency);
            return (
              <PickCard
                key={`c-${p.id}`}
                image={p.image_url}
                name={p.name}
                price={price}
                label={t("order")}
                trending={trend ? t("trending") : null}
                onClick={() => setCheckout({ id: p.id, name: p.name, amount: p.price, currency: p.currency })}
              />
            );
          }
          if (pick.kind === "noon") {
            const p = pick.product;
            return (
              <PickCard
                key={`n-${p.id}`}
                image={p.image}
                name={p.name[lang]}
                price={displayLabel(p.price)}
                label={t("buyNow")}
                trending={trend ? t("trending") : null}
                href={noonLinkFor(p, country)}
              />
            );
          }
          const p = pick.product;
          return (
            <PickCard
              key={`a-${p.id}`}
              image={p.image}
              name={p.name[lang]}
              price={displayLabel(p.price)}
              label={t("buy")}
              trending={trend ? t("trending") : null}
              href={p.url}
              external
            />
          );
        })}
      </div>

      {checkout && (
        <CheckoutDialog
          item={checkout}
          country={country}
          egypt={egypt}
          onClose={() => setCheckout(null)}
        />
      )}
    </section>
  );
}

function PickCard({
  image,
  name,
  price,
  label,
  trending,
  href,
  onClick,
  external,
}: {
  image: string | null;
  name: string;
  price: string;
  label: string;
  trending: string | null;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}) {
  const inner = (
    <>
      <div className="relative">
        {image && (
          <img src={image} alt={name} loading="lazy" className="h-28 w-full rounded-2xl object-cover" />
        )}
        {trending && (
          <span className="gradient-gold absolute start-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
            <Flame className="h-3 w-3" />
            {trending}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-tight font-semibold">{name}</p>
      <p className="text-sm font-bold text-primary">{price}</p>
      <span className="gradient-forest mt-2 flex items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-bold text-primary-foreground">
        {external ? <ExternalLink className="h-3 w-3" /> : <ShoppingBag className="h-3.5 w-3.5" />}
        {label}
      </span>
    </>
  );
  const cls = "glass-card block rounded-3xl p-2 text-start transition-transform active:scale-95";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored" className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
