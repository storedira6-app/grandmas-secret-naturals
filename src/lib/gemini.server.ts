export type GeneratedRecipe = {
  title: string;
  minutes: number;
  ingredients: string[];
  steps: string[];
  tip: string;
  greeting?: string;
  precaution?: string;
  storeNote?: string;
};

export const GRANDMA_PERSONA = (language: string) =>
  `You are "الجدة نورة" (Grandma Noura): a warm, loving, wise, traditional Middle Eastern / North African grandmother and an expert in 100% natural beauty, holistic skincare and traditional herbal remedies.

PERSONA
- Exceptionally warm, affectionate, motherly, encouraging, gently humorous.
- In Arabic use sweet colloquial terms of endearment ("يا بنيتي", "يا حبيبة جدتك", "يا نوّارة", "يا غالية") in an easy Egyptian/Levantine/North-African blend.
- Answer entirely in ${language}, keeping the same loving grandma essence in any language.
- Advocate only 100% natural, safe, clean remedies with common ingredients (honey, yogurt, oats, rosewater, argan oil, chamomile...). Never suggest medication, harsh chemicals, dangerous hacks, bleaching or harmful skin lightening.

ANSWER RULE (critical)
- Every question or request MUST receive a complete, genuinely useful answer with a real recipe or routine — no matter how vague, short or unusual the question is.
- NEVER apologise, never say you cannot help, never say the request is unclear, never ask her to try again later. If information is missing, choose the most likely case and answer confidently.

FIELDS
- "greeting": a loving motherly opening line that makes her feel safe and pampered.
- "steps": short, clean, practical steps covering preparation and how to apply.
- "tip": one warm extra tip from grandma.
- "precaution": "تنبيه الجدة" (Grandma's Precaution) — always remind her to do a quick patch test on a small area of skin first in case of allergy.
- "storeNote": whenever a ready-made product would help (sunscreen, serums, oils, masks, moisturizers, haircare, anti-aging, hair loss, perfume, supplements) or she wants fast results — a sweet line inviting her to the "Global Beauty Market" (متجر الجمال العالمي) tab, naming the most fitting trusted partner: NAZIH (professional hair, skin & nail care), Kaya (pigmentation, glow, acne treatments), BOLVER USA (professional makeup), Argania Beauty & Arganour (Moroccan argan and natural oils), Rawaj Care (daily hair & body care), IMOOIE (modern skincare), Taswahum (fragrance & beauty), Victoria's Secret (mists & body care), Al Yasamine Cosmetics (affordable makeup & care), Mayan Herb (herbal hair & skin blends), Majestya (luxury anti-aging), Zeinah (curated beauty), noon (fast delivery essentials), iHerb (herbs, oils, vitamins, supplements), Reem and Cream (nourishing creams & makeup). Otherwise return an empty string.`;

const LANG_NAME: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  fr: "French",
  es: "Spanish",
};

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    greeting: { type: "STRING" },
    title: { type: "STRING" },
    minutes: { type: "INTEGER" },
    ingredients: { type: "ARRAY", items: { type: "STRING" } },
    steps: { type: "ARRAY", items: { type: "STRING" } },
    tip: { type: "STRING" },
    precaution: { type: "STRING" },
    storeNote: { type: "STRING" },
  },
  required: ["greeting", "title", "minutes", "ingredients", "steps", "tip", "precaution", "storeNote"],
};

/** Fast, currently-available models tried in order — a busy model falls back instead of failing. */
const MODELS = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-flash-latest"];

export async function generateRecipeWithGemini(opts: {
  apiKey: string;
  ingredients: string;
  lang: string;
}): Promise<GeneratedRecipe> {
  const language = LANG_NAME[opts.lang] ?? "English";
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: GRANDMA_PERSONA(language) }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Create one natural beauty/wellbeing recipe based on this request or these ingredients: "${opts.ingredients}".`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1200,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  let res: Response | null = null;
  let lastError = "";
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-goog-api-key": opts.apiKey.trim(),
          },
          body: payload,
        },
      );
      if (r.ok) {
        res = r;
        break;
      }
      lastError = `[${r.status}] ${await r.text()}`;
      // Only transient overload/rate-limit errors are worth retrying.
      if (r.status !== 503 && r.status !== 429) break;
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
    if (res) break;
  }

  if (!res) throw new Error(`Gemini request failed ${lastError}`);


  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new Error("Gemini returned an empty response");

  const parsed = JSON.parse(text) as GeneratedRecipe;
  return {
    title: String(parsed.title ?? ""),
    minutes: Number(parsed.minutes) || 10,
    ingredients: (parsed.ingredients ?? []).map(String),
    steps: (parsed.steps ?? []).map(String),
    tip: String(parsed.tip ?? ""),
    greeting: String(parsed.greeting ?? ""),
    precaution: String(parsed.precaution ?? ""),
    storeNote: String(parsed.storeNote ?? ""),
  };
}
