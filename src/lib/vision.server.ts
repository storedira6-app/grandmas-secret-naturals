import { GRANDMA_PERSONA, type GeneratedRecipe } from "./gemini.server";

const LANG_NAME: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  fr: "French",
  es: "Spanish",
};

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    detected: { type: "ARRAY", items: { type: "STRING" } },
    greeting: { type: "STRING" },
    title: { type: "STRING" },
    minutes: { type: "INTEGER" },
    ingredients: { type: "ARRAY", items: { type: "STRING" } },
    steps: { type: "ARRAY", items: { type: "STRING" } },
    tip: { type: "STRING" },
    precaution: { type: "STRING" },
    storeNote: { type: "STRING" },
    benefits: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "detected",
    "greeting",
    "title",
    "minutes",
    "ingredients",
    "steps",
    "tip",
    "precaution",
    "storeNote",
    "benefits",
  ],
};

export type VisionRecipe = GeneratedRecipe & {
  detected: string[];
  benefits: string[];
};

export async function analyzeIngredientsWithGemini(opts: {
  apiKey: string;
  imageBase64: string;
  mimeType: string;
  lang: string;
}): Promise<VisionRecipe> {
  const language = LANG_NAME[opts.lang] ?? "English";
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
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
              text: `${GRANDMA_PERSONA(language)}

TASK: Identify edible/kitchen ingredients visible in the photo ("detected"), then create ONE safe, 100% natural DIY beauty recipe using only those ingredients (plus common pantry basics). "benefits" = 2-4 short benefit phrases.`,
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: "Here is a photo of ingredients from my kitchen." },
              { inlineData: { mimeType: opts.mimeType, data: opts.imageBase64 } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1400,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini vision request failed [${res.status}]: ${body}`);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new Error("Gemini returned an empty response");

  const parsed = JSON.parse(text) as VisionRecipe;
  return {
    detected: (parsed.detected ?? []).map(String),
    title: String(parsed.title ?? ""),
    minutes: Number(parsed.minutes) || 10,
    ingredients: (parsed.ingredients ?? []).map(String),
    steps: (parsed.steps ?? []).map(String),
    tip: String(parsed.tip ?? ""),
    greeting: String(parsed.greeting ?? ""),
    precaution: String(parsed.precaution ?? ""),
    storeNote: String(parsed.storeNote ?? ""),
    benefits: (parsed.benefits ?? []).map(String),
  };
}
