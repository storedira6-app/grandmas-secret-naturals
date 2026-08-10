/** Shared shape every supplier connector normalizes into. */
export type SupplierProduct = {
  source: "code" | "zid";
  external_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  currency: string;
  base_cost: number;
  category: string | null;
  tags: string[];
  url: string | null;
  in_stock: boolean;
};

/** Ingredient keywords used to match products with recipes. */
const KEYWORDS = [
  "argan",
  "أرغان",
  "honey",
  "عسل",
  "rose",
  "ورد",
  "clay",
  "طين",
  "aloe",
  "صبار",
  "oil",
  "زيت",
  "shea",
  "شيا",
  "coconut",
  "جوز الهند",
  "mint",
  "نعناع",
  "olive",
  "زيتون",
  "almond",
  "لوز",
  "hair",
  "شعر",
  "skin",
  "بشرة",
  "face",
  "وجه",
  "soap",
  "صابون",
  "serum",
  "سيروم",
  "cream",
  "كريم",
  "mask",
  "قناع",
  "sun",
  "شمس",
];

/** Derives searchable ingredient/benefit tags from free-form supplier text. */
export function deriveTags(...parts: (string | null | undefined)[]): string[] {
  const haystack = parts.filter(Boolean).join(" ").toLowerCase();
  const tags = KEYWORDS.filter((k) => haystack.includes(k.toLowerCase()));
  return Array.from(new Set(tags));
}

export function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const n = Number.parseFloat(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function pickString(...values: unknown[]): string | null {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (v && typeof v === "object") {
      const rec = v as Record<string, unknown>;
      for (const key of ["ar", "en", "label", "name", "value", "url", "full_size", "original"]) {
        const nested = rec[key];
        if (typeof nested === "string" && nested.trim()) return nested.trim();
      }
    }
  }
  return null;
}

/** Beauty / personal-care filter — the app only sells natural beauty & care. */
export function isBeautyProduct(p: SupplierProduct): boolean {
  const haystack = `${p.name} ${p.description ?? ""} ${p.category ?? ""}`.toLowerCase();
  const beauty = [
    "beauty",
    "care",
    "skin",
    "hair",
    "face",
    "body",
    "oil",
    "cream",
    "serum",
    "soap",
    "mask",
    "shampoo",
    "perfume",
    "جمال",
    "عناية",
    "بشرة",
    "شعر",
    "وجه",
    "جسم",
    "زيت",
    "كريم",
    "سيروم",
    "صابون",
    "قناع",
    "شامبو",
    "عطر",
  ];
  return beauty.some((k) => haystack.includes(k));
}
