export type GeneratedRecipe = {
  title: string;
  minutes: number;
  ingredients: string[];
  steps: string[];
  tip: string;
};

const LANG_NAME: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  fr: "French",
  es: "Spanish",
};

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    minutes: { type: "INTEGER" },
    ingredients: { type: "ARRAY", items: { type: "STRING" } },
    steps: { type: "ARRAY", items: { type: "STRING" } },
    tip: { type: "STRING" },
  },
  required: ["title", "minutes", "ingredients", "steps", "tip"],
};

export async function generateRecipeWithGemini(opts: {
  apiKey: string;
  ingredients: string;
  lang: string;
}): Promise<GeneratedRecipe> {
  const language = LANG_NAME[opts.lang] ?? "English";
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
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
              text: `You are "Grandma Noura", a warm North-African herbalist grandmother. You only give 100% natural home beauty and wellbeing recipes. Never suggest medication or anything unsafe. Answer entirely in ${language}. Keep steps short and practical.`,
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
  };
}
