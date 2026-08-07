import type { Lang } from "@/lib/i18n";

export type PlaceCategory = "herbalist" | "spa" | "oils" | "top";

export type CommunityPlace = {
  id: string;
  category: Exclude<PlaceCategory, "top">;
  rating: number;
  reviews: number;
  phone: string;
  image: string;
  mapQuery: string;
  badge: Record<Lang, string>;
  badgeTone: "gold" | "forest";
  name: Record<Lang, string>;
  city: Record<Lang, string>;
  note: Record<Lang, string>;
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const COMMUNITY_PLACES: CommunityPlace[] = [
  {
    id: "attar-fes",
    category: "herbalist",
    rating: 4.9,
    reviews: 128,
    phone: "+212600000001",
    image: u("photo-1471943311424-646960669fbc"),
    mapQuery: "عطارة الأصالة فاس",
    badgeTone: "gold",
    badge: {
      ar: "موصى به من الجدة نورة",
      en: "Recommended by Grandma Noura",
      fr: "Recommandé par Grand-mère Noura",
      es: "Recomendado por la abuela Noura",
    },
    name: {
      ar: "عطارة الأصالة العتيقة",
      en: "Al-Asala Old Herbalist",
      fr: "Herboristerie Al-Asala",
      es: "Herbolario Al-Asala",
    },
    city: { ar: "فاس · المدينة القديمة", en: "Fes · Old Medina", fr: "Fès · Médina", es: "Fez · Medina" },
    note: {
      ar: "أفضل ماء ورد مقطر جربته عندهم! الرائحة تدوم أيام.",
      en: "Best distilled rose water I've tried — the scent lasts for days!",
      fr: "La meilleure eau de rose que j'ai essayée !",
      es: "¡El mejor agua de rosas que he probado!",
    },
  },
  {
    id: "hammam-marrakech",
    category: "spa",
    rating: 4.8,
    reviews: 214,
    phone: "+212600000002",
    image: u("photo-1600334089648-b0d9d3028eb2"),
    mapQuery: "حمام تقليدي مراكش",
    badgeTone: "forest",
    badge: {
      ar: "ترشيح بنات مراكش",
      en: "Picked by the Marrakech girls",
      fr: "Choisi par les filles de Marrakech",
      es: "Elegido por las chicas de Marrakech",
    },
    name: {
      ar: "حمام دار الياسمين",
      en: "Dar Yasmine Hammam",
      fr: "Hammam Dar Yasmine",
      es: "Hammam Dar Yasmine",
    },
    city: { ar: "مراكش · باب دكالة", en: "Marrakech · Bab Doukkala", fr: "Marrakech · Bab Doukkala", es: "Marrakech · Bab Doukkala" },
    note: {
      ar: "الصابون البلدي والغاسول عندهم أصلي، والبشرة تخرج كالحرير.",
      en: "Their black soap and ghassoul are the real deal — skin like silk.",
      fr: "Savon noir et ghassoul authentiques, peau de soie.",
      es: "Jabón negro y ghassoul auténticos, piel de seda.",
    },
  },
  {
    id: "oils-taroudant",
    category: "oils",
    rating: 5.0,
    reviews: 76,
    phone: "+212600000003",
    image: u("photo-1608571423902-eed4a5ad8108"),
    mapQuery: "تعاونية زيت الأرغان تارودانت",
    badgeTone: "gold",
    badge: {
      ar: "موصى به من الجدة نورة",
      en: "Recommended by Grandma Noura",
      fr: "Recommandé par Grand-mère Noura",
      es: "Recomendado por la abuela Noura",
    },
    name: {
      ar: "تعاونية تقطير أرغان الجنوب",
      en: "Argan Distillery Co-op",
      fr: "Coopérative de distillation d'argan",
      es: "Cooperativa de destilación de argán",
    },
    city: { ar: "تارودانت", en: "Taroudant", fr: "Taroudant", es: "Taroudant" },
    note: {
      ar: "يقطرون أمامك مباشرة، زيت الأرغان صافي ورائحته قوية جداً.",
      en: "They distill in front of you — pure argan with a strong aroma.",
      fr: "Distillation devant vous, argan pur et parfumé.",
      es: "Destilan frente a ti, argán puro y aromático.",
    },
  },
  {
    id: "attar-riyadh",
    category: "herbalist",
    rating: 4.7,
    reviews: 93,
    phone: "+966500000004",
    image: u("photo-1512428813834-c702c7702b78"),
    mapQuery: "عطارة الأعشاب الرياض",
    badgeTone: "forest",
    badge: {
      ar: "ترشيح بنات الرياض",
      en: "Picked by the Riyadh girls",
      fr: "Choisi par les filles de Riyad",
      es: "Elegido por las chicas de Riad",
    },
    name: {
      ar: "عطارة نجد للأعشاب",
      en: "Najd Herbal House",
      fr: "Maison des herbes de Najd",
      es: "Casa de hierbas de Najd",
    },
    city: { ar: "الرياض · حي العليا", en: "Riyadh · Olaya", fr: "Riyad · Olaya", es: "Riad · Olaya" },
    note: {
      ar: "خلطة الحلبة والحبة السوداء عندهم غيّرت شعري خلال شهر.",
      en: "Their fenugreek & black seed blend changed my hair in a month.",
      fr: "Leur mélange fenugrec & nigelle a transformé mes cheveux.",
      es: "Su mezcla de fenogreco y comino negro cambió mi cabello.",
    },
  },
  {
    id: "spa-tunis",
    category: "spa",
    rating: 4.6,
    reviews: 58,
    phone: "+216200000005",
    image: u("photo-1540555700478-4be289fbecef"),
    mapQuery: "سبا عضوي تونس",
    badgeTone: "forest",
    badge: {
      ar: "ترشيح بنات تونس",
      en: "Picked by the Tunis girls",
      fr: "Choisi par les filles de Tunis",
      es: "Elegido por las chicas de Túnez",
    },
    name: {
      ar: "سبا الزهر العضوي",
      en: "Orange Blossom Organic Spa",
      fr: "Spa bio Fleur d'oranger",
      es: "Spa orgánico Azahar",
    },
    city: { ar: "تونس · سيدي بوسعيد", en: "Tunis · Sidi Bou Said", fr: "Tunis · Sidi Bou Saïd", es: "Túnez · Sidi Bou Said" },
    note: {
      ar: "جلسة ماء الزهر والطين مريحة جداً، والمكان نظيف وهادئ.",
      en: "The neroli & clay session is so calming, spotless place.",
      fr: "Séance néroli & argile très apaisante, lieu impeccable.",
      es: "Sesión de neroli y arcilla muy relajante, lugar impecable.",
    },
  },
  {
    id: "oils-cairo",
    category: "oils",
    rating: 4.5,
    reviews: 41,
    phone: "+201000000006",
    image: u("photo-1596178060810-72660ee8d99d"),
    mapQuery: "معمل تقطير زيوت عطرية القاهرة",
    badgeTone: "gold",
    badge: {
      ar: "ترشيح بنات القاهرة",
      en: "Picked by the Cairo girls",
      fr: "Choisi par les filles du Caire",
      es: "Elegido por las chicas de El Cairo",
    },
    name: {
      ar: "دار تقطير النيل للزيوت",
      en: "Nile Essential Oils House",
      fr: "Maison des huiles du Nil",
      es: "Casa de aceites del Nilo",
    },
    city: { ar: "القاهرة · خان الخليلي", en: "Cairo · Khan el-Khalili", fr: "Le Caire · Khan el-Khalili", es: "El Cairo · Khan el-Jalili" },
    note: {
      ar: "زيت الياسمين عندهم طبيعي ١٠٠٪ وسعره معقول جداً.",
      en: "Their jasmine oil is 100% natural and fairly priced.",
      fr: "Huile de jasmin 100% naturelle et abordable.",
      es: "Aceite de jazmín 100% natural y económico.",
    },
  },
];
