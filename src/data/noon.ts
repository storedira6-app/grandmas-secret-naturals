import type { Lang } from "@/lib/i18n";

export type NoonProduct = {
  id: string;
  name: Record<Lang, string>;
  note: Record<Lang, string>;
  price: string;
  image: string;
  /** Country-specific affiliate links (KSA / UAE). */
  links: { SA: string; AE: string };
  tags: string[];
};

/** Noon affiliate picks, shown only to Saudi Arabia & UAE users. */
export const NOON_PRODUCTS: NoonProduct[] = [
  {
    id: "noon-argan-set",
    name: {
      ar: "طقم زيت الأرغان المغربي",
      en: "Moroccan Argan Oil Set",
      fr: "Coffret huile d'argan marocaine",
      es: "Set de aceite de argán marroquí",
    },
    note: {
      ar: "زيت نقي للشعر والبشرة، توصيل سريع من نون.",
      en: "Pure oil for hair and skin, fast Noon delivery.",
      fr: "Huile pure cheveux et peau, livraison rapide.",
      es: "Aceite puro para cabello y piel, envío rápido.",
    },
    price: "SAR 89",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=70",
    links: { SA: "https://s.noon.com/eDaCUkk_imw", AE: "https://s.noon.com/eDaCUkk_imw" },
    tags: ["argan", "أرغان", "oil", "زيت", "hair", "شعر"],
  },
  {
    id: "noon-rose-water",
    name: {
      ar: "ماء الورد الطبيعي",
      en: "Natural Rose Water",
      fr: "Eau de rose naturelle",
      es: "Agua de rosas natural",
    },
    note: {
      ar: "منعش ومهدئ للبشرة، مثالي مع أقنعة الجدة.",
      en: "Soothing mist, perfect with grandma's masks.",
      fr: "Brume apaisante, parfaite avec les masques.",
      es: "Bruma calmante, ideal con las mascarillas.",
    },
    price: "SAR 39",
    image:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=70",
    links: { SA: "https://s.noon.com/eDaCUkk_imw", AE: "https://s.noon.com/eDaCUkk_imw" },
    tags: ["rose", "ورد", "face", "بشرة", "mask", "قناع"],
  },
  {
    id: "noon-clay-mask",
    name: {
      ar: "قناع الطين الأخضر",
      en: "Green Clay Mask",
      fr: "Masque à l'argile verte",
      es: "Mascarilla de arcilla verde",
    },
    note: {
      ar: "ينقي المسام ويشد البشرة بلطف.",
      en: "Purifies pores and gently tightens skin.",
      fr: "Purifie les pores et raffermit la peau.",
      es: "Purifica los poros y tensa la piel.",
    },
    price: "SAR 55",
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=800&q=70",
    links: { SA: "https://s.noon.com/eDaCUkk_imw", AE: "https://s.noon.com/eDaCUkk_imw" },
    tags: ["clay", "طين", "mask", "قناع", "face", "وجه"],
  },
];

export function noonLinkFor(product: NoonProduct, country: string | null | undefined) {
  return (country ?? "").toUpperCase() === "AE" ? product.links.AE : product.links.SA;
}
