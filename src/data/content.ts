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
  {
    id: "honey-oat-scrub",
    image: maskImg,
    minutes: 8,
    tag: { ar: "صباحي", en: "Morning", fr: "Matin", es: "Mañana" },
    title: {
      ar: "مقشر العسل والشوفان",
      en: "Honey & Oat Scrub",
      fr: "Gommage miel & avoine",
      es: "Exfoliante de miel y avena",
    },
    desc: {
      ar: "يزيل الخلايا الميتة بلطف ويترك البشرة ناعمة.",
      en: "Gently buffs away dead skin and leaves it soft.",
      fr: "Élimine les peaux mortes en douceur.",
      es: "Elimina las células muertas con suavidad.",
    },
    ingredients: {
      ar: ["ملعقتان شوفان مطحون", "ملعقة عسل", "ملعقة زبادي"],
      en: ["2 tbsp ground oats", "1 tbsp honey", "1 tbsp yogurt"],
      fr: ["2 c.à.s d'avoine moulue", "1 c.à.s de miel", "1 c.à.s de yaourt"],
      es: ["2 cdas de avena molida", "1 cda de miel", "1 cda de yogur"],
    },
    steps: {
      ar: ["اخلطي المكونات جيداً", "دلكي بحركات دائرية دقيقتين", "اتركيها ٥ دقائق", "اشطفي بماء فاتر"],
      en: ["Mix everything well", "Massage in circles for 2 minutes", "Leave 5 minutes", "Rinse lukewarm"],
      fr: ["Mélangez bien", "Massez 2 minutes", "Laissez 5 minutes", "Rincez à l'eau tiède"],
      es: ["Mezcla bien", "Masajea 2 minutos", "Deja 5 minutos", "Enjuaga con agua tibia"],
    },
  },
  {
    id: "green-tea-tonic",
    image: hydratorImg,
    minutes: 6,
    tag: { ar: "نهاري", en: "Day", fr: "Jour", es: "Día" },
    title: {
      ar: "تونر الشاي الأخضر",
      en: "Green Tea Toner",
      fr: "Tonique au thé vert",
      es: "Tónico de té verde",
    },
    desc: {
      ar: "يضيّق المسام ويهدئ الاحمرار.",
      en: "Tightens pores and calms redness.",
      fr: "Resserre les pores et apaise les rougeurs.",
      es: "Cierra los poros y calma el enrojecimiento.",
    },
    ingredients: {
      ar: ["كوب شاي أخضر مبرد", "ملعقة ماء ورد", "نقطتان زيت شجرة الشاي"],
      en: ["1 cup cooled green tea", "1 tbsp rose water", "2 drops tea tree oil"],
      fr: ["1 tasse de thé vert froid", "1 c.à.s d'eau de rose", "2 gouttes d'arbre à thé"],
      es: ["1 taza de té verde frío", "1 cda de agua de rosas", "2 gotas de árbol de té"],
    },
    steps: {
      ar: ["اغلي الشاي واتركيه يبرد", "أضيفي ماء الورد والزيت", "ضعيه بقطنة صباحاً ومساءً"],
      en: ["Brew the tea and cool it", "Add rose water and oil", "Apply with cotton morning and night"],
      fr: ["Infusez et laissez refroidir", "Ajoutez eau de rose et huile", "Appliquez matin et soir"],
      es: ["Prepara el té y enfríalo", "Añade agua de rosas y aceite", "Aplica mañana y noche"],
    },
  },
  {
    id: "coconut-hair-mask",
    image: nightImg,
    minutes: 20,
    tag: { ar: "شعر", en: "Hair", fr: "Cheveux", es: "Cabello" },
    title: {
      ar: "حمام زيت جوز الهند للشعر",
      en: "Coconut Hair Oil Bath",
      fr: "Bain d'huile de coco",
      es: "Baño de aceite de coco",
    },
    desc: {
      ar: "يغذي الأطراف ويقلل التقصف.",
      en: "Feeds the ends and reduces breakage.",
      fr: "Nourrit les pointes et limite la casse.",
      es: "Nutre las puntas y reduce la rotura.",
    },
    ingredients: {
      ar: ["٣ ملاعق زيت جوز الهند", "ملعقة زيت خروع", "٣ نقاط إكليل الجبل"],
      en: ["3 tbsp coconut oil", "1 tbsp castor oil", "3 drops rosemary oil"],
      fr: ["3 c.à.s d'huile de coco", "1 c.à.s de ricin", "3 gouttes de romarin"],
      es: ["3 cdas de aceite de coco", "1 cda de ricino", "3 gotas de romero"],
    },
    steps: {
      ar: ["سخني الزيوت قليلاً", "دلكي فروة الرأس ٥ دقائق", "غطي الشعر ٢٠ دقيقة", "اغسلي بشامبو لطيف"],
      en: ["Warm the oils slightly", "Massage the scalp 5 minutes", "Cover hair 20 minutes", "Wash with a gentle shampoo"],
      fr: ["Tiédissez les huiles", "Massez le cuir chevelu 5 min", "Couvrez 20 minutes", "Lavez doucement"],
      es: ["Entibia los aceites", "Masajea el cuero cabelludo 5 min", "Cubre 20 minutos", "Lava con champú suave"],
    },
  },
  {
    id: "turmeric-glow",
    image: maskImg,
    minutes: 12,
    tag: { ar: "نضارة", en: "Glow", fr: "Éclat", es: "Brillo" },
    title: {
      ar: "ماسك الكركم والزبادي",
      en: "Turmeric & Yogurt Mask",
      fr: "Masque curcuma & yaourt",
      es: "Mascarilla de cúrcuma y yogur",
    },
    desc: {
      ar: "يوحّد اللون ويمنح إشراقة فورية.",
      en: "Evens tone and gives instant radiance.",
      fr: "Unifie le teint et illumine.",
      es: "Unifica el tono y da luminosidad.",
    },
    ingredients: {
      ar: ["نصف ملعقة كركم", "ملعقتان زبادي", "ملعقة عسل"],
      en: ["1/2 tsp turmeric", "2 tbsp yogurt", "1 tsp honey"],
      fr: ["1/2 c.à.c de curcuma", "2 c.à.s de yaourt", "1 c.à.c de miel"],
      es: ["1/2 cdta de cúrcuma", "2 cdas de yogur", "1 cdta de miel"],
    },
    steps: {
      ar: ["اخلطي حتى تتجانس", "وزعيها بعيداً عن العينين", "اتركيها ١٠ دقائق", "اشطفي جيداً"],
      en: ["Mix until smooth", "Apply avoiding the eyes", "Leave 10 minutes", "Rinse well"],
      fr: ["Mélangez", "Appliquez en évitant les yeux", "Laissez 10 minutes", "Rincez bien"],
      es: ["Mezcla bien", "Aplica evitando los ojos", "Deja 10 minutos", "Enjuaga"],
    },
  },
  {
    id: "cucumber-eyes",
    image: hydratorImg,
    minutes: 10,
    tag: { ar: "عيون", en: "Eyes", fr: "Yeux", es: "Ojos" },
    title: {
      ar: "كمادات الخيار للهالات",
      en: "Cucumber Eye Compress",
      fr: "Compresse concombre",
      es: "Compresa de pepino",
    },
    desc: {
      ar: "تخفف الانتفاخ والهالات السوداء.",
      en: "Soothes puffiness and dark circles.",
      fr: "Réduit les poches et les cernes.",
      es: "Alivia bolsas y ojeras.",
    },
    ingredients: {
      ar: ["شرائح خيار باردة", "ملعقة ماء ورد", "قطن"],
      en: ["Cold cucumber slices", "1 tbsp rose water", "Cotton pads"],
      fr: ["Rondelles de concombre froides", "1 c.à.s d'eau de rose", "Coton"],
      es: ["Rodajas de pepino frías", "1 cda de agua de rosas", "Algodón"],
    },
    steps: {
      ar: ["بللي القطن بماء الورد", "ضعي الخيار فوق العينين", "استرخي ١٠ دقائق", "اشطفي برفق"],
      en: ["Soak cotton in rose water", "Place cucumber over the eyes", "Relax 10 minutes", "Rinse gently"],
      fr: ["Imbibez le coton", "Posez le concombre", "Détendez-vous 10 min", "Rincez"],
      es: ["Empapa el algodón", "Coloca el pepino", "Relájate 10 minutos", "Enjuaga"],
    },
  },
  {
    id: "coffee-body",
    image: nightImg,
    minutes: 15,
    tag: { ar: "جسم", en: "Body", fr: "Corps", es: "Cuerpo" },
    title: {
      ar: "مقشر القهوة للجسم",
      en: "Coffee Body Scrub",
      fr: "Gommage café",
      es: "Exfoliante de café",
    },
    desc: {
      ar: "ينشط الدورة الدموية ويشد البشرة.",
      en: "Boosts circulation and firms the skin.",
      fr: "Active la circulation et raffermit.",
      es: "Activa la circulación y reafirma.",
    },
    ingredients: {
      ar: ["٤ ملاعق قهوة مطحونة", "ملعقتان زيت زيتون", "ملعقة سكر بني"],
      en: ["4 tbsp ground coffee", "2 tbsp olive oil", "1 tbsp brown sugar"],
      fr: ["4 c.à.s de café moulu", "2 c.à.s d'huile d'olive", "1 c.à.s de sucre roux"],
      es: ["4 cdas de café molido", "2 cdas de aceite de oliva", "1 cda de azúcar moreno"],
    },
    steps: {
      ar: ["اخلطي المكونات", "دلكي الجسم بحركات دائرية", "اتركيها ٥ دقائق", "اشطفي بماء دافئ"],
      en: ["Mix everything", "Massage the body in circles", "Leave 5 minutes", "Rinse warm"],
      fr: ["Mélangez", "Massez en cercles", "Laissez 5 minutes", "Rincez"],
      es: ["Mezcla todo", "Masajea en círculos", "Deja 5 minutos", "Enjuaga"],
    },
  },
  {
    id: "chamomile-calm",
    image: maskImg,
    minutes: 10,
    tag: { ar: "تهدئة", en: "Calm", fr: "Apaisant", es: "Calma" },
    title: {
      ar: "بخار البابونج للوجه",
      en: "Chamomile Facial Steam",
      fr: "Vapeur de camomille",
      es: "Vapor de manzanilla",
    },
    desc: {
      ar: "يفتح المسام ويهدئ البشرة الحساسة.",
      en: "Opens pores and calms sensitive skin.",
      fr: "Ouvre les pores et apaise.",
      es: "Abre los poros y calma la piel.",
    },
    ingredients: {
      ar: ["حفنة زهر بابونج", "لتر ماء ساخن", "منشفة"],
      en: ["A handful of chamomile", "1L hot water", "A towel"],
      fr: ["Une poignée de camomille", "1 L d'eau chaude", "Une serviette"],
      es: ["Un puñado de manzanilla", "1 L de agua caliente", "Una toalla"],
    },
    steps: {
      ar: ["انقعي البابونج في الماء الساخن", "قربي وجهك مع منشفة", "استنشقي البخار ٨ دقائق", "جففي ورطبي"],
      en: ["Steep chamomile in hot water", "Lean over with a towel", "Steam 8 minutes", "Pat dry and moisturize"],
      fr: ["Infusez la camomille", "Penchez-vous avec une serviette", "8 minutes de vapeur", "Séchez et hydratez"],
      es: ["Infusiona la manzanilla", "Inclínate con una toalla", "Vapor 8 minutos", "Seca e hidrata"],
    },
  },
  {
    id: "aloe-night-gel",
    image: hydratorImg,
    minutes: 7,
    tag: { ar: "ليلي", en: "Night", fr: "Nuit", es: "Noche" },
    title: {
      ar: "جل الصبار وفيتامين E",
      en: "Aloe & Vitamin E Gel",
      fr: "Gel aloès & vitamine E",
      es: "Gel de aloe y vitamina E",
    },
    desc: {
      ar: "ترطيب خفيف يصلح البشرة أثناء الليل.",
      en: "Light overnight repair and hydration.",
      fr: "Réparation légère pendant la nuit.",
      es: "Reparación ligera durante la noche.",
    },
    ingredients: {
      ar: ["٣ ملاعق جل صبار", "كبسولة فيتامين E", "نقطتان زيت ورد"],
      en: ["3 tbsp aloe gel", "1 vitamin E capsule", "2 drops rose oil"],
      fr: ["3 c.à.s de gel d'aloès", "1 capsule vitamine E", "2 gouttes d'huile de rose"],
      es: ["3 cdas de gel de aloe", "1 cápsula de vitamina E", "2 gotas de aceite de rosa"],
    },
    steps: {
      ar: ["اخلطي المكونات في وعاء نظيف", "وزعي طبقة رقيقة قبل النوم", "احفظيها في الثلاجة"],
      en: ["Mix in a clean jar", "Apply a thin layer before bed", "Keep in the fridge"],
      fr: ["Mélangez dans un pot propre", "Appliquez avant le coucher", "Conservez au frais"],
      es: ["Mezcla en un frasco limpio", "Aplica antes de dormir", "Guarda en la nevera"],
    },
  },
  {
    id: "lemon-hands",
    image: nightImg,
    minutes: 9,
    tag: { ar: "يدين", en: "Hands", fr: "Mains", es: "Manos" },
    title: {
      ar: "ماسك اليدين بالسكر والليمون",
      en: "Sugar & Lemon Hand Mask",
      fr: "Masque mains sucre & citron",
      es: "Mascarilla de manos con azúcar y limón",
    },
    desc: {
      ar: "ينعم اليدين ويوحّد لونهما.",
      en: "Softens hands and evens their tone.",
      fr: "Adoucit les mains et unifie le teint.",
      es: "Suaviza las manos y unifica el tono.",
    },
    ingredients: {
      ar: ["ملعقتان سكر", "ملعقة عسل", "بضع قطرات ليمون", "ملعقة زيت زيتون"],
      en: ["2 tbsp sugar", "1 tbsp honey", "A few drops of lemon", "1 tbsp olive oil"],
      fr: ["2 c.à.s de sucre", "1 c.à.s de miel", "Quelques gouttes de citron", "1 c.à.s d'huile d'olive"],
      es: ["2 cdas de azúcar", "1 cda de miel", "Unas gotas de limón", "1 cda de aceite de oliva"],
    },
    steps: {
      ar: ["اخلطي المكونات", "دلكي اليدين ٣ دقائق", "اتركيها ٥ دقائق", "اشطفي ورطبي"],
      en: ["Mix everything", "Massage hands 3 minutes", "Leave 5 minutes", "Rinse and moisturize"],
      fr: ["Mélangez", "Massez 3 minutes", "Laissez 5 minutes", "Rincez et hydratez"],
      es: ["Mezcla todo", "Masajea 3 minutos", "Deja 5 minutos", "Enjuaga e hidrata"],
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
    url: "https://shamsroyalmall.zid.store/search?q=argan%20oil",
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
    url: "https://shamsroyalmall.zid.store/search?q=natural%20kit",
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
    url: "https://shamsroyalmall.zid.store/search?q=green%20clay",
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
    url: "https://shamsroyalmall.zid.store/search?q=lavender%20balm",
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
