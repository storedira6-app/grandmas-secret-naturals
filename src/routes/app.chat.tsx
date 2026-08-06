import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import grandmaImg from "@/assets/grandma-noura.jpg";
import { useI18n } from "@/lib/i18n";
import { GeneratedRecipeCard } from "@/components/GeneratedRecipeCard";
import { generateRecipe } from "@/lib/gemini.functions";
import { showInterstitial } from "@/lib/ads";
import type { GeneratedRecipe } from "@/lib/gemini.server";


export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "Grandma Noura — Natural beauty consultant | سر الجدة" },
      {
        name: "description",
        content: "Chat with Grandma Noura for natural remedies for hair, skin, and wellbeing.",
      },
      { property: "og:title", content: "Grandma Noura — Natural beauty consultant" },
      { property: "og:description", content: "Warm, natural advice and step-by-step herbal recipes." },
    ],
  }),
  component: ChatTab,
});

type Msg = { id: number; from: "grandma" | "me"; text: string; recipe?: GeneratedRecipe };

const INTRO_TEXT: Record<string, string> = {
  ar: "طيب يا حبيبتي 🌿 حضّرت لك الوصفة دي:",
  en: "Of course, dear 🌿 here is the ritual I prepared for you:",
  fr: "Bien sûr, ma chérie 🌿 voici le rituel que je t'ai préparé :",
  es: "Claro, cariño 🌿 aquí tienes el ritual que te preparé:",
};

const ERROR_TEXT: Record<string, string> = {
  ar: "معلش يا حبيبتي، ما قدرتش أجهّز الوصفة دلوقتي. جربي تاني بعد شوية 🌿",
  en: "Sorry dear, I couldn't prepare the recipe right now. Please try again in a moment 🌿",
  fr: "Désolée ma chérie, je n'ai pas pu préparer la recette. Réessaie dans un instant 🌿",
  es: "Lo siento, cariño, no pude preparar la receta. Inténtalo de nuevo en un momento 🌿",
};

export default function ChatTab() {
  const { t, lang } = useI18n();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const askGrandma = useServerFn(generateRecipe);

  useEffect(() => {
    setMessages([{ id: 1, from: "grandma", text: t("chatIntro") }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const quick = ["quickHair", "quickGlow", "quickSlim", "quickAcne", "quickSleep"];

  const reply = async (text: string) => {
    if (typing) return;
    setTyping(true);
    setMessages((m) => [...m, { id: Date.now(), from: "me", text }]);
    try {
      const [recipe] = await Promise.all([
        askGrandma({ data: { ingredients: text, lang } }),
        // Interstitial ad plays while the recipe is being generated (native only).
        showInterstitial(),
      ]);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "grandma",
          text: INTRO_TEXT[lang] ?? INTRO_TEXT["en"]!,
          recipe,
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "grandma", text: ERROR_TEXT[lang] ?? ERROR_TEXT["en"]! },
      ]);
    } finally {
      setTyping(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="glass-card flex items-center gap-3 rounded-3xl p-3">
        <img
          src={grandmaImg}
          alt="Grandma Noura"
          loading="lazy"
          width={816}
          height={816}
          className="animate-float h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-gold/60"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{t("navChat")}</p>
          <p className="text-[11px] text-muted-foreground">🟢 online · 100% natural advice</p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="animate-rise space-y-2">
            <div className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "me"
                    ? "gradient-forest text-primary-foreground rounded-ee-lg"
                    : "glass-card rounded-es-lg"
                }`}
              >
                {m.text}
              </div>
            </div>
            {m.recipe && <GeneratedRecipeCard recipe={m.recipe} />}

          </div>
        ))}
        {typing && (
          <div className="glass-card inline-flex gap-1 rounded-3xl px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-4">
        <div className="-mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-1">
          {quick.map((q) => (
            <button
              key={q.key}
              type="button"
              onClick={() => reply(t(q.key), q.recipe)}
              className="glass-card shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary transition-transform active:scale-95"
            >
              {t(q.key)}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            const pick = RECIPES[Math.floor(Math.random() * RECIPES.length)]!;
            reply(input.trim(), pick.id);
            setInput("");
            inputRef.current?.focus();
          }}
          className="glass-card flex items-center gap-2 rounded-full p-1.5"
        >
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatPlaceholder")}
            className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label={t("send")}
            className="gradient-gold grid h-9 w-9 shrink-0 place-items-center rounded-full text-gold-foreground transition-transform active:scale-90"
          >
            <Send className="h-4 w-4 rtl:-scale-x-100" />
          </button>
        </form>
      </div>
    </div>
  );
}
