const LANG_NAME: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  fr: "French",
  es: "Spanish",
};

export async function transcribeWithGemini(opts: {
  apiKey: string;
  audioBase64: string;
  mimeType: string;
  lang: string;
}): Promise<string> {
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
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Transcribe this voice note verbatim. It is most likely in ${language}. Return only the transcription text, with no quotes or extra commentary. If there is no speech, return an empty string.`,
              },
              { inlineData: { mimeType: opts.mimeType, data: opts.audioBase64 } },
            ],
          },
        ],
        generationConfig: { temperature: 0, maxOutputTokens: 400 },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini transcription failed [${res.status}]: ${body}`);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return (json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "").trim();
}
