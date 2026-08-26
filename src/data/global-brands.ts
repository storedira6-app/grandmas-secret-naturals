import type { Lang } from "@/lib/i18n";

/**
 * "Global Beauty Market" — curated international clean-beauty partners.
 * Each brand carries matching tags so Grandma Noura's recipes, the home
 * recommendations and the skin report can link straight to the right partner.
 */
export type GlobalBrand = {
  id: string;
  brand: string;
  domain: string;
  url: string;
  tagline: Record<Lang, string>;
  /** Lowercase keywords (en + ar + fr/es roots) used to match recipes & concerns. */
  tags: string[];
};

export const GLOBAL_BRANDS: GlobalBrand[] = [
  {
    id: "inika",
    brand: "INIKA Organic",
    domain: "inikaorganic.com",
    url: "https://yazing.com/deals/inikaorganic/alamrani_khalil",
    tagline: {
      ar: "مكياج ومستحضرات عضوية معتمدة، لطيفة على البشرة الحساسة.",
      en: "Certified organic makeup & skincare, gentle on sensitive skin.",
      fr: "Maquillage et soins bio certifiés, doux pour les peaux sensibles.",
      es: "Maquillaje y cuidado orgánico certificado, apto para piel sensible.",
    },
    tags: [
      "makeup",
      "foundation",
      "mascara",
      "lips",
      "organic",
      "sensitive",
      "redness",
      "mineral",
      "spf",
      "sun",
      "sunscreen",
      "مكياج",
      "حساسة",
      "احمرار",
      "عضوي",
      "شمس",
      "واقي",
    ],
  },
  {
    id: "purehundred",
    brand: "100% PURE",
    domain: "100percentpure.com",
    url: "https://yazing.com/deals/100percentpure/alamrani_khalil",
    tagline: {
      ar: "تركيبات نباتية بالفواكه: سيرومات، مرطبات وماسكات للنضارة والتصبغات.",
      en: "Fruit-pigmented serums, moisturizers & masks for glow and dark spots.",
      fr: "Sérums, hydratants et masques aux fruits pour l'éclat et les taches.",
      es: "Sérums, hidratantes y mascarillas de frutas para brillo y manchas.",
    },
    tags: [
      "serum",
      "vitamin c",
      "moisturizer",
      "mask",
      "glow",
      "brightening",
      "dark spots",
      "pigmentation",
      "hydration",
      "aloe",
      "rose",
      "honey",
      "turmeric",
      "lemon",
      "سيروم",
      "مرطب",
      "ماسك",
      "نضارة",
      "بقع",
      "تصبغات",
      "ترطيب",
      "عسل",
      "كركم",
      "ليمون",
      "ورد",
    ],
  },
  {
    id: "alamea",
    brand: "ALAMEA Palm Beach",
    domain: "alameapalmbeach.com",
    url: "https://yazing.com/deals/alameapalmbeach/alamrani_khalil",
    tagline: {
      ar: "عناية فاخرة بالبشرة: مكافحة التجاعيد والخطوط الدقيقة وشد البشرة.",
      en: "Luxury anti-aging care for wrinkles, fine lines and firmness.",
      fr: "Soins anti-âge de luxe : rides, ridules et fermeté.",
      es: "Cuidado antiedad de lujo: arrugas, líneas finas y firmeza.",
    },
    tags: [
      "anti-aging",
      "wrinkles",
      "fine lines",
      "firmness",
      "collagen",
      "retinol",
      "peptide",
      "eye cream",
      "night cream",
      "argan",
      "olive oil",
      "تجاعيد",
      "خطوط",
      "شد",
      "كولاجين",
      "ليلي",
      "أرغان",
      "زيت الزيتون",
      "حول العين",
    ],
  },
  {
    id: "aniise",
    brand: "Aniise",
    domain: "aniise.com",
    url: "https://yazing.com/deals/aniise/alamrani_khalil",
    tagline: {
      ar: "عناية بالشعر وفروة الرأس بزيوت طبيعية وبروتين حرير.",
      en: "Hair & scalp care with natural oils and silk protein.",
      fr: "Soins cheveux et cuir chevelu aux huiles naturelles.",
      es: "Cuidado del cabello y cuero cabelludo con aceites naturales.",
    },
    tags: [
      "hair",
      "scalp",
      "shampoo",
      "conditioner",
      "hair oil",
      "dandruff",
      "coconut",
      "castor",
      "rosemary",
      "keratin",
      "شعر",
      "فروة",
      "شامبو",
      "زيت",
      "قشرة",
      "جوز الهند",
      "خروع",
      "روزماري",
      "إكليل الجبل",
    ],
  },
  {
    id: "athletic",
    brand: "Athletic Cosmetic Company",
    domain: "athleticcosmetic.com",
    url: "https://yazing.com/deals/athleticcosmetic/alamrani_khalil",
    tagline: {
      ar: "عناية للبشرة النشطة: تنقية المسام، الحبوب، والحماية اليومية.",
      en: "Active-skin care: pore purifying, blemishes and daily protection.",
      fr: "Soins peau active : pores, imperfections et protection quotidienne.",
      es: "Cuidado para piel activa: poros, imperfecciones y protección diaria.",
    },
    tags: [
      "pores",
      "acne",
      "blemish",
      "oily",
      "sweat",
      "clay",
      "charcoal",
      "clay mask",
      "cleanser",
      "spf",
      "sunscreen",
      "body",
      "feet",
      "hands",
      "مسام",
      "حبوب",
      "دهنية",
      "طين",
      "فحم",
      "غسول",
      "جسم",
      "قدم",
      "يد",
      "عرق",
    ],
  },
];

export function brandLogo(brand: GlobalBrand) {
  return `https://logo.clearbit.com/${brand.domain}`;
}

function norm(values: string[]) {
  return values.join(" ").toLowerCase();
}

/**
 * Match global partners to a set of ingredients / concerns / keywords.
 * Always returns at least `min` brands so every recommendation has a shop link.
 */
export function matchGlobalBrands(
  keywords: string[],
  opts: { limit?: number; seed?: string } = {},
): GlobalBrand[] {
  const limit = opts.limit ?? 2;
  const haystack = norm(keywords);

  const scored = GLOBAL_BRANDS.map((brand) => ({
    brand,
    score: brand.tags.reduce((acc, tag) => (haystack.includes(tag) ? acc + 1 : acc), 0),
  }));

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.brand);

  if (matched.length >= limit) return matched.slice(0, limit);

  // Deterministic fallback so guests still see partners (rotated by seed).
  const seed = (opts.seed ?? haystack).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rest = GLOBAL_BRANDS.filter((b) => !matched.includes(b));
  const fill: GlobalBrand[] = [];
  for (let i = 0; fill.length < limit - matched.length && i < rest.length; i += 1) {
    fill.push(rest[(seed + i) % rest.length]!);
  }
  return [...matched, ...fill.filter((b, i, arr) => arr.indexOf(b) === i)].slice(0, limit);
}
