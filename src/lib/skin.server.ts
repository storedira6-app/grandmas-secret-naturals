import { GRANDMA_PERSONA } from "./gemini.server";

const LANG_NAME: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  fr: "French",
  es: "Spanish",
};

const AREA_LABEL: Record<string, string> = {
  face: "face",
  hands: "hands",
  feet: "feet",
  neck: "neck / décolleté",
  scalp: "scalp and hairline",
  body: "another body area",
};

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    greeting: { type: "STRING" },
    imageQuality: { type: "STRING" },
    usable: { type: "BOOLEAN" },
    skinType: { type: "STRING" },
    skinTypeNote: { type: "STRING" },
    apparentAge: { type: "STRING" },
    metrics: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          key: {
            type: "STRING",
            enum: [
              "radiance",
              "hydration",
              "wrinkles",
              "spots",
              "pores",
              "redness",
              "acne",
              "elasticity",
            ],
          },
          label: { type: "STRING" },
          score: { type: "INTEGER" },
          note: { type: "STRING" },
        },
        required: ["key", "label", "score", "note"],
      },
    },
    concerns: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          detail: { type: "STRING" },
        },
        required: ["title", "detail"],
      },
    },
    summary: { type: "STRING" },
    morning: { type: "ARRAY", items: { type: "STRING" } },
    evening: { type: "ARRAY", items: { type: "STRING" } },
    weekly: { type: "ARRAY", items: { type: "STRING" } },
    recipeTitle: { type: "STRING" },
    recipeIngredients: { type: "ARRAY", items: { type: "STRING" } },
    precaution: { type: "STRING" },
    storeNote: { type: "STRING" },
  },
  required: [
    "greeting",
    "imageQuality",
    "usable",
    "skinType",
    "skinTypeNote",
    "apparentAge",
    "metrics",
    "concerns",
    "summary",
    "morning",
    "evening",
    "weekly",
    "recipeTitle",
    "recipeIngredients",
    "precaution",
    "storeNote",
  ],
};

export type SkinMetric = {
  key: string;
  label: string;
  /** 0-100, higher = better condition */
  score: number;
  note: string;
};

export type SkinReport = {
  greeting: string;
  imageQuality: string;
  usable: boolean;
  skinType: string;
  skinTypeNote: string;
  apparentAge: string;
  metrics: SkinMetric[];
  concerns: { title: string; detail: string }[];
  summary: string;
  morning: string[];
  evening: string[];
  weekly: string[];
  recipeTitle: string;
  recipeIngredients: string[];
  precaution: string;
  storeNote: string;
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

export async function analyzeSkinWithGemini(opts: {
  apiKey: string;
  imageBase64: string;
  mimeType: string;
  lang: string;
  area: string;
  lightingHint?: string;
}): Promise<SkinReport> {
  const language = LANG_NAME[opts.lang] ?? "English";
  const area = AREA_LABEL[opts.area] ?? "skin";

  const body = JSON.stringify({
    systemInstruction: {
      parts: [
        {
          text: `${GRANDMA_PERSONA(language)}

TASK — "Skin Microscope AI" cosmetic (non-medical) skin appearance analysis of the user's ${area} photo.

RULES
- Judge ONLY what is visibly observable in the photo. Never diagnose diseases, never mention medication. This is a cosmetic beauty assessment.
- Account for photo conditions: comment on lighting, sharpness and framing in "imageQuality" and lower your confidence when they are poor. Set "usable" to false only when the photo really cannot be assessed (no skin visible, extreme blur/darkness) — then still give gentle re-shoot guidance.
- "skinType": one of oily / dry / combination / normal / sensitive (translated to ${language}).
- "apparentAge": a short phrase about how well-cared the skin looks versus its apparent age range.
- "metrics": ALWAYS return these 7 keys — radiance, hydration, wrinkles, spots, pores, redness, acne — each with a 0-100 score where 100 = excellent/no issue and low = strong issue, plus a one-line observation. "label" must be in ${language}.
- "concerns": 2-5 visible issues with a simple friendly explanation.
- "morning" / "evening": numbered-style daily routine steps (4-6 each) using natural, kitchen-friendly ingredients. "weekly": 1-3 weekly rituals (mask, scrub, oil massage).
- "recipeTitle" + "recipeIngredients": one natural DIY recipe tailored to the biggest visible issue.
- "precaution": Grandma's Precaution — always a patch test reminder.
- "storeNote": a sweet one-line invite to grandma's picks in the Store tab, or an empty string.
- Speak like a loving grandma, in ${language}.`,
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Please analyze my ${area} skin from this photo.${
              opts.lightingHint ? ` Capture conditions detected by the app: ${opts.lightingHint}.` : ""
            }`,
          },
          { inlineData: { mimeType: opts.mimeType, data: opts.imageBase64 } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 2200,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  // The vision model occasionally answers 429/503 under load — retry with bounded backoff.
  let res: Response | null = null;
  let lastError = "";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 2500));
    const attemptRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": opts.apiKey.trim(),
        },
        body,
      },
    );
    if (attemptRes.ok) {
      res = attemptRes;
      break;
    }
    lastError = `Gemini skin request failed [${attemptRes.status}]: ${await attemptRes.text()}`;
    if (attemptRes.status !== 429 && attemptRes.status < 500) break;
  }

  if (!res) throw new Error(lastError || "Gemini skin request failed");


  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new Error("Gemini returned an empty response");

  const parsed = JSON.parse(text) as SkinReport;
  return {
    greeting: String(parsed.greeting ?? ""),
    imageQuality: String(parsed.imageQuality ?? ""),
    usable: parsed.usable !== false,
    skinType: String(parsed.skinType ?? ""),
    skinTypeNote: String(parsed.skinTypeNote ?? ""),
    apparentAge: String(parsed.apparentAge ?? ""),
    metrics: (parsed.metrics ?? []).map((m) => ({
      key: String(m.key),
      label: String(m.label),
      score: clamp(m.score),
      note: String(m.note ?? ""),
    })),
    concerns: (parsed.concerns ?? []).map((c) => ({
      title: String(c.title ?? ""),
      detail: String(c.detail ?? ""),
    })),
    summary: String(parsed.summary ?? ""),
    morning: (parsed.morning ?? []).map(String),
    evening: (parsed.evening ?? []).map(String),
    weekly: (parsed.weekly ?? []).map(String),
    recipeTitle: String(parsed.recipeTitle ?? ""),
    recipeIngredients: (parsed.recipeIngredients ?? []).map(String),
    precaution: String(parsed.precaution ?? ""),
    storeNote: String(parsed.storeNote ?? ""),
  };
}
