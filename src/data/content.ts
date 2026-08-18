import maskImg from "@/assets/recipe-mask.jpg";
import hydratorImg from "@/assets/recipe-hydrator.jpg";
import nightImg from "@/assets/recipe-night.jpg";
import storeImg from "@/assets/store-products.jpg";
import type { Lang } from "@/lib/i18n";

export type Recipe = {
  id: string;
  image: string;
  minutes: number;
  tag: Record<Lang, string>;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
  ingredients: Record<Lang, string[]>;
  steps: Record<Lang, string[]>;
};

export const RECIPES: Recipe[] = [
  {
    id: "morning-mask",
    image: maskImg,
    minutes: 10,
    tag: { ar: "صباحي", en: "Morning", fr: "Matin", es: "Mañana" },
    title: {
      ar: "قناع الطين الأخضر والنعناع",
      en: "Green Clay & Mint Mask",
      fr: "Masque argile verte & menthe",
      es: "Mascarilla de arcilla verde y menta",
    },
    desc: {
      ar: "ينقي المسام ويمنح البشرة انتعاشة الصباح.",
      en: "Purifies pores and wakes your skin up.",
      fr: "Purifie les pores et réveille la peau.",
      es: "Purifica los poros y despierta la piel.",
    },
    ingredients: {
      ar: ["ملعقتان طين أخضر", "ماء ورد", "٥ ورقات نعناع مهروسة", "ملعقة عسل"],
      en: ["2 tbsp green clay", "Rose water", "5 crushed mint leaves", "1 tsp honey"],
      fr: ["2 c.à.s d'argile verte", "Eau de rose", "5 feuilles de menthe", "1 c.à.c de miel"],
      es: ["2 cdas de arcilla verde", "Agua de rosas", "5 hojas de menta", "1 cdta de miel"],
    },
    steps: {
      ar: ["اخلطي المكونات حتى تصبح كريمية", "وزعيها على وجه نظيف", "اتركيها ١٠ دقائق", "اشطفي بماء فاتر"],
      en: ["Mix into a creamy paste", "Apply on clean skin", "Leave for 10 minutes", "Rinse with lukewarm water"],
      fr: ["Mélangez en pâte crémeuse", "Appliquez sur peau propre", "Laissez 10 minutes", "Rincez à l'eau tiède"],
      es: ["Mezcla hasta una pasta cremosa", "Aplica sobre piel limpia", "Deja 10 minutos", "Enjuaga con agua tibia"],
    },
  },
  {
    id: "day-hydrator",
    image: hydratorImg,
    minutes: 5,
    tag: { ar: "نهاري", en: "Day", fr: "Jour", es: "Día" },
    title: {
      ar: "رذاذ ماء الورد والصبار",
      en: "Rose & Aloe Hydrating Mist",
      fr: "Brume rose & aloès",
      es: "Bruma de rosa y aloe",
    },
    desc: {
      ar: "ترطيب فوري ولمعة طبيعية طوال اليوم.",
      en: "Instant hydration and a natural glow all day.",
      fr: "Hydratation instantanée et éclat naturel.",
      es: "Hidratación instantánea y brillo natural.",
    },
    ingredients: {
      ar: ["١٠٠ مل ماء ورد", "ملعقتان جل صبار", "٣ نقاط زيت جوجوبا"],
      en: ["100ml rose water", "2 tbsp aloe gel", "3 drops jojoba oil"],
      fr: ["100 ml d'eau de rose", "2 c.à.s de gel d'aloès", "3 gouttes de jojoba"],
      es: ["100 ml de agua de rosas", "2 cdas de gel de aloe", "3 gotas de jojoba"],
    },
    steps: {
      ar: ["اخلطي المكونات في بخاخ زجاجي", "رجي جيداً قبل كل استخدام", "رشي على الوجه عند الحاجة"],
      en: ["Mix in a glass spray bottle", "Shake before each use", "Mist over face anytime"],
      fr: ["Mélangez dans un flacon en verre", "Secouez avant usage", "Vaporisez au besoin"],
      es: ["Mezcla en un frasco de vidrio", "Agita antes de usar", "Rocía cuando lo necesites"],
    },
  },
  {
    id: "night-lotion",
    image: nightImg,
    minutes: 15,
    tag: { ar: "ليلي", en: "Night", fr: "Nuit", es: "Noche" },
    title: {
      ar: "بلسم الأرغان والخزامى الليلي",
      en: "Argan & Lavender Night Balm",
      fr: "Baume nuit argan & lavande",
      es: "Bálsamo nocturno de argán y lavanda",
    },
    desc: {
      ar: "يغذي البشرة أثناء النوم ويهدئ الحواس.",
      en: "Feeds your skin while you sleep and calms the senses.",
      fr: "Nourrit la peau pendant le sommeil.",
      es: "Nutre la piel mientras duermes.",
    },
    ingredients: {
      ar: ["زبدة الشيا", "زيت أرغان", "٤ نقاط زيت خزامى"],
      en: ["Shea butter", "Argan oil", "4 drops lavender oil"],
      fr: ["Beurre de karité", "Huile d'argan", "4 gouttes de lavande"],
      es: ["Manteca de karité", "Aceite de argán", "4 gotas de lavanda"],
    },
    steps: {
      ar: ["أذيبي زبدة الشيا على حمام مائي", "أضيفي زيت الأرغان والخزامى", "اخفقي حتى تبرد", "دلكي وجهك قبل النوم"],
      en: ["Melt shea butter in a bain-marie", "Add argan and lavender", "Whip until cool", "Massage in before bed"],
      fr: ["Faites fondre le karité", "Ajoutez argan et lavande", "Fouettez jusqu'à refroidir", "Massez avant le coucher"],
      es: ["Derrite la karité a baño maría", "Añade argán y lavanda", "Bate hasta enfriar", "Masajea antes de dormir"],
    },
  },
];

export type Product = {
  id: string;
  price: string;
  image: string;
  url: string;
  badge?: "new" | "trending";
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
};

export const PRODUCTS: Product[] = [
  {
    id: "argan",
    price: "€18",
    image: hydratorImg,
    url: "https://shamsroyalmall.zid.store/",
    badge: "trending",
    name: {
      ar: "زيت أرغان نقي",
      en: "Pure Argan Oil",
      fr: "Huile d'argan pure",
      es: "Aceite de argán puro",
    },
    desc: {
      ar: "معصور على البارد، للشعر والبشرة.",
      en: "Cold-pressed, for hair and skin.",
      fr: "Pressée à froid, cheveux et peau.",
      es: "Prensado en frío, cabello y piel.",
    },
  },
  {
    id: "kit",
    price: "€39",
    image: storeImg,
    url: "https://shamsroyalmall.zid.store/",
    badge: "new",
    name: {
      ar: "طقم أسرار الجدة",
      en: "Grandma's Secret Kit",
      fr: "Coffret Secret de Grand-Mère",
      es: "Kit Secreto de la Abuela",
    },
    desc: {
      ar: "صابون بلدي + زيت + بودرة أعشاب.",
      en: "Black soap + oil + herbal powder.",
      fr: "Savon noir + huile + poudre d'herbes.",
      es: "Jabón negro + aceite + polvo herbal",
    },
  },
  {
    id: "clay",
    price: "€12",
    image: maskImg,
    url: "https://shamsroyalmall.zid.store/",
    name: {
      ar: "طين أطلس الأخضر",
      en: "Atlas Green Clay",
      fr: "Argile verte de l'Atlas",
      es: "Arcilla verde del Atlas",
    },
    desc: {
      ar: "من جبال الأطلس، ١٠٠٪ طبيعي.",
      en: "From the Atlas mountains, 100% natural.",
      fr: "Des montagnes de l'Atlas, 100% naturelle.",
      es: "De las montañas del Atlas, 100% natural.",
    },
  },
  {
    id: "balm",
    price: "€22",
    image: nightImg,
    url: "https://shamsroyalmall.zid.store/",
    name: {
      ar: "بلسم الليل بالخزامى",
      en: "Lavender Night Balm",
      fr: "Baume nuit lavande",
      es: "Bálsamo nocturno de lavanda",
    },
    desc: {
      ar: "تغذية عميقة أثناء النوم.",
      en: "Deep overnight nourishment.",
      fr: "Nutrition profonde la nuit.",
      es: "Nutrición profunda nocturna.",
    },
  },
];

export type Place = {
  id: string;
  type: "herbalist" | "spa" | "bath";
  rating: number;
  phone: string;
  x: number;
  y: number;
  name: Record<Lang, string>;
  area: Record<Lang, string>;
};

export const PLACES: Place[] = [
  {
    id: "attar",
    type: "herbalist",
    rating: 4.8,
    phone: "+212600000001",
    x: 26,
    y: 34,
    name: { ar: "عطارة الأصالة", en: "Al-Asala Herbalist", fr: "Herboristerie Al-Asala", es: "Herbolario Al-Asala" },
    area: { ar: "المدينة القديمة", en: "Old Medina", fr: "Ancienne Médina", es: "Medina Antigua" },
  },
  {
    id: "spa1",
    type: "spa",
    rating: 4.9,
    phone: "+212600000002",
    x: 62,
    y: 28,
    name: { ar: "سبا الياسمين العضوي", en: "Jasmine Organic Spa", fr: "Spa bio Jasmin", es: "Spa orgánico Jazmín" },
    area: { ar: "وسط المدينة", en: "Downtown", fr: "Centre-ville", es: "Centro" },
  },
  {
    id: "bath1",
    type: "bath",
    rating: 4.6,
    phone: "+212600000003",
    x: 44,
    y: 66,
    name: { ar: "حمام مولاي المعدني", en: "Moulay Thermal Bath", fr: "Bain thermal Moulay", es: "Baño termal Moulay" },
    area: { ar: "الطريق الجبلي", en: "Mountain road", fr: "Route de montagne", es: "Carretera de montaña" },
  },
  {
    id: "attar2",
    type: "herbalist",
    rating: 4.5,
    phone: "+212600000004",
    x: 76,
    y: 58,
    name: { ar: "معشبة النخيل", en: "Palm Herbalist", fr: "Herboristerie Palmier", es: "Herbolario Palmera" },
    area: { ar: "حي النخيل", en: "Palm district", fr: "Quartier Palmier", es: "Barrio Palmera" },
  },
];
