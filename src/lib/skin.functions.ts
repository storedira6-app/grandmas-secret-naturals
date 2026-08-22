import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeSkinWithGemini } from "./skin.server";

const Input = z.object({
  imageBase64: z.string().min(10),
  mimeType: z.string().min(3).max(60),
  lang: z.enum(["ar", "en", "fr", "es"]).default("ar"),
  area: z.enum(["face", "hands", "feet", "neck", "scalp", "body"]).default("face"),
  lightingHint: z.string().max(300).optional(),
});

export const analyzeSkin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    return analyzeSkinWithGemini({
      apiKey,
      imageBase64: data.imageBase64,
      mimeType: data.mimeType,
      lang: data.lang,
      area: data.area,
      ...(data.lightingHint ? { lightingHint: data.lightingHint } : {}),
    });
  });
