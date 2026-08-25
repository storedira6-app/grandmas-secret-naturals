import { Home, Sparkles, Camera, MessageCircleHeart, Gift, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function AppGuideModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();

  const items = [
    { Icon: Home, title: t("guideHome"), desc: t("guideHomeD") },
    { Icon: Sparkles, title: t("guideRoutine"), desc: t("guideRoutineD") },
    { Icon: Camera, title: t("guideCamera"), desc: t("guideCameraD") },
    { Icon: MessageCircleHeart, title: t("guideAsk"), desc: t("guideAskD") },
    { Icon: Gift, title: t("guideWallet"), desc: t("guideWalletD") },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-foreground/50 backdrop-blur-sm sm:items-center"
    >
      <div className="glass-card animate-rise max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold">{t("guideTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("guideSub")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="mt-4 space-y-2.5">
          {items.map(({ Icon, title, desc }, i) => (
            <li
              key={title}
              className="animate-rise flex items-start gap-3 rounded-2xl bg-secondary/60 p-3"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="gradient-gold grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-gold-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold">{title}</span>
                <span className="block text-[11px] leading-relaxed text-muted-foreground">
                  {desc}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="gradient-forest mt-4 w-full rounded-2xl py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {t("guideClose")}
        </button>
      </div>
    </div>
  );
}
