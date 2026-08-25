import { useEffect, useState } from "react";
import { Leaf, ShieldCheck, Cookie, Gift } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ensureLifecycle, hasConsent, saveConsent } from "@/lib/loyalty";
import { requestPushPermission } from "@/lib/push";

export function LegalConsentModal() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  useEffect(() => {
    ensureLifecycle();
    if (!hasConsent()) setOpen(true);
  }, []);

  if (!open) return null;
  const ready = agree1 && agree2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/60 backdrop-blur-md sm:items-center"
    >
      <div className="glass-card animate-rise max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl">
        <div className="text-center">
          <span className="gradient-forest animate-glow mx-auto grid h-14 w-14 place-items-center rounded-full text-primary-foreground">
            <Leaf className="h-6 w-6" />
          </span>
          <h2 id="consent-title" className="mt-3 text-xl font-bold">
            {t("consentTitle")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("consentSub")}</p>
        </div>

        <div className="mt-4 space-y-2.5">
          <Section Icon={Cookie} title={t("consentPrivacyTitle")} body={t("consentPrivacyBody")} />
          <Section Icon={ShieldCheck} title={t("consentTermsTitle")} body={t("consentTermsBody")} />
          <Section Icon={Gift} title={t("consentLoyaltyTitle")} body={t("consentLoyaltyBody")} />
        </div>

        <div className="mt-4 space-y-2.5">
          <Check checked={agree1} onChange={setAgree1} label={t("consentCheck1")} />
          <Check checked={agree2} onChange={setAgree2} label={t("consentCheck2")} />
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            saveConsent();
            void requestPushPermission();
            setOpen(false);
          }}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all active:scale-[0.98] ${
            ready
              ? "gradient-forest animate-glow text-primary-foreground"
              : "cursor-not-allowed bg-secondary text-muted-foreground"
          }`}
        >
          {t("consentCta")}
        </button>
        {!ready && (
          <p className="mt-2 text-center text-[11px] font-semibold text-muted-foreground">
            {t("consentHint")}
          </p>
        )}
      </div>
    </div>
  );
}

function Section({
  Icon,
  title,
  body,
}: {
  Icon: typeof Cookie;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-3">
      <p className="flex items-center gap-2 text-[13px] font-bold">
        <Icon className="h-4 w-4 shrink-0 text-gold" />
        {title}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-2xl border border-border bg-card/70 p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
      />
      <span className="min-w-0 text-[12px] leading-relaxed font-semibold">{label}</span>
    </label>
  );
}
