import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Gift, Sparkles, Trophy, ShieldCheck, Users, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useGlow } from "@/lib/glow";
import {
  POINT_VALUE_USD,
  REQUIRED_PURCHASES,
  WITHDRAW_TARGET_POINTS,
  WITHDRAW_TARGET_USD,
  boxMsRemaining,
  markWithdrawalRequested,
  openMysteryBox,
  referralLink,
  withdrawalStatus,
} from "@/lib/loyalty";

export const Route = createFileRoute("/app/wallet")({
  head: () => ({
    meta: [
      { title: "جوائز نقاط التألق | Glow Points Rewards — سر الجدة" },
      {
        name: "description",
        content:
          "Your Glow Points wallet: daily mystery box, points from real store purchases and progress toward the $50 reward.",
      },
      { property: "og:title", content: "Glow Points Rewards — Grandma's Secret" },
      {
        property: "og:description",
        content: "Collect Glow Points from the app and the store, then redeem rewards.",
      },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const { t } = useI18n();
  const { points, award } = useGlow();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [link, setLink] = useState("");

  useEffect(() => setLink(referralLink()), []);

  const onCopy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success(t("walletReferCopied"));
  };

  const onShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: t("walletReferTitle"), text: t("walletReferSub"), url: link });
    } else {
      await onCopy();
    }
  };

  useEffect(() => {
    const update = () => setRemaining(boxMsRemaining());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [tick]);

  const status = withdrawalStatus(points);
  const canOpen = remaining === 0;
  const hours = remaining ? Math.ceil(remaining / 3_600_000) : 0;

  const onOpenBox = () => {
    try {
      const reward = openMysteryBox();
      setTick((v) => v + 1);
      if (reward.kind === "discount") {
        award(reward.points, `${t("walletBoxDiscount")} — ${reward.code}`);
      } else if (reward.kind === "cash") {
        award(reward.points, t("walletBoxCash"));
      } else {
        award(reward.points, t("walletBoxPoints"));
      }
    } catch {
      toast(t("walletBoxWait"));
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Trophy className="h-5 w-5 text-gold" />
          {t("walletTitle")}
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">{t("walletSub")}</p>
      </header>

      <section className="glass-card rounded-3xl p-4 text-center">
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          {t("walletPoints")}
        </p>
        <p className="text-gradient-gold text-5xl font-bold">🌟 {points}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {t("walletValue")}: ${(points * POINT_VALUE_USD).toFixed(2)}
        </p>
      </section>

      <section className="glass-card rounded-3xl p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Gift className="h-4 w-4 text-gold" />
          {t("walletBoxTitle")}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{t("walletBoxSub")}</p>
        <button
          type="button"
          onClick={onOpenBox}
          disabled={!canOpen}
          className={`mt-3 w-full rounded-2xl py-3.5 text-sm font-bold transition-transform active:scale-[0.98] ${
            canOpen
              ? "gradient-gold animate-glow text-gold-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {canOpen ? t("walletBoxOpen") : `${t("walletBoxWait")} ${hours} ${t("walletBoxHours")}`}
        </button>
      </section>

      <section className="glass-card rounded-3xl p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Sparkles className="h-4 w-4 text-gold" />
          {t("walletProgress")}
        </p>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="gradient-forest h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.round(status.progress * 100)}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <Stat label="🌟" value={`${points} / ${WITHDRAW_TARGET_POINTS}`} />
          <Stat label={t("walletPurchases")} value={`${status.purchases} / ${REQUIRED_PURCHASES}`} />
        </div>
        <p className="mt-3 text-[11px] font-semibold text-muted-foreground">
          {status.eligible ? t("walletEligible") : t("walletNotEligible")}
        </p>
        <button
          type="button"
          disabled={!status.eligible || status.requested}
          onClick={() => {
            markWithdrawalRequested();
            toast.success(t("walletWithdrawSent"));
          }}
          className={`mt-3 w-full rounded-2xl py-3.5 text-sm font-bold transition-transform active:scale-[0.98] ${
            status.eligible && !status.requested
              ? "gradient-forest text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {t("walletWithdraw")} (${WITHDRAW_TARGET_USD})
        </button>
      </section>

      <section className="glass-card rounded-3xl border border-gold/30 p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Users className="h-4 w-4 text-gold" />
          {t("walletReferTitle")}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{t("walletReferSub")}</p>
        <p className="mt-2 truncate rounded-2xl bg-secondary/70 px-3 py-2 text-[11px] font-semibold">
          {link || "..."}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="gradient-gold rounded-2xl py-3 text-xs font-bold text-gold-foreground transition-transform active:scale-95"
          >
            {t("walletReferCopy")}
          </button>
          <button
            type="button"
            onClick={onShare}
            className="gradient-forest flex items-center justify-center gap-1.5 rounded-2xl py-3 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
          >
            <Share2 className="h-3.5 w-3.5" />
            {t("walletReferShare")}
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-secondary/60 p-4">
        <p className="flex items-center gap-2 text-[13px] font-bold">
          <ShieldCheck className="h-4 w-4 text-gold" />
          {t("walletTerms")}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {t("consentLoyaltyBody")}
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-2.5">
      <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
