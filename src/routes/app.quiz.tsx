import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Sparkles, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useGlow } from "@/lib/glow";
import { GeneratedRecipeCard } from "@/components/GeneratedRecipeCard";
import { QUIZ_RECIPES, type QuizGoal } from "@/data/quiz-recipes";
import { AFFILIATE_PRODUCTS } from "@/data/affiliate";

export const Route = createFileRoute("/app/quiz")({
  head: () => ({
    meta: [
      { title: "اختبار البشرة | Skin Quiz — Grandma's Secret" },
      {
        name: "description",
        content:
          "A 3-step skin quiz that builds your personalized natural routine from Grandma Noura, plus trending product picks.",
      },
      { property: "og:title", content: "Skin Quiz — Grandma's Secret" },
      { property: "og:description", content: "Answer 3 questions, get your natural beauty routine." },
    ],
  }),
  component: QuizTab,
});

const STEPS = [
  { q: "q1", options: ["q1a", "q1b", "q1c", "q1d"] },
  { q: "q2", options: ["q2a", "q2b", "q2c", "q2d"] },
  { q: "q3", options: ["q3a", "q3b", "q3c"] },
] as const;

const GOALS: QuizGoal[] = ["glow", "bright", "hydrate"];

function QuizTab() {
  const { t, lang } = useI18n();
  const { award } = useGlow();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const done = step >= STEPS.length;
  const goal: QuizGoal = GOALS[answers[2] ?? 0] ?? "glow";
  const recipe = QUIZ_RECIPES[goal][lang];

  const choose = (i: number) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
    setStep((s) => s + 1);
    if (step === STEPS.length - 1) award(10, t("glowQuiz"));
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-5 w-5 text-gold" />
          {t("quizTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("quizSub")}</p>
      </header>

      {!done && (
        <div key={step} className="glass-card animate-spring space-y-4 rounded-3xl p-5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <span>
              {t("quizStep")} {step + 1} {t("quizOf")} {STEPS.length}
            </span>
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <span
                  key={s.q}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    i <= step ? "gradient-gold" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-primary">{t(STEPS[step]!.q)}</h2>

          <div className="grid gap-2">
            {STEPS[step]!.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => choose(i)}
                className="glass-card rounded-2xl px-4 py-3 text-start text-sm font-semibold transition-transform active:scale-[0.98] hover:border-gold"
              >
                {t(opt)}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"
            >
              <ArrowLeft className="h-3 w-3 rtl:-scale-x-100" />
              {t("back")}
            </button>
          )}
        </div>
      )}

      {done && (
        <div className="animate-spring space-y-4">
          <p className="text-sm font-bold text-primary">{t("quizResult")}</p>
          <GeneratedRecipeCard recipe={recipe} />

          <section className="glass-card space-y-3 rounded-3xl p-4">
            <h3 className="text-sm leading-snug font-bold">{t("affiliateTitle")}</h3>
            <div className="grid grid-cols-2 gap-3">
              {AFFILIATE_PRODUCTS.map((p) => (
                <article key={p.id} className="overflow-hidden rounded-2xl bg-secondary/50">
                  <img
                    src={p.image}
                    alt={p.name[lang]}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-28 w-full object-cover"
                  />
                  <div className="space-y-1.5 p-2.5">
                    <p className="line-clamp-2 text-xs font-bold">{p.name[lang]}</p>
                    <p className="line-clamp-2 text-[10px] leading-tight text-muted-foreground">
                      {p.note[lang]}
                    </p>
                    <p className="text-xs font-bold text-gold">{p.price}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="gradient-gold animate-glow flex items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-bold text-gold-foreground transition-transform active:scale-95"
                    >
                      {t("buyOriginal")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="glass-card flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-primary transition-transform active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              {t("quizAgain")}
            </button>
            <Link
              to="/app/chat"
              className="gradient-forest flex flex-1 items-center justify-center rounded-2xl py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
            >
              {t("navChat")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
