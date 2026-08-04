import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Language"
        className="glass-card flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary transition-transform active:scale-95"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{current.label}</span>
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="glass-card animate-rise absolute end-0 top-11 z-50 w-40 overflow-hidden rounded-2xl p-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLang(l.code as Lang);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-secondary"
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  {l.label}
                </span>
                {l.code === lang && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
