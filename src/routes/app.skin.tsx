import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Camera,
  Microscope,
  Sparkles,
  Sun,
  Moon,
  CalendarHeart,
  AlertTriangle,
  LogOut,
  History,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useGlow } from "@/lib/glow";
import { SignInCard } from "@/components/SignIn";
import { supabase } from "@/integrations/supabase/client";
import { analyzeSkin } from "@/lib/skin.functions";
import { preparePhoto, type PreparedPhoto } from "@/lib/image-quality";
import { ProductRecommendations } from "@/components/store/ProductRecommendations";
import { showInterstitial } from "@/lib/ads";
import type { SkinMetric, SkinReport } from "@/lib/skin.server";

export const Route = createFileRoute("/app/skin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Skin Analysis AI — تحليل بشرتك | سر الجدة" },
      {
        name: "description",
        content:
          "AI skin microscope: analyze wrinkles, dark spots, pores, hydration and redness from a photo and get a personalized natural morning and night routine.",
      },
      { property: "og:title", content: "Skin Analysis AI — Grandma's Secret" },
      {
        property: "og:description",
        content: "Photo-based skin analysis with a personalized natural day and night routine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkinTab,
});

const AREAS = [
  { key: "face", label: "areaFace", emoji: "🙂" },
  { key: "hands", label: "areaHands", emoji: "🤲" },
  { key: "feet", label: "areaFeet", emoji: "🦶" },
  { key: "neck", label: "areaNeck", emoji: "💫" },
  { key: "scalp", label: "areaScalp", emoji: "💇‍♀️" },
  { key: "body", label: "areaBody", emoji: "✨" },
] as const;

type Area = (typeof AREAS)[number]["key"];

type SavedRow = {
  id: string;
  area: string;
  skin_type: string | null;
  summary: string | null;
  metrics: SkinMetric[];
  report: SkinReport;
  thumbnail: string | null;
  created_at: string;
};

function scoreColor(score: number) {
  if (score >= 70) return "bg-primary";
  if (score >= 45) return "bg-gold";
  return "bg-destructive";
}

function SkinTab() {
  const { t, lang } = useI18n();
  const { user, loading, signOut } = useAuth();
  const { award } = useGlow();
  const qc = useQueryClient();
  const runAnalysis = useServerFn(analyzeSkin);
  const fileRef = useRef<HTMLInputElement>(null);

  const [area, setArea] = useState<Area>("face");
  const [photo, setPhoto] = useState<PreparedPhoto | null>(null);
  const [report, setReport] = useState<SkinReport | null>(null);

  const history = useQuery({
    queryKey: ["skin-analyses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skin_analyses")
        .select("id, area, skin_type, summary, metrics, report, thumbnail, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as unknown as SavedRow[];
    },
  });

  const previous = history.data?.[0];

  const analyze = useMutation({
    mutationFn: async () => {
      if (!photo) throw new Error("no photo");
      const [result] = await Promise.all([
        runAnalysis({
          data: {
            imageBase64: photo.base64,
            mimeType: photo.mimeType,
            lang,
            area,
            lightingHint: photo.hint,
          },
        }),
        showInterstitial(),
      ]);
      if (user) {
        await supabase.from("skin_analyses").insert({
          user_id: user.id,
          area,
          skin_type: result.skinType,
          summary: result.summary,
          metrics: result.metrics,
          report: result,
          thumbnail: photo.preview.length < 180_000 ? photo.preview : null,
        } as never);
      }
      return result;
    },
    onSuccess: (result) => {
      setReport(result);
      award(20, t("glowSkin"));
      void qc.invalidateQueries({ queryKey: ["skin-analyses", user?.id] });
    },
    onError: (e) => {
      console.error(e);
      toast.error(t("skinFailed"));
    },
  });

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const prepared = await preparePhoto(file);
      setPhoto(prepared);
      setReport(null);
    } catch (e) {
      console.error(e);
      toast.error(t("skinFailed"));
    }
  };

  return (
    <div className="space-y-4">
      <header className="glass-card animate-rise space-y-1 rounded-3xl p-4">
        <div className="flex items-center gap-2">
          <span className="gradient-forest grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-primary-foreground">
            <Microscope className="h-4 w-4" />
          </span>
          <h1 className="min-w-0 truncate text-lg font-bold">{t("skinTitle")}</h1>
        </div>
        <p className="text-xs text-muted-foreground">{t("skinSub")}</p>
        <p className="text-[10px] text-muted-foreground">{t("skinDisclaimer")}</p>
      </header>

      {/* Area picker */}
      <section className="glass-card space-y-2 rounded-3xl p-3">
        <p className="text-xs font-bold text-primary">{t("skinArea")}</p>
        <div className="grid grid-cols-3 gap-2">
          {AREAS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setArea(a.key)}
              className={`rounded-2xl px-2 py-2 text-[11px] font-semibold transition-all active:scale-95 ${
                area === a.key
                  ? "gradient-forest text-primary-foreground glow-ring"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <span className="block text-base leading-tight">{a.emoji}</span>
              <span className="block truncate">{t(a.label)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Capture */}
      <section className="glass-card space-y-3 rounded-3xl p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">{t("skinTips")}</p>
        {photo && (
          <div className="space-y-2">
            <img
              src={photo.preview}
              alt=""
              className="h-52 w-full rounded-2xl object-cover"
            />
            <div className="space-y-1 rounded-2xl bg-secondary/60 p-2.5">
              <p className="text-[11px] font-bold text-primary">{t("skinQuality")}</p>
              {photo.warnings.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">{t("qGood")}</p>
              ) : (
                <ul className="space-y-0.5">
                  {photo.warnings.map((w) => (
                    <li key={w} className="text-[11px] text-destructive">
                      ⚠️ {t(w)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={analyze.isPending}
            className="glass-card flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold text-primary transition-transform active:scale-95 disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
            <span className="truncate">{photo ? t("skinRetake") : t("skinUpload")}</span>
          </button>
          <button
            type="button"
            disabled={!photo || analyze.isPending}
            onClick={() => analyze.mutate()}
            className="gradient-gold flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold text-gold-foreground transition-transform active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span className="truncate">{t("skinAnalyze")}</span>
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="user"
          hidden
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </section>

      {analyze.isPending && (
        <div className="glass-card animate-rise relative flex items-center gap-2 overflow-hidden rounded-3xl px-4 py-3 text-xs font-semibold text-primary">
          <Microscope className="h-4 w-4 animate-pulse" />
          {t("skinAnalyzing")}
          <span className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gold" />
        </div>
      )}

      {report && <ReportView report={report} previous={previous} />}

      {!loading && !user && (
        <section className="space-y-2">
          <p className="text-center text-xs text-muted-foreground">{t("skinSignIn")}</p>
          <SignInCard />
        </section>
      )}

      {user && (
        <section className="glass-card space-y-2 rounded-3xl p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            <History className="h-4 w-4 text-gold" />
            {t("skinHistory")}
          </p>
          {(history.data?.length ?? 0) === 0 ? (
            <p className="text-xs text-muted-foreground">{t("skinNoHistory")}</p>
          ) : (
            <ul className="space-y-2">
              {history.data!.map((row) => (
                <li key={row.id} className="flex items-center gap-2.5 rounded-2xl bg-secondary/50 p-2">
                  {row.thumbnail ? (
                    <img src={row.thumbnail} alt="" className="h-11 w-11 rounded-xl object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/60">🌿</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">
                      {t(`area${row.area.charAt(0).toUpperCase()}${row.area.slice(1)}`)} ·{" "}
                      {row.skin_type}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReport(row.report)}
                    className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary"
                  >
                    {t("skinQuality")}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-2.5 text-xs font-semibold text-muted-foreground transition-transform active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t("signOut")}
          </button>
        </section>
      )}
    </div>
  );
}

function ReportView({ report, previous }: { report: SkinReport; previous?: SavedRow }) {
  const { t } = useI18n();
  const prevMetrics = new Map((previous?.metrics ?? []).map((m) => [m.key, m.score]));

  return (
    <div className="animate-rise space-y-3">
      <section className="glass-card space-y-2 rounded-3xl p-4">
        <p className="text-sm leading-relaxed">{report.greeting}</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            {t("skinType")}: {report.skinType}
          </span>
          <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-gold">
            {t("skinAge")}: {report.apparentAge}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{report.skinTypeNote}</p>
        {report.imageQuality && (
          <p className="text-[11px] text-muted-foreground">📷 {report.imageQuality}</p>
        )}
      </section>

      <section className="glass-card space-y-2.5 rounded-3xl p-4">
        <p className="text-sm font-bold">{t("skinMetrics")}</p>
        {report.metrics.map((m) => {
          const prev = prevMetrics.get(m.key);
          const delta = typeof prev === "number" ? m.score - prev : null;
          return (
            <div key={m.key} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="min-w-0 truncate font-semibold">{m.label}</span>
                <span className="flex shrink-0 items-center gap-1 font-bold">
                  {delta !== null && delta !== 0 && (
                    <span
                      className={`flex items-center gap-0.5 text-[10px] ${
                        delta > 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {delta > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(delta)}
                    </span>
                  )}
                  {m.score}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreColor(m.score)}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{m.note}</p>
            </div>
          );
        })}
        {previous && <p className="text-[10px] text-muted-foreground">↕ {t("skinProgress")}</p>}
      </section>

      {report.concerns.length > 0 && (
        <section className="glass-card space-y-2 rounded-3xl p-4">
          <p className="text-sm font-bold">{t("skinConcerns")}</p>
          {report.concerns.map((c) => (
            <div key={c.title} className="rounded-2xl bg-secondary/50 p-2.5">
              <p className="text-xs font-bold text-primary">{c.title}</p>
              <p className="text-[11px] text-muted-foreground">{c.detail}</p>
            </div>
          ))}
        </section>
      )}

      {report.summary && (
        <section className="glass-card rounded-3xl p-4 text-xs leading-relaxed">
          {report.summary}
        </section>
      )}

      <RoutineList title={t("skinMorning")} Icon={Sun} steps={report.morning} />
      <RoutineList title={t("skinEvening")} Icon={Moon} steps={report.evening} />
      {report.weekly.length > 0 && (
        <RoutineList title={t("skinWeekly")} Icon={CalendarHeart} steps={report.weekly} />
      )}

      {report.recipeIngredients.length > 0 && (
        <section className="glass-card space-y-2 rounded-3xl p-4">
          <p className="text-sm font-bold">{t("skinRecipe")}</p>
          <p className="text-xs font-semibold text-primary">{report.recipeTitle}</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {report.recipeIngredients.map((i) => (
              <li key={i}>🌿 {i}</li>
            ))}
          </ul>
          <ProductRecommendations
            ingredients={report.recipeIngredients}
            seed={report.recipeTitle}
          />
        </section>
      )}

      {report.precaution && (
        <section className="flex gap-2 rounded-3xl border border-gold/40 bg-gold/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div>
            <p className="text-[11px] font-bold text-gold">{t("skinPrecaution")}</p>
            <p className="text-[11px] text-muted-foreground">{report.precaution}</p>
          </div>
        </section>
      )}

      {report.storeNote && (
        <p className="glass-card rounded-3xl p-3 text-[11px] text-muted-foreground">
          🛍️ {report.storeNote}
        </p>
      )}
    </div>
  );
}

function RoutineList({
  title,
  Icon,
  steps,
}: {
  title: string;
  Icon: typeof Sun;
  steps: string[];
}) {
  if (steps.length === 0) return null;
  return (
    <section className="glass-card space-y-2 rounded-3xl p-4">
      <p className="flex items-center gap-1.5 text-sm font-bold">
        <Icon className="h-4 w-4 text-gold" />
        {title}
      </p>
      <ol className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-2 text-xs leading-relaxed">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {i + 1}
            </span>
            <span className="min-w-0">{s}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
