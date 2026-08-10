import { useQuery } from "@tanstack/react-query";
import { detectCountry, listStoreProducts, type StoreProduct } from "@/lib/store.functions";
import { getFxRates } from "@/lib/fx.functions";
import { NOON_PRODUCTS, type NoonProduct } from "@/data/noon";
import { AFFILIATE_PRODUCTS, type AffiliateProduct } from "@/data/affiliate";
import { regionModeFor, showsNoon, showsEgyptCoupon, showsDropship } from "@/lib/store/region";
import {
  FALLBACK_RATES,
  convertAmount,
  currencyForCountry,
  formatMoney,
} from "@/lib/store/currency";

export function useCountry() {
  const { data } = useQuery({
    queryKey: ["visitor-country"],
    queryFn: () => detectCountry(),
    staleTime: 1000 * 60 * 60,
  });
  const country = data?.country ?? null;
  const mode = regionModeFor(country);
  return {
    country,
    mode,
    noon: showsNoon(country),
    egypt: showsEgyptCoupon(mode),
    dropship: showsDropship(mode),
  };
}

export function useCatalog() {
  return useQuery({
    queryKey: ["store-catalog"],
    queryFn: () => listStoreProducts(),
    staleTime: 1000 * 60 * 10,
  });
}

function norm(s: string) {
  return s.toLowerCase();
}

/** Scores a product against a recipe's natural ingredients. */
function scoreFor(haystack: string, ingredients: string[]) {
  const hay = norm(haystack);
  let score = 0;
  for (const ing of ingredients) {
    const word = norm(ing).trim();
    if (word.length > 2 && hay.includes(word)) score += 2;
  }
  return score;
}

export type Recommendation =
  | { kind: "catalog"; product: StoreProduct }
  | { kind: "noon"; product: NoonProduct }
  | { kind: "affiliate"; product: AffiliateProduct };

/**
 * Smart recommendation engine: matches products to the recipe's ingredients,
 * falling back to a stable pseudo-random pick when nothing matches.
 */
export function recommendForIngredients(
  ingredients: string[],
  opts: { catalog: StoreProduct[]; noon: boolean; seed?: string | undefined; limit?: number },
): Recommendation[] {
  const limit = opts.limit ?? 2;
  const scored: { score: number; rec: Recommendation }[] = [];

  for (const product of opts.catalog) {
    const hay = [product.name, product.description ?? "", ...(product.tags ?? [])].join(" ");
    scored.push({ score: scoreFor(hay, ingredients), rec: { kind: "catalog", product } });
  }
  if (opts.noon) {
    for (const product of NOON_PRODUCTS) {
      const hay = [...Object.values(product.name), ...product.tags].join(" ");
      scored.push({ score: scoreFor(hay, ingredients), rec: { kind: "noon", product } });
    }
  }
  for (const product of AFFILIATE_PRODUCTS) {
    const hay = Object.values(product.name).join(" ");
    scored.push({ score: scoreFor(hay, ingredients), rec: { kind: "affiliate", product } });
  }

  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  if (matched.length >= limit) return matched.slice(0, limit).map((m) => m.rec);

  // Deterministic fallback so the card doesn't reshuffle on every render.
  const seedNum = [...(opts.seed ?? "grandma")].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rest = scored.filter((s) => s.score === 0).map((s) => s.rec);
  const picks = [...matched.map((m) => m.rec)];
  for (let i = 0; picks.length < limit && i < rest.length; i += 1) {
    const item = rest[(seedNum + i * 7) % rest.length];
    if (item && !picks.includes(item)) picks.push(item);
  }
  return picks.slice(0, limit);
}
