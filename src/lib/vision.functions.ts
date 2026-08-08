import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeIngredientsWithGemini } from "./vision.server";

const Input = z.object({
  imageBase64: z.string().min(10),
  mimeType: z.string().min(3).max(60),
  lang: z.enum(["ar", "en", "fr", "es"]).default("ar"),
});

export const analyzeIngredients = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    return analyzeIngredientsWithGemini({
      apiKey,
      imageBase64: data.imageBase64,
      mimeType: data.mimeType,
      lang: data.lang,
    });
  });
