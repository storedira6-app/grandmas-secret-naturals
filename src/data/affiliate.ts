import type { Lang } from "@/lib/i18n";

export type AffiliateProduct = {
  id: string;
  name: Record<Lang, string>;
  note: Record<Lang, string>;
  price: string;
  image: string;
  url: string;
};

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: "cerave-cleanser",
    name: {
      ar: "غسول CeraVe اللطيف",
      en: "CeraVe Hydrating Cleanser",
      fr: "Nettoyant hydratant CeraVe",
      es: "Limpiador hidratante CeraVe",
    },
    note: {
      ar: "ينظف بدون ما يشد البشرة، مناسب مع وصفات الجدة.",
      en: "Cleans without stripping — pairs well with grandma's rituals.",
      fr: "Nettoie sans dessécher — parfait avec les rituels de grand-mère.",
      es: "Limpia sin resecar — ideal con los rituales de la abuela.",
    },
    price: "$14.99",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=70",
    url: "https://www.amazon.com/s?k=cerave+hydrating+cleanser",
  },
  {
    id: "niacinamide-serum",
    name: {
      ar: "سيروم نياسيناميد 10%",
      en: "Niacinamide 10% Serum",
      fr: "Sérum Niacinamide 10%",
      es: "Sérum de Niacinamida 10%",
    },
    note: {
      ar: "يوحّد اللون ويقلل آثار الحبوب مع الاستعمال المنتظم.",
      en: "Evens tone and fades marks with regular use.",
      fr: "Unifie le teint et atténue les marques.",
      es: "Unifica el tono y atenúa las marcas.",
    },
    price: "$11.90",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=70",
    url: "https://www.amazon.com/s?k=niacinamide+10+serum",
  },
];
