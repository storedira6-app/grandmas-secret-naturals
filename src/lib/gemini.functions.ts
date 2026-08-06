import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateRecipeWithGemini } from "./gemini.server";

const Input = z.object({
  ingredients: z.string().min(1).max(500),
  lang: z.enum(["ar", "en", "fr", "es"]).default("en"),
});

export const generateRecipe = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    return generateRecipeWithGemini({
      apiKey,
      ingredients: data.ingredients,
      lang: data.lang,
    });
  });
