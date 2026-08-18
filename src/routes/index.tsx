import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Sparkles, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-natural.jpg";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GoogleSignInButton } from "@/components/SignIn";
import { useAuth } from "@/lib/auth";

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
  const { user } = useAuth();
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
          <h1 className="text-4xl leading-tight font-bold text-foreground">
            {t("brand")}
            <span className="sr-only"> — 100% natural beauty rituals, recipes and remedies</span>
          </h1>
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
            to="/app/quiz"
            className="glass-card animate-spring flex items-center gap-3 rounded-3xl p-3 text-start transition-transform active:scale-[0.98]"
          >
            <span className="gradient-gold grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-gold-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{t("quizTitle")}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{t("quizSub")}</span>
            </span>
          </Link>

          <Link
            to={user ? "/app/dashboard" : "/app/chat"}
            className="gradient-forest animate-glow flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-primary-foreground transition-transform active:scale-[0.97]"
          >
            {t("start")}
            <Arrow className="h-4 w-4" />
          </Link>


          {user ? (
            <p className="text-center text-[11px] text-muted-foreground">
              {t("hello")} {(user.user_metadata?.["full_name"] as string) ?? user.email}
            </p>
          ) : (
            <GoogleSignInButton />
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
