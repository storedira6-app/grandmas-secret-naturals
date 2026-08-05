import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export function GoogleSignInButton({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          const result = await signInWithGoogle();
          if (result.error) setError(result.error.message);
          setBusy(false);
        }}
        className={`glass-card flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-sm font-semibold transition-transform active:scale-[0.97] disabled:opacity-60 ${className}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1a6.2 6.2 0 0 1 0-12.4c1.9 0 3.2.8 4 1.5l2.7-2.6C17 2.9 14.7 2 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.2-.2-1.7H12z"
          />
        </svg>
        {t("google")}
      </button>
      {error && <p className="text-center text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

export function SignInCard() {
  const { t } = useI18n();
  return (
    <section className="glass-card animate-rise space-y-3 rounded-3xl p-5 text-center">
      <h2 className="text-base font-bold">{t("signInTitle")}</h2>
      <p className="text-xs text-muted-foreground">{t("signInSub")}</p>
      <GoogleSignInButton />
    </section>
  );
}
