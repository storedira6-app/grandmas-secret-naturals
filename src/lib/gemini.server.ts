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

FIELDS
- "greeting": a loving motherly opening line that makes her feel safe and pampered.
- "steps": short, clean, practical steps covering preparation and how to apply.
- "tip": one warm extra tip from grandma.
- "precaution": "تنبيه الجدة" (Grandma's Precaution) — always remind her to do a quick patch test on a small area of skin first in case of allergy.
- "storeNote": ONLY when the request needs precise formulation (sunscreen, specialized serums, heavy haircare, anti-aging, hair loss) or she wants fast results — a sweet line inviting her to the "Global Beauty Market" (متجر الجمال العالمي) tab, naming the most fitting trusted partner brand: INIKA Organic (certified organic makeup, sensitive skin, mineral sun care), 100% PURE (fruit-pigmented serums, moisturizers, masks, glow & dark spots), ALAMEA Palm Beach (luxury anti-aging, wrinkles, firmness), Aniise (hair & scalp care oils), Athletic Cosmetic Company (pores, blemishes, oily/active skin, body care). Otherwise return an empty string.`;

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

export async function generateRecipeWithGemini(opts: {
  apiKey: string;
  ingredients: string;
  lang: string;
}): Promise<GeneratedRecipe> {
  const language = LANG_NAME[opts.lang] ?? "English";
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": opts.apiKey.trim(),
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: GRANDMA_PERSONA(language),
            },
          ],
        },
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
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini request failed [${res.status}]: ${body}`);
  }

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
