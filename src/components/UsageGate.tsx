import { useEffect, useState } from "react";
import { PlayCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import {
  USES_PER_VIDEO,
  VIDEO_WATCH_SECONDS,
  openSponsoredVideo,
  type UsageFeature,
} from "@/lib/usage";

type Props = {
  feature: UsageFeature;
  left: number;
  ready: boolean;
  onUnlock: (amount?: number) => void;
};

/** Shows the remaining daily runs and a "watch a video" unlock card. */
export function UsageGate({ left, ready, onUnlock }: Props) {
  const { t } = useI18n();
  const [waiting, setWaiting] = useState(0);

  useEffect(() => {
    if (waiting <= 0) return;
    const id = setTimeout(() => setWaiting((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [waiting]);

  useEffect(() => {
    if (waiting !== 0) return;
    // no-op: unlock is granted in the tick handler below
  }, [waiting]);

  const watch = () => {
    if (waiting > 0) return;
    openSponsoredVideo();
    setWaiting(VIDEO_WATCH_SECONDS);
    window.setTimeout(() => {
      onUnlock(USES_PER_VIDEO);
      setWaiting(0);
      toast.success(t("usageUnlocked").replace("{n}", String(USES_PER_VIDEO)));
    }, VIDEO_WATCH_SECONDS * 1000);
  };

  if (!ready) return null;

  if (left > 0) {
    return (
      <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        {t("usageLeft").replace("{n}", String(left))}
      </p>
    );
  }

  return (
    <div className="glass-card animate-rise space-y-2 rounded-3xl p-4 text-center">
      <p className="text-sm font-bold text-primary">{t("usageDone")}</p>
      <p className="text-xs text-muted-foreground">{t("usageUnlockHint")}</p>
      <button
        type="button"
        onClick={watch}
        disabled={waiting > 0}
        className="gradient-gold mx-auto flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-gold-foreground transition-transform active:scale-95 disabled:opacity-60"
      >
        <PlayCircle className="h-4 w-4" />
        {waiting > 0 ? `${t("usageWatching")} ${waiting}s` : t("usageWatch")}
      </button>
    </div>
  );
}
