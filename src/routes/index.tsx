import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Sparkles, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-natural.jpg";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سر الجدة | Grandma's Secret — 100% Natural Beauty" },
      {
        name: "description",
        content:
          "Natural beauty rituals, grandma's recipes, an AI herbal consultant, a natural store and a local herbalist directory — in Arabic, English, French and Spanish.",
      },
      { property: "og:title", content: "سر الجدة | Grandma's Secret — 100% Natural" },
      {
        property: "og:description",
        content: "We are all about natural beauty: rituals, recipes and remedies from grandma.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t, dir } = useI18n();
  const [pressed, setPressed] = useState(false);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const highlights = [
    { Icon: Leaf, title: t("onboard1"), desc: t("onboard1d") },
    { Icon: Sparkles, title: t("onboard2"), desc: t("onboard2d") },
    { Icon: Sun, title: t("onboard3"), desc: t("onboard3d") },
  ];

  return (
    <main className="relative mx-auto min-h-screen max-w-md overflow-hidden bg-background">
      <img
        src={heroImg}
        alt="Natural beauty ingredients: rose petals, honey, argan and herbs"
        width={1024}
        height={1408}
        className="absolute inset-0 h-[62vh] w-full object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-[62vh] bg-gradient-to-b from-transparent via-background/30 to-background" />

      <div className="relative flex min-h-screen flex-col px-5 pt-5 pb-8">
        <header className="flex items-center justify-end">
          <LanguageSwitcher />
        </header>

        <div className="mt-[34vh] space-y-2 text-center">
          <div className="animate-float mx-auto grid h-14 w-14 place-items-center rounded-full glass-card">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl leading-tight font-bold text-foreground">{t("brand")}</h1>
          <p className="shimmer-text text-sm font-bold tracking-[0.25em] uppercase">
            {t("tagline")}
          </p>
        </div>

        <div className="mt-6 space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-primary">{t("welcome")}</h2>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">{t("welcomeSub")}</p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {highlights.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="glass-card animate-rise rounded-2xl p-3 text-center"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <Icon className="mx-auto h-4 w-4 text-gold" />
              <p className="mt-1.5 text-[11px] font-bold">{title}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-3 pt-8">
          <Link
            to="/app/chat"
            className="gradient-forest animate-glow flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-primary-foreground transition-transform active:scale-[0.97]"
          >
            {t("start")}
            <Arrow className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setPressed(true)}
            className="glass-card flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-sm font-semibold transition-transform active:scale-[0.97]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1a6.2 6.2 0 0 1 0-12.4c1.9 0 3.2.8 4 1.5l2.7-2.6C17 2.9 14.7 2 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.2-.2-1.7H12z"
              />
            </svg>
            {t("google")}
          </button>

          {pressed && (
            <p className="text-center text-[11px] text-muted-foreground">
              Google sign-in needs the backend enabled — ask me to turn it on.
            </p>
          )}

          <Link
            to="/app/recipes"
            className="block text-center text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("skip")}
          </Link>
        </div>
      </div>
    </main>
  );
}
