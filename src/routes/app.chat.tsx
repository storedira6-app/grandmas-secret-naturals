import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import grandmaImg from "@/assets/grandma-noura.jpg";
import { useI18n } from "@/lib/i18n";
import { RECIPES } from "@/data/content";
import { RecipeCard } from "@/components/RecipeCard";

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

type Msg = { id: number; from: "grandma" | "me"; text: string; recipeId?: string };

export default function ChatTab() {
  const { t, lang } = useI18n();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: 1, from: "grandma", text: t("chatIntro") }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const quick = [
    { key: "quickHair", recipe: "night-lotion" },
    { key: "quickGlow", recipe: "morning-mask" },
    { key: "quickSlim", recipe: "day-hydrator" },
    { key: "quickAcne", recipe: "morning-mask" },
    { key: "quickSleep", recipe: "night-lotion" },
  ];

  const reply = (text: string, recipeId: string) => {
    setTyping(true);
    setMessages((m) => [...m, { id: Date.now(), from: "me", text }]);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "grandma",
          text: t("chatIntro").startsWith("أهلاً")
            ? "طيب يا حبيبتي 🌿 جربي الوصفة دي بانتظام، وهتشوفي الفرق بإذن الله:"
            : "Of course, dear 🌿 Try this ritual regularly and you'll see the difference:",
          recipeId,
        },
      ]);
    }, 900);
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
            {m.recipeId && (
              <RecipeCard recipe={RECIPES.find((r) => r.id === m.recipeId)!} />
            )}
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
