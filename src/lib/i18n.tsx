import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en" | "fr" | "es";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

type Dict = Record<string, string>;

const ar: Dict = {
  brand: "سر الجدة",
  tagline: "طبيعي 100%",
  welcome: "احنا بتوع الطبيعي!",
  welcomeSub: "وصفات الجدة، أسرار الطبيعة، وجمال حقيقي بدون كيماويات.",
  start: "ابدأ رحلتك",
  google: "المتابعة باستخدام Google",
  skip: "تخطي الآن",
  onboard1: "أسرار موروثة",
  onboard1d: "وصفات مجربة من جداتنا",
  onboard2: "مكونات نقية",
  onboard2d: "من قلب الطبيعة فقط",
  onboard3: "روتين يومي",
  onboard3d: "مخصص لبشرتك وشعرك",
  navChat: "الجدة نورة",
  navRecipes: "وصفات ترند",
  navStore: "المتجر",
  navMap: "دليل الطبيعة",
  chatIntro: "أهلاً حبيبتي 🌿 أنا الجدة نورة. احكيلي، إيه اللي مضايقك النهاردة؟",
  chatPlaceholder: "اكتبي سؤالك للجدة...",
  send: "إرسال",
  quickHair: "تساقط الشعر",
  quickGlow: "نضارة البشرة",
  quickSlim: "تنحيف طبيعي",
  quickAcne: "حب الشباب",
  quickSleep: "نوم عميق",
  ingredients: "المكونات",
  steps: "الخطوات",
  prep: "وقت التحضير",
  min: "دقيقة",
  saveRecipe: "احفظي الوصفة",
  saved: "تم الحفظ ✓",
  today: "وصفات اليوم",
  todaySub: "٣ وصفات مختارة بعناية ليومك",
  moodTitle: "مزاج جمالك اليوم",
  moodSub: "اختاري إحساسك، والجدة تقترح وصفة",
  moodTired: "مرهقة",
  moodGlow: "متألقة",
  moodDry: "جافة",
  moodStress: "متوترة",
  streak: "أيام متتالية",
  routine: "روتينك اليومي",
  routineDone: "أحسنتِ! أكملتِ روتين اليوم ✨",
  storeTitle: "متجر سر الجدة",
  storeSub: "منتجات طبيعية مختارة بحب",
  buy: "اشتري عبر المتجر",
  sponsor: "مساحة إعلانية",
  sponsorText: "منتجات عضوية معتمدة — أعلن معنا",
  mapTitle: "دليل الطبيعة",
  mapSub: "معشبات، سبا عضوي، وحمامات معدنية قريبة منك",
  call: "اتصال",
  directions: "الاتجاهات",
  all: "الكل",
  herbalist: "معشبات",
  spa: "سبا عضوي",
  bath: "حمامات معدنية",
  new: "جديد",
  trending: "الأكثر رواجاً",
};

const en: Dict = {
  brand: "Grandma's Secret",
  tagline: "100% Natural",
  welcome: "We are all about natural beauty!",
  welcomeSub: "Grandma's recipes, nature's secrets, real beauty with zero chemicals.",
  start: "Start your journey",
  google: "Continue with Google",
  skip: "Skip for now",
  onboard1: "Inherited secrets",
  onboard1d: "Recipes proven by our grandmothers",
  onboard2: "Pure ingredients",
  onboard2d: "Straight from nature",
  onboard3: "Daily routine",
  onboard3d: "Personalized for your skin & hair",
  navChat: "Grandma Noura",
  navRecipes: "Trending",
  navStore: "Store",
  navMap: "Directory",
  chatIntro: "Hello dear 🌿 I'm Grandma Noura. Tell me, what's bothering you today?",
  chatPlaceholder: "Ask Grandma anything...",
  send: "Send",
  quickHair: "Hair loss",
  quickGlow: "Skin radiance",
  quickSlim: "Natural slimming",
  quickAcne: "Acne",
  quickSleep: "Deep sleep",
  ingredients: "Ingredients",
  steps: "Steps",
  prep: "Prep time",
  min: "min",
  saveRecipe: "Save recipe",
  saved: "Saved ✓",
  today: "Today's recipes",
  todaySub: "3 handpicked rituals for your day",
  moodTitle: "Your beauty mood today",
  moodSub: "Pick how you feel, Grandma suggests a ritual",
  moodTired: "Tired",
  moodGlow: "Glowing",
  moodDry: "Dry",
  moodStress: "Stressed",
  streak: "day streak",
  routine: "Your daily routine",
  routineDone: "Beautiful! Today's routine is complete ✨",
  storeTitle: "Grandma's Store",
  storeSub: "Natural products picked with love",
  buy: "Buy via Store",
  sponsor: "Sponsored",
  sponsorText: "Certified organic goods — advertise with us",
  mapTitle: "Natural Directory",
  mapSub: "Herbalists, organic spas & thermal baths near you",
  call: "Call",
  directions: "Directions",
  all: "All",
  herbalist: "Herbalists",
  spa: "Organic spa",
  bath: "Thermal baths",
  new: "New",
  trending: "Trending",
};

const fr: Dict = {
  ...en,
  brand: "Le Secret de Grand-Mère",
  tagline: "100% Naturel",
  welcome: "Nous sommes 100% naturels !",
  welcomeSub: "Les recettes de grand-mère, les secrets de la nature, sans produits chimiques.",
  start: "Commencer",
  google: "Continuer avec Google",
  skip: "Plus tard",
  onboard1: "Secrets hérités",
  onboard1d: "Des recettes éprouvées par nos grands-mères",
  onboard2: "Ingrédients purs",
  onboard2d: "Directement de la nature",
  onboard3: "Routine quotidienne",
  onboard3d: "Personnalisée pour votre peau et vos cheveux",
  navChat: "Grand-mère Noura",
  navRecipes: "Tendances",
  navStore: "Boutique",
  navMap: "Annuaire",
  chatIntro: "Bonjour ma chère 🌿 Je suis Grand-mère Noura. Dis-moi, qu'est-ce qui te préoccupe ?",
  chatPlaceholder: "Posez votre question…",
  send: "Envoyer",
  quickHair: "Chute de cheveux",
  quickGlow: "Éclat de la peau",
  quickSlim: "Minceur naturelle",
  quickAcne: "Acné",
  quickSleep: "Sommeil profond",
  ingredients: "Ingrédients",
  steps: "Étapes",
  prep: "Préparation",
  min: "min",
  saveRecipe: "Enregistrer",
  saved: "Enregistré ✓",
  today: "Recettes du jour",
  todaySub: "3 rituels choisis pour vous",
  moodTitle: "Votre humeur beauté",
  moodSub: "Choisissez votre ressenti, Grand-mère propose un rituel",
  moodTired: "Fatiguée",
  moodGlow: "Rayonnante",
  moodDry: "Sèche",
  moodStress: "Stressée",
  streak: "jours de suite",
  routine: "Votre routine du jour",
  routineDone: "Bravo ! Routine terminée ✨",
  storeTitle: "La Boutique",
  storeSub: "Des produits naturels choisis avec amour",
  buy: "Acheter en boutique",
  sponsor: "Sponsorisé",
  sponsorText: "Produits bio certifiés — annoncez avec nous",
  mapTitle: "Annuaire Naturel",
  mapSub: "Herboristeries, spas bio et bains thermaux près de vous",
  call: "Appeler",
  directions: "Itinéraire",
  all: "Tout",
  herbalist: "Herboristeries",
  spa: "Spa bio",
  bath: "Bains thermaux",
  new: "Nouveau",
  trending: "Tendance",
};

const es: Dict = {
  ...en,
  brand: "El Secreto de la Abuela",
  tagline: "100% Natural",
  welcome: "¡Somos 100% naturales!",
  welcomeSub: "Recetas de la abuela, secretos de la naturaleza, belleza real sin químicos.",
  start: "Comenzar",
  google: "Continuar con Google",
  skip: "Ahora no",
  onboard1: "Secretos heredados",
  onboard1d: "Recetas probadas por nuestras abuelas",
  onboard2: "Ingredientes puros",
  onboard2d: "Directo de la naturaleza",
  onboard3: "Rutina diaria",
  onboard3d: "Personalizada para tu piel y cabello",
  navChat: "Abuela Noura",
  navRecipes: "Tendencias",
  navStore: "Tienda",
  navMap: "Directorio",
  chatIntro: "Hola querida 🌿 Soy la Abuela Noura. Dime, ¿qué te preocupa hoy?",
  chatPlaceholder: "Pregúntale a la abuela…",
  send: "Enviar",
  quickHair: "Caída del cabello",
  quickGlow: "Luminosidad",
  quickSlim: "Adelgazar natural",
  quickAcne: "Acné",
  quickSleep: "Sueño profundo",
  ingredients: "Ingredientes",
  steps: "Pasos",
  prep: "Preparación",
  min: "min",
  saveRecipe: "Guardar receta",
  saved: "Guardado ✓",
  today: "Recetas de hoy",
  todaySub: "3 rituales elegidos para ti",
  moodTitle: "Tu ánimo de belleza",
  moodSub: "Elige cómo te sientes y la abuela sugiere un ritual",
  moodTired: "Cansada",
  moodGlow: "Radiante",
  moodDry: "Seca",
  moodStress: "Estresada",
  streak: "días seguidos",
  routine: "Tu rutina diaria",
  routineDone: "¡Muy bien! Rutina completada ✨",
  storeTitle: "La Tienda",
  storeSub: "Productos naturales elegidos con amor",
  buy: "Comprar en la tienda",
  sponsor: "Patrocinado",
  sponsorText: "Productos orgánicos certificados — anúnciate",
  mapTitle: "Directorio Natural",
  mapSub: "Herbolarios, spas orgánicos y baños termales cerca de ti",
  call: "Llamar",
  directions: "Cómo llegar",
  all: "Todo",
  herbalist: "Herbolarios",
  spa: "Spa orgánico",
  bath: "Baños termales",
  new: "Nuevo",
  trending: "Tendencia",
};

const DICTS: Record<Lang, Dict> = { ar, en, fr, es };

type I18nValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const stored = window.localStorage.getItem("gs-lang") as Lang | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("gs-lang", l);
  }, []);

  const t = useCallback((key: string) => DICTS[lang][key] ?? DICTS.en[key] ?? key, [lang]);

  const value = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]) as I18nValue;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
