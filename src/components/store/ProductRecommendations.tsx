import { useState } from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/store/pricing";
import { noonLinkFor } from "@/data/noon";
import { useCatalog, useCountry, recommendForIngredients } from "@/lib/store-client";
import { CheckoutDialog, type CheckoutItem } from "./CheckoutDialog";

/** Smart in-recipe product recommendations matched to the recipe ingredients. */
export function ProductRecommendations({
  ingredients,
  seed,
}: {
  ingredients: string[];
  seed?: string;
}) {
  const { t, lang } = useI18n();
  const { country, noon, egypt } = useCountry();
  const { data: catalog = [] } = useCatalog();
  const [checkout, setCheckout] = useState<CheckoutItem | null>(null);

  const picks = recommendForIngredients(ingredients, { catalog, noon, seed, limit: 2 });
  if (picks.length === 0) return null;

  return (
    <section className="space-y-2 rounded-2xl border border-gold/30 bg-gold/5 p-3">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          {t("recommendedForRecipe")}
        </p>
        <p className="text-[11px] text-muted-foreground">{t("recommendedSub")}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {picks.map((pick) => {
          if (pick.kind === "catalog") {
            const p = pick.product;
            const price = formatPrice(p.price, p.currency);
            return (
              <MiniCard
                key={`c-${p.id}`}
                image={p.image_url}
                name={p.name}
                price={price}
                label={t("order")}
                onClick={() => setCheckout({ id: p.id, name: p.name, price })}
              />
            );
          }
          if (pick.kind === "noon") {
            const p = pick.product;
            return (
              <MiniCard
                key={`n-${p.id}`}
                image={p.image}
                name={p.name[lang]}
                price={p.price}
                label={t("buyNow")}
                href={noonLinkFor(p, country)}
              />
            );
          }
          const p = pick.product;
          return (
            <MiniCard
              key={`a-${p.id}`}
              image={p.image}
              name={p.name[lang]}
              price={p.price}
              label={t("buy")}
              href={p.url}
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

function MiniCard({
  image,
  name,
  price,
  label,
  href,
  onClick,
}: {
  image: string | null;
  name: string;
  price: string;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      {image && (
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-20 w-full rounded-xl object-cover"
        />
      )}
      <p className="mt-1.5 line-clamp-2 text-[11px] leading-tight font-semibold">{name}</p>
      <p className="text-[11px] font-bold text-primary">{price}</p>
      <span className="gradient-forest mt-1.5 flex items-center justify-center gap-1 rounded-xl py-1.5 text-[10px] font-bold text-primary-foreground">
        <ShoppingBag className="h-3 w-3" />
        {label}
      </span>
    </>
  );

  const cls = "glass-card block rounded-2xl p-2 text-start transition-transform active:scale-95";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
