import type { Lang } from "@/lib/i18n";

/**
 * "Global Beauty Market" — curated affiliate partners.
 * Each brand carries matching tags so Grandma Noura's recipes, the home
 * recommendations and the skin report can link straight to the right partner.
 */
export type GlobalBrand = {
  id: string;
  brand: string;
  domain: string;
  url: string;
  /** Country-specific affiliate links (ISO-2 code -> url), used when available. */
  regionalUrls?: Record<string, string>;
  /** When set, the brand is only shown to visitors from these countries. */
  countries?: string[];
  tagline: Record<Lang, string>;
  /** Lowercase keywords (en + ar roots) used to match recipes & concerns. */
  tags: string[];
};

const HAIR = ["hair", "scalp", "shampoo", "oil", "شعر", "فروة", "شامبو", "زيت"];
const SKIN = ["skin", "face", "cream", "moisturizer", "بشرة", "وجه", "كريم", "مرطب"];

export const GLOBAL_BRANDS: GlobalBrand[] = [
  {
    id: "nazih-ksa",
    brand: "NAZIH KSA",
    domain: "nazih.sa",
    url: "https://www.linkaraby.com/scripts/2xch8l8dq0?a_aid=hlxaz1bw4xpxe&a_bid=2ee85612",
    countries: ["SA"],
    tagline: {
      ar: "نزيه السعودية: عناية احترافية بالشعر والبشرة والأظافر.",
      en: "Nazih KSA: professional hair, skin and nail care.",
      fr: "Nazih Arabie : soins pro cheveux, peau et ongles.",
      es: "Nazih KSA: cuidado profesional de cabello, piel y uñas.",
    },
    tags: [...HAIR, ...SKIN, "keratin", "nails", "salon", "أظافر", "كيراتين", "صالون"],
  },
  {
    id: "nazih-uae",
    brand: "NAZIH UAE",
    domain: "nazih.ae",
    url: "https://www.linkaraby.com/scripts/2xch8l8dq0?a_aid=hlxaz1bw4xpxe&a_bid=f4dde4b6",
    countries: ["AE"],
    tagline: {
      ar: "نزيه الإمارات: عناية احترافية بالشعر والبشرة والأظافر.",
      en: "Nazih UAE: professional hair, skin and nail care.",
      fr: "Nazih Émirats : soins pro cheveux, peau et ongles.",
      es: "Nazih EAU: cuidado profesional de cabello, piel y uñas.",
    },
    tags: [...HAIR, ...SKIN, "keratin", "nails", "salon", "أظافر", "كيراتين", "صالون"],
  },
  {
    id: "kaya",
    brand: "Kaya",
    domain: "kayacosmo.com",
    url: "https://kayacosmo.com/?a_aid=hlxaz1bw4xpxe&a_bid=df2b5023",
    tagline: {
      ar: "كايا: مستحضرات عناية بالبشرة وعلاجات التصبغات والنضارة.",
      en: "Kaya: skincare treatments for pigmentation and glow.",
      fr: "Kaya : soins ciblés taches et éclat.",
      es: "Kaya: tratamientos para manchas y luminosidad.",
    },
    tags: [
      ...SKIN,
      "serum",
      "glow",
      "brightening",
      "dark spots",
      "pigmentation",
      "acne",
      "سيروم",
      "نضارة",
      "بقع",
      "تصبغات",
      "حبوب",
    ],
  },
  {
    id: "rawaj",
    brand: "Rawaj Care",
    domain: "rawajcare.com",
    url: "https://rawajcare.com/?utm_source=linkaraby&utm_medium=referral&a_aid=hlxaz1bw4xpxe&a_bid=59a32666",
    tagline: {
      ar: "رواج: منتجات عناية يومية بالشعر والجسم بمكوّنات طبيعية.",
      en: "Rawaj Care: daily natural hair and body care.",
      fr: "Rawaj Care : soins quotidiens naturels cheveux et corps.",
      es: "Rawaj Care: cuidado diario natural de cabello y cuerpo.",
    },
    tags: [...HAIR, "body", "lotion", "dandruff", "جسم", "لوشن", "قشرة", "تساقط"],
  },
  {
    id: "imooie",
    brand: "IMOOIE",
    domain: "imooie.me",
    url: "https://imooie.me/?utm_source=linkaraby&utm_medium=referral&a_aid=hlxaz1bw4xpxe&a_bid=cb23565a",
    tagline: {
      ar: "آي مووي: عناية بالبشرة ومنتجات جمال عصرية.",
      en: "IMOOIE: modern skincare and beauty essentials.",
      fr: "IMOOIE : soins et essentiels beauté modernes.",
      es: "IMOOIE: cuidado facial y esenciales de belleza.",
    },
    tags: [...SKIN, "mask", "serum", "glow", "ماسك", "سيروم", "نضارة"],
  },
  {
    id: "taswahum",
    brand: "Taswahum",
    domain: "taswahum.com",
    url: "https://taswahum.com/?utm_source=linkaraby&utm_medium=referral&a_aid=hlxaz1bw4xpxe&a_bid=6b57966f",
    tagline: {
      ar: "تسواهم: تشكيلة عطور ومنتجات عناية وجمال.",
      en: "Taswahum: fragrance, care and beauty picks.",
      fr: "Taswahum : parfums et produits beauté.",
      es: "Taswahum: perfumes y productos de belleza.",
    },
    tags: ["perfume", "fragrance", "body", "gift", "عطر", "عطور", "جسم", "هدية"],
  },
  {
    id: "victoria-ksa",
    brand: "Victoria's Secret KSA",
    domain: "victoriassecret.com",
    url: "https://www.linkaraby.com/scripts/2xch8l8dq0?a_aid=hlxaz1bw4xpxe&a_bid=f05df119",
    countries: ["SA"],
    tagline: {
      ar: "فيكتوريا سيكرت السعودية: عطور ومرطبات الجسم الفاخرة.",
      en: "Victoria's Secret KSA: luxury mists and body care.",
      fr: "Victoria's Secret Arabie : brumes et soins corps.",
      es: "Victoria's Secret KSA: brumas y cuidado corporal.",
    },
    tags: ["perfume", "mist", "body", "lotion", "عطر", "جسم", "لوشن", "مرطب"],
  },
  {
    id: "victoria-uae",
    brand: "Victoria's Secret UAE",
    domain: "victoriassecret.com",
    url: "https://www.linkaraby.com/scripts/2xch8l8dq0?a_aid=hlxaz1bw4xpxe&a_bid=57ddce8a",
    countries: ["AE"],
    tagline: {
      ar: "فيكتوريا سيكرت الإمارات: عطور ومرطبات الجسم الفاخرة.",
      en: "Victoria's Secret UAE: luxury mists and body care.",
      fr: "Victoria's Secret Émirats : brumes et soins corps.",
      es: "Victoria's Secret EAU: brumas y cuidado corporal.",
    },
    tags: ["perfume", "mist", "body", "lotion", "عطر", "جسم", "لوشن", "مرطب"],
  },
  {
    id: "majestya",
    brand: "Majestya",
    domain: "majestya.com",
    url: "https://majestya.com/?a_aid=hlxaz1bw4xpxe&a_bid=2834779f",
    tagline: {
      ar: "مجستيا: عناية فاخرة بالبشرة ومكافحة علامات التقدم بالسن.",
      en: "Majestya: luxury skincare and anti-aging care.",
      fr: "Majestya : soins de luxe et anti-âge.",
      es: "Majestya: cuidado de lujo y antiedad.",
    },
    tags: [
      ...SKIN,
      "anti-aging",
      "wrinkles",
      "collagen",
      "night cream",
      "eye cream",
      "تجاعيد",
      "شد",
      "كولاجين",
      "ليلي",
      "حول العين",
    ],
  },
  {
    id: "arganour",
    brand: "Arganour KSA",
    domain: "arganour.sa",
    url: "https://arganour.sa/?a_aid=hlxaz1bw4xpxe&a_bid=d82ac4b6",
    tagline: {
      ar: "أرقانور: زيوت أرغان وعناية طبيعية بالشعر والبشرة.",
      en: "Arganour: argan oils and natural hair & skin care.",
      fr: "Arganour : huiles d'argan et soins naturels.",
      es: "Arganour: aceites de argán y cuidado natural.",
    },
    tags: [...HAIR, "argan", "oils", "dry", "أرغان", "زيوت", "جافة"],
  },
  {
    id: "zeinah",
    brand: "Zeinah",
    domain: "zeinah.com.sa",
    url: "https://zeinah.com.sa/?utm_source=linkaraby&utm_medium=referral&a_aid=hlxaz1bw4xpxe&a_bid=930fca6c",
    tagline: {
      ar: "زيناه: منتجات عناية وجمال مختارة للمرأة العربية.",
      en: "Zeinah: curated beauty and care products.",
      fr: "Zeinah : produits beauté et soins sélectionnés.",
      es: "Zeinah: productos de belleza y cuidado seleccionados.",
    },
    tags: [...SKIN, "makeup", "body", "مكياج", "جسم", "عناية"],
  },
  {
    id: "noon",
    brand: "noon",
    domain: "noon.com",
    url: "https://s.noon.com/eDaCUkk_imw",
    regionalUrls: {
      SA: "https://s.noon.com/eDaCUkk_imw",
      AE: "https://s.noon.com/nEEr_zjDqhI",
      EG: "https://s.noon.com/0FfZKHCgGxs",
      OM: "https://s.noon.com/AyECdPnWQqw",
      BH: "https://s.noon.com/NSyHjcQWFd4",
    },
    countries: ["SA", "AE", "EG", "OM", "BH"],
    tagline: {
      ar: "نون: كل مستلزمات الجمال والعناية بتوصيل سريع.",
      en: "noon: all your beauty essentials with fast delivery.",
      fr: "noon : tous vos essentiels beauté livrés vite.",
      es: "noon: esenciales de belleza con envío rápido.",
    },
    tags: [
      ...HAIR,
      ...SKIN,
      "oil",
      "mask",
      "clay",
      "rose",
      "honey",
      "vitamin",
      "زيت",
      "ماسك",
      "طين",
      "ورد",
      "عسل",
      "فيتامين",
    ],
  },
  {
    id: "iherb",
    brand: "iHerb",
    domain: "iherb.com",
    url: "https://www.linkaraby.com/scripts/2xch8l8dq0?a_aid=hlxaz1bw4xpxe&a_bid=9eed17f1",
    tagline: {
      ar: "أعشاب، زيوت طبيعية، فيتامينات ومكمّلات الجمال بأسعار ممتازة.",
      en: "Herbs, natural oils, vitamins and beauty supplements at great prices.",
      fr: "Herbes, huiles naturelles, vitamines et compléments beauté.",
      es: "Hierbas, aceites naturales, vitaminas y suplementos de belleza.",
    },
    tags: [
      "oil",
      "oils",
      "herbs",
      "vitamin",
      "supplement",
      "collagen",
      "biotin",
      "zinc",
      "omega",
      "castor",
      "jojoba",
      "argan",
      "coconut",
      "almond",
      "honey",
      "clay",
      "aloe",
      "hair",
      "nails",
      "زيت",
      "زيوت",
      "أعشاب",
      "فيتامين",
      "مكمل",
      "كولاجين",
      "بيوتين",
      "خروع",
      "جوجوبا",
      "أرغان",
      "لوز",
      "عسل",
      "طين",
      "صبار",
      "شعر",
      "أظافر",
    ],
  },
  {
    id: "reemncream",
    brand: "Reem and Cream",
    domain: "reemncream.com",
    url: "https://reemncream.com/?utm_source=linkaraby&utm_medium=offers",
    tagline: {
      ar: "عناية ومكياج فاخر بمكوّنات مغذية، مناسب للبشرة العربية.",
      en: "Luxury nourishing skincare & makeup, made for Arab skin.",
      fr: "Soins et maquillage nourrissants de luxe pour peaux arabes.",
      es: "Cuidado y maquillaje nutritivo de lujo para piel árabe.",
    },
    tags: [
      "cream",
      "moisturizer",
      "body butter",
      "shea",
      "lips",
      "makeup",
      "glow",
      "dry",
      "hydration",
      "kohl",
      "كريم",
      "مرطب",
      "زبدة",
      "شيا",
      "شفاه",
      "مكياج",
      "جافة",
      "ترطيب",
      "نضارة",
    ],
  },
];

/** Ordered logo sources — the UI falls through to the next one on error. */
export function brandLogoSources(brand: GlobalBrand) {
  return [
    `https://logo.clearbit.com/${brand.domain}`,
    `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${brand.domain}.ico`,
  ];
}

/** Affiliate link for the visitor's country (falls back to the default url). */
export function brandUrlFor(brand: GlobalBrand, country?: string | null) {
  const code = (country ?? "").toUpperCase();
  return brand.regionalUrls?.[code] ?? brand.url;
}

/** Brands visible to the visitor — country-locked partners stay hidden elsewhere. */
export function brandsForCountry(country?: string | null) {
  const code = (country ?? "").toUpperCase();
  return GLOBAL_BRANDS.filter((b) => {
    if (!b.countries) return true;
    if (!code) return b.countries.includes("SA");
    return b.countries.includes(code);
  });
}

function norm(values: string[]) {
  return values.join(" ").toLowerCase();
}

/**
 * Match global partners to a set of ingredients / concerns / keywords.
 * Always returns at least `limit` brands so every recommendation has a shop link.
 */
export function matchGlobalBrands(
  keywords: string[],
  opts: { limit?: number; seed?: string; country?: string | null } = {},
): GlobalBrand[] {
  const limit = opts.limit ?? 2;
  const haystack = norm(keywords);
  const pool = brandsForCountry(opts.country);

  const scored = pool.map((brand) => ({
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
  const rest = pool.filter((b) => !matched.includes(b));
  const fill: GlobalBrand[] = [];
  for (let i = 0; fill.length < limit - matched.length && i < rest.length; i += 1) {
    fill.push(rest[(seed + i) % rest.length]!);
  }
  return [...matched, ...fill.filter((b, i, arr) => arr.indexOf(b) === i)].slice(0, limit);
}
