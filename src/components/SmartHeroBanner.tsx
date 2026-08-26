import { useEffect, useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import grandma from "@/assets/grandma-noura.jpg";
import { useI18n } from "@/lib/i18n";
import { bannerActive, ensureLifecycle } from "@/lib/loyalty";
import { AppGuideModal } from "./AppGuideModal";

/**
 * Shows the interactive teaching banner for the first 7 days after install or
 * a major update, then hands the same slot over to Google ads.
 */
export function SmartHeroBanner() {
  const { t } = useI18n();
  const [teaching, setTeaching] = useState<boolean | null>(null);
  const [guide, setGuide] = useState(false);

  useEffect(() => {
    ensureLifecycle();
    setTeaching(bannerActive());
  }, []);

  if (teaching === null) return null;
  if (!teaching) return <AdSlot label={t("adSlotLabel")} />;

  return (
    <>
      <button
        type="button"
        onClick={() => setGuide(true)}
        className="glass-card animate-rise grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl p-3 text-start transition-transform active:scale-[0.98]"
      >
        <span className="animate-float relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl">
          <img src={grandma} alt="" className="h-full w-full object-cover" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 text-[13px] font-bold">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" />
            {t("bannerGreeting")}
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
            {t("bannerBody")}
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-gold rtl:rotate-180" />
      </button>
      {guide && <AppGuideModal onClose={() => setGuide(false)} />}
    </>
  );
}

function AdSlot({ label }: { label: string }) {
  useEffect(() => {
    try {
      // @ts-expect-error injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocker or script not ready */
    }
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-secondary/40">
      <p className="px-3 pt-1.5 text-[9px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client="ca-pub-3752516321334006"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
