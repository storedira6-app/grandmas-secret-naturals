import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Mic, Send, Square, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useI18n } from "@/lib/i18n";
import { useGlow } from "@/lib/glow";
import { GeneratedRecipeCard } from "@/components/GeneratedRecipeCard";
import { Countdown } from "@/components/Countdown";
import { RECIPES } from "@/data/content";
import { generateRecipe } from "@/lib/gemini.functions";
import { analyzeIngredients } from "@/lib/vision.functions";
import { transcribeAudio } from "@/lib/stt.functions";
import { startRecording, blobToBase64, type VoiceRecorder } from "@/lib/recorder";
import { showInterstitial } from "@/lib/ads";
import { useDailyUses } from "@/lib/usage";
import { UsageGate } from "@/components/UsageGate";
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

type Msg = {
  id: number;
  from: "grandma" | "me";
  text: string;
  recipe?: GeneratedRecipe;
  detected?: string[];
  benefits?: string[];
  photo?: string;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
}


const INTRO_TEXT: Record<string, string> = {
  ar: "طيب يا حبيبتي 🌿 حضّرت لك الوصفة دي:",
  en: "Of course, dear 🌿 here is the ritual I prepared for you:",
  fr: "Bien sûr, ma chérie 🌿 voici le rituel que je t'ai préparé :",
  es: "Claro, cariño 🌿 aquí tienes el ritual que te preparé:",
};

const FALLBACK_TEXT: Record<string, string> = {
  ar: "خديها من الجدة يا حبيبتي 🌿 دي وصفة مجرّبة تناسب حالتك دلوقتي:",
  en: "Here you go, dear 🌿 a trusted ritual that fits what you asked for:",
  fr: "Voilà ma chérie 🌿 un rituel éprouvé qui correspond à ta demande :",
  es: "Aquí tienes, cariño 🌿 un ritual probado para lo que pediste:",
};

/** Never answer with an apology — always hand back a real, useful ritual. */
function fallbackRecipe(lang: "ar" | "en" | "fr" | "es", question: string) {
  const seed = Math.abs(
    [...question].reduce((a, c) => a + c.charCodeAt(0), 0),
  ) % RECIPES.length;
  const r = RECIPES[seed]!;
  return {
    title: r.title[lang],
    minutes: r.minutes,
    ingredients: r.ingredients[lang],
    steps: r.steps[lang],
    tip: r.desc[lang],
    precaution: {
      ar: "احتياط الجدة: جرّبي الوصفة على منطقة صغيرة من اليد قبل الاستعمال.",
      en: "Grandma's precaution: patch-test on a small area of your arm first.",
      fr: "Précaution de mamie : fais un test sur une petite zone du bras.",
      es: "Precaución de la abuela: haz una prueba en una zona pequeña.",
    }[lang],
    storeNote: {
      ar: "تقدري تلاقي مكوّنات جاهزة في متجر الجمال العالمي داخل التطبيق.",
      en: "You can find ready-made versions in the Global Beauty Market tab.",
      fr: "Tu trouveras des versions prêtes dans le Marché Beauté Mondial.",
      es: "Encuentras versiones listas en el Mercado de Belleza Global.",
    }[lang],
  };
}

export default function ChatTab() {
  const { t, lang } = useI18n();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const askGrandma = useServerFn(generateRecipe);
  const transcribe = useServerFn(transcribeAudio);
  const scanIngredients = useServerFn(analyzeIngredients);
  const { award } = useGlow();
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<VoiceRecorder | null>(null);
  const usage = useDailyUses("chat");
  const composerRef = useRef<HTMLDivElement>(null);
  const [composerH, setComposerH] = useState(220);

  // Keep enough space under the last answer so nothing hides behind the composer.
  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    const update = () => setComposerH(el.offsetHeight + 120);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const onPhoto = async (file: File | undefined) => {
    if (!file || scanning || typing) return;
    if (usage.limitReached) return;
    usage.consume();
    const preview = URL.createObjectURL(file);
    setMessages((m) => [...m, { id: Date.now(), from: "me", text: t("snapShort"), photo: preview }]);
    setScanning(true);
    try {
      const imageBase64 = await fileToBase64(file);
      const [result] = await Promise.all([
        scanIngredients({ data: { imageBase64, mimeType: file.type || "image/jpeg", lang } }),
        showInterstitial(),
      ]);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "grandma",
          text: result.greeting?.trim() || INTRO_TEXT[lang] || INTRO_TEXT["en"]!,
          recipe: {
            title: result.title,
            minutes: result.minutes,
            ingredients: result.ingredients,
            steps: result.steps,
            tip: result.tip,
            precaution: result.precaution ?? "",
            storeNote: result.storeNote ?? "",
          },
          detected: result.detected,
          benefits: result.benefits,
        },
      ]);
      award(15, t("glowScan"));
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "grandma",
          text: FALLBACK_TEXT[lang] ?? FALLBACK_TEXT["en"]!,
          recipe: fallbackRecipe(lang, "scan"),
        },
      ]);
    } finally {
      setScanning(false);
    }
  };


  useEffect(() => {
    setMessages([{ id: 1, from: "grandma", text: t("chatIntro") }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Bring the newest answer's top into view so the full recipe is readable.
  useEffect(() => {
    const target = lastMsgRef.current ?? endRef.current;
    const id = setTimeout(
      () => target?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120,
    );
    return () => clearTimeout(id);
  }, [messages, typing]);

  const quick = ["quickHair", "quickGlow", "quickSlim", "quickAcne", "quickSleep"];

  const reply = async (text: string) => {
    if (typing) return;
    if (usage.limitReached) return;
    usage.consume();
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
          text: recipe.greeting?.trim() || INTRO_TEXT[lang] || INTRO_TEXT["en"]!,
          recipe,
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "grandma",
          text: FALLBACK_TEXT[lang] ?? FALLBACK_TEXT["en"]!,
          recipe: fallbackRecipe(lang, text),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const toggleMic = async () => {
    if (transcribing || typing) return;
    if (recording) {
      const rec = recorderRef.current;
      recorderRef.current = null;
      setRecording(false);
      if (!rec) return;
      setTranscribing(true);
      try {
        const blob = await rec.stop();
        if (blob.size < 4000) {
          toast.error(t("micEmpty"));
          return;
        }
        const audioBase64 = await blobToBase64(blob);
        const { text } = await transcribe({ data: { audioBase64, mimeType: "audio/wav", lang } });
        if (!text.trim()) {
          toast.error(t("micEmpty"));
          return;
        }
        await reply(text.trim());
      } catch (e) {
        console.error(e);
        toast.error(t("micEmpty"));
      } finally {
        setTranscribing(false);
      }
      return;
    }
    try {
      recorderRef.current = await startRecording();
      setRecording(true);
    } catch (e) {
      console.error(e);
      toast.error(t("micDenied"));
    }
  };

  useEffect(() => () => recorderRef.current?.cancel(), []);




  return (
    <div className="space-y-4" style={{ paddingBottom: composerH }}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          void onPhoto(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="space-y-3">
        {messages.map((m, mi) => (
          <div
            key={m.id}
            ref={mi === messages.length - 1 ? lastMsgRef : undefined}
            className="animate-rise scroll-mt-24 space-y-2"
          >
            <div className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "me"
                    ? "gradient-forest text-primary-foreground rounded-ee-lg"
                    : "glass-card rounded-es-lg"
                }`}
              >
                {m.photo && (
                  <img
                    src={m.photo}
                    alt=""
                    className="mb-2 h-32 w-40 rounded-2xl object-cover"
                  />
                )}
                {m.text}
              </div>
            </div>
            {m.detected && m.detected.length > 0 && (
              <div className="glass-card space-y-1.5 rounded-2xl p-3">
                <p className="text-[11px] font-bold text-primary">{t("detected")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.detected.map((d) => (
                    <span
                      key={d}
                      className="rounded-full bg-accent/60 px-2.5 py-1 text-[11px] text-accent-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {m.recipe && <GeneratedRecipeCard recipe={m.recipe} />}
            {m.benefits && m.benefits.length > 0 && (
              <div className="glass-card space-y-1 rounded-2xl p-3">
                <p className="text-[11px] font-bold text-primary">{t("benefits")}</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {m.benefits.map((b) => (
                    <li key={b}>🌿 {b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {scanning && (
          <div className="glass-card animate-rise relative flex items-center gap-2 overflow-hidden rounded-3xl px-4 py-3 text-xs font-semibold text-primary">
            <ScanLine className="h-4 w-4 animate-pulse" />
            {t("scanning")}
            <Countdown seconds={20} />
            <span className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gold" />
          </div>
        )}
        {typing && (
          <div className="glass-card inline-flex items-center gap-2 rounded-3xl px-4 py-3">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </span>
            <Countdown seconds={20} />
          </div>
        )}
        <div ref={endRef} />
      </div>


      <div ref={composerRef} className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-4">
        <div className="mb-2">
          <UsageGate feature="chat" left={usage.left} ready={usage.ready} onUnlock={usage.grant} />
        </div>
        <div className="-mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-1">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              disabled={typing || usage.limitReached}
              onClick={() => void reply(t(q))}
              className="glass-card shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary transition-transform active:scale-95 disabled:opacity-50"
            >
              {t(q)}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || typing || usage.limitReached) return;
            void reply(input.trim());
            setInput("");
            inputRef.current?.focus();
          }}

          className="glass-card flex items-center gap-2 rounded-full p-1.5"
        >
          <button
            type="button"
            onClick={() => void toggleMic()}
            disabled={typing || transcribing}
            aria-label={recording ? t("micStop") : t("mic")}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform active:scale-90 disabled:opacity-50 ${
              recording
                ? "animate-pulse bg-destructive text-destructive-foreground"
                : "bg-secondary text-primary"
            }`}
          >
            {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={scanning || typing || usage.limitReached}
            aria-label={t("snapCta")}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-transform active:scale-90 disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              recording ? t("micListening") : transcribing ? t("micProcessing") : t("chatPlaceholder")
            }
            className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          <button
            type="submit"
            disabled={usage.limitReached}
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
