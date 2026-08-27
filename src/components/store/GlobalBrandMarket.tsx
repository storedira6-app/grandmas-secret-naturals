import { Globe, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { GLOBAL_BRANDS, brandLogo, matchGlobalBrands, type GlobalBrand } from "@/data/global-brands";

function BrandLogo({ brand, className }: { brand: GlobalBrand; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="gradient-forest grid h-full w-full place-items-center text-[11px] font-bold text-primary-foreground">
        {brand.brand.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={brandLogo(brand)}
      alt={brand.brand}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}


/** Full "Global Beauty Market" partner grid shown on the store tab. */
export function GlobalBrandMarket() {
  const { t, lang } = useI18n();

  return (
    <section className="animate-rise space-y-3 rounded-3xl border border-primary/25 bg-primary/5 p-3">
      <header className="min-w-0">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-primary">
          <Globe className="h-4 w-4 shrink-0 text-gold" />
          <span className="truncate">{t("globalMarket")}</span>
        </h2>
        <p className="text-[11px] text-muted-foreground">{t("globalMarketSub")}</p>
      </header>

      <ul className="space-y-2.5">
        {GLOBAL_BRANDS.map((b, i) => (
          <li
            key={b.id}
            className="glass-card animate-rise flex items-center gap-3 rounded-2xl p-2.5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-background text-[11px] font-bold text-primary-foreground">
              <BrandLogo brand={b} className="h-12 w-12 object-contain p-1" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{b.brand}</p>
              <p className="line-clamp-2 text-[11px] leading-tight text-muted-foreground">
                {b.tagline[lang]}
              </p>
            </div>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="gradient-gold flex shrink-0 items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-bold text-gold-foreground transition-transform active:scale-95"
            >
              <ShoppingBag className="h-3 w-3" />
              {t("shopNow")}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Compact partner suggestions matched to recipe ingredients, skin concerns or
 * a beauty profile — rendered under Grandma's advice and the skin report.
 */
export function GlobalBrandSuggestions({
  keywords,
  seed,
  limit = 2,
}: {
  keywords: string[];
  seed?: string;
  limit?: number;
}) {
  const { t, lang } = useI18n();
  const brands = matchGlobalBrands(keywords, { limit, ...(seed ? { seed } : {}) });
  if (brands.length === 0) return null;

  return (
    <div className="space-y-2 rounded-2xl border border-primary/25 bg-primary/5 p-2.5">
      <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
        <Globe className="h-3.5 w-3.5 text-gold" />
        {t("globalSuggest")}
      </p>
      <ul className="space-y-2">
        {brands.map((b) => (
          <li key={b.id} className="flex items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-xl bg-background">
              <BrandLogo brand={b} className="h-8 w-8 object-contain p-0.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold">{b.brand}</p>
              <p className="truncate text-[10px] text-muted-foreground">{b.tagline[lang]}</p>
            </div>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="gradient-forest shrink-0 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground transition-transform active:scale-95"
            >
              {t("shopNow")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
