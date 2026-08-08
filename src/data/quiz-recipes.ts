import type { Lang } from "@/lib/i18n";
import type { GeneratedRecipe } from "@/lib/gemini.server";

export type QuizGoal = "glow" | "bright" | "hydrate";

type LocalizedRecipe = Record<Lang, GeneratedRecipe>;

export const QUIZ_RECIPES: Record<QuizGoal, LocalizedRecipe> = {
  glow: {
    ar: {
      title: "ماسك الزبادي والعسل للنضارة الزجاجية",
      minutes: 15,
      ingredients: ["ملعقتان زبادي طبيعي", "ملعقة عسل نحل", "رشة كركم", "قطرات ليمون"],
      steps: [
        "اخلطي المكونات حتى تصير كريمة ناعمة.",
        "وزّعيها على وجه نظيف وتجنّبي محيط العين.",
        "اتركيها ١٥ دقيقة ثم اشطفي بماء فاتر.",
        "كرّري مرتين أسبوعياً.",
      ],
      tip: "استعمليها مساءً، والكركم قليل جداً حتى لا يصبغ البشرة.",
    },
    en: {
      title: "Yogurt & honey glass-skin mask",
      minutes: 15,
      ingredients: ["2 tbsp plain yogurt", "1 tbsp raw honey", "A pinch of turmeric", "A few drops of lemon"],
      steps: [
        "Mix into a smooth cream.",
        "Apply to a clean face, avoiding the eye area.",
        "Leave for 15 minutes, rinse with lukewarm water.",
        "Repeat twice a week.",
      ],
      tip: "Use it in the evening and keep the turmeric tiny so it doesn't tint the skin.",
    },
    fr: {
      title: "Masque yaourt & miel effet glass-skin",
      minutes: 15,
      ingredients: ["2 c. à s. de yaourt nature", "1 c. à s. de miel", "Une pincée de curcuma", "Quelques gouttes de citron"],
      steps: [
        "Mélangez jusqu'à obtenir une crème lisse.",
        "Appliquez sur peau propre en évitant les yeux.",
        "Laissez 15 minutes puis rincez à l'eau tiède.",
        "Deux fois par semaine.",
      ],
      tip: "Le soir de préférence, et très peu de curcuma.",
    },
    es: {
      title: "Mascarilla de yogur y miel para brillo",
      minutes: 15,
      ingredients: ["2 cdas de yogur natural", "1 cda de miel", "Una pizca de cúrcuma", "Unas gotas de limón"],
      steps: [
        "Mezcla hasta lograr una crema suave.",
        "Aplica sobre el rostro limpio, evitando los ojos.",
        "Deja 15 minutos y enjuaga con agua tibia.",
        "Dos veces por semana.",
      ],
      tip: "Úsala por la noche y con muy poca cúrcuma.",
    },
  },
  bright: {
    ar: {
      title: "تونر ماء الورد والأرز للتفتيح الطبيعي",
      minutes: 10,
      ingredients: ["نصف كوب ماء أرز مغلي ومبرّد", "ملعقتان ماء ورد", "قطرة زيت لوز حلو"],
      steps: [
        "اخلطي ماء الأرز مع ماء الورد في بخّاخ نظيف.",
        "رشّي على وجه نظيف صباحاً ومساءً.",
        "اتركيه يجف ثم رطّبي بزيت اللوز.",
        "احفظيه في الثلاجة لمدة ٥ أيام.",
      ],
      tip: "لا تنسي واقي الشمس نهاراً حتى تدوم النتيجة.",
    },
    en: {
      title: "Rice water & rose brightening toner",
      minutes: 10,
      ingredients: ["½ cup cooled rice water", "2 tbsp rose water", "1 drop sweet almond oil"],
      steps: [
        "Mix rice water and rose water in a clean spray bottle.",
        "Mist onto a clean face morning and night.",
        "Let it dry, then seal with almond oil.",
        "Keep refrigerated for up to 5 days.",
      ],
      tip: "Always use sunscreen during the day so results last.",
    },
    fr: {
      title: "Lotion eau de riz & rose éclaircissante",
      minutes: 10,
      ingredients: ["½ tasse d'eau de riz refroidie", "2 c. à s. d'eau de rose", "1 goutte d'huile d'amande douce"],
      steps: [
        "Mélangez dans un vaporisateur propre.",
        "Vaporisez matin et soir sur peau propre.",
        "Laissez sécher puis scellez avec l'huile d'amande.",
        "Conservez au frais 5 jours.",
      ],
      tip: "Protection solaire indispensable en journée.",
    },
    es: {
      title: "Tónico de agua de arroz y rosas",
      minutes: 10,
      ingredients: ["½ taza de agua de arroz fría", "2 cdas de agua de rosas", "1 gota de aceite de almendras"],
      steps: [
        "Mezcla en un pulverizador limpio.",
        "Aplica mañana y noche sobre el rostro limpio.",
        "Deja secar y sella con aceite de almendras.",
        "Guarda en la nevera hasta 5 días.",
      ],
      tip: "Usa protector solar de día para mantener los resultados.",
    },
  },
  hydrate: {
    ar: {
      title: "قناع الشوفان والأفوكادو للترطيب العميق",
      minutes: 20,
      ingredients: ["ملعقتان شوفان مطحون", "نصف أفوكادو مهروسة", "ملعقة زيت زيتون", "ملعقة عسل"],
      steps: [
        "اهرسي الأفوكادو وأضيفي باقي المكونات.",
        "ضعي طبقة سميكة على الوجه والرقبة.",
        "اتركيها ٢٠ دقيقة ثم دلّكي بلطف واشطفي.",
        "مرتين أسبوعياً في الشتاء.",
      ],
      tip: "الشوفان يهدّئ البشرة الحساسة والاحمرار.",
    },
    en: {
      title: "Oat & avocado deep hydration mask",
      minutes: 20,
      ingredients: ["2 tbsp ground oats", "½ mashed avocado", "1 tbsp olive oil", "1 tbsp honey"],
      steps: [
        "Mash the avocado and stir in the rest.",
        "Apply a thick layer to face and neck.",
        "Leave 20 minutes, massage gently, rinse.",
        "Twice a week in winter.",
      ],
      tip: "Oats calm sensitive, red skin beautifully.",
    },
    fr: {
      title: "Masque avoine & avocat hydratation profonde",
      minutes: 20,
      ingredients: ["2 c. à s. de flocons d'avoine moulus", "½ avocat écrasé", "1 c. à s. d'huile d'olive", "1 c. à s. de miel"],
      steps: [
        "Écrasez l'avocat et mélangez le reste.",
        "Appliquez une couche épaisse visage et cou.",
        "Laissez 20 minutes, massez, rincez.",
        "Deux fois par semaine en hiver.",
      ],
      tip: "L'avoine apaise les peaux sensibles et les rougeurs.",
    },
    es: {
      title: "Mascarilla de avena y aguacate",
      minutes: 20,
      ingredients: ["2 cdas de avena molida", "½ aguacate machacado", "1 cda de aceite de oliva", "1 cda de miel"],
      steps: [
        "Machaca el aguacate y mezcla el resto.",
        "Aplica una capa gruesa en rostro y cuello.",
        "Deja 20 minutos, masajea y enjuaga.",
        "Dos veces por semana en invierno.",
      ],
      tip: "La avena calma la piel sensible y el enrojecimiento.",
    },
  },
};
