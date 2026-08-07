import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { transcribeWithGemini } from "./stt.server";

const Input = z.object({
  audioBase64: z.string().min(100).max(12_000_000),
  mimeType: z.string().min(3).max(60),
  lang: z.enum(["ar", "en", "fr", "es"]).default("en"),
});

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    const text = await transcribeWithGemini({
      apiKey,
      audioBase64: data.audioBase64,
      mimeType: data.mimeType,
      lang: data.lang,
    });
    return { text };
  });
