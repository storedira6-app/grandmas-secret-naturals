import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

import { useI18n } from "@/lib/i18n";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "gs_install_dismissed_at";
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

const COPY = {
  ar: {
    title: "ثبّتي التطبيق على شاشتك",
    sub: "وصول أسرع للجدة نورة ووصفات اليوم — بدون متجر تطبيقات.",
    cta: "تثبيت الآن",
    ios: "افتحي قائمة المشاركة ثم اختاري «إضافة إلى الشاشة الرئيسية».",
    close: "إغلاق",
  },
  en: {
    title: "Install the app on your phone",
    sub: "Faster access to Grandma Noura and daily recipes — no app store needed.",
    cta: "Install now",
    ios: "Tap the Share button, then choose “Add to Home Screen”.",
    close: "Close",
  },
  fr: {
    title: "Installez l'app sur votre écran",
    sub: "Accès rapide à Grand-mère Noura et aux recettes du jour.",
    cta: "Installer",
    ios: "Touchez Partager, puis « Sur l'écran d'accueil ».",
    close: "Fermer",
  },
  es: {
    title: "Instala la app en tu pantalla",
    sub: "Acceso rápido a la abuela Noura y las recetas del día.",
    cta: "Instalar",
    ios: "Toca Compartir y elige «Añadir a pantalla de inicio».",
    close: "Cerrar",
  },
} as const;

export function InstallPrompt() {
  const { lang } = useI18n();
  const copy = COPY[lang as keyof typeof COPY] ?? COPY.en;

  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_MS) return;

    const ua = window.navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (iosDevice) {
      setIsIos(true);
      timer = setTimeout(() => setOpen(true), 4000);
    }

    const onInstalled = () => setOpen(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome !== "accepted") localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDeferred(null);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="animate-rise fixed inset-x-3 bottom-24 z-50 sm:mx-auto sm:max-w-md">
      <div className="glass-card flex items-start gap-3 rounded-3xl p-4 shadow-xl">
        <img
          src="/icon-192.png"
          alt=""
          width={44}
          height={44}
          loading="lazy"
          className="h-11 w-11 shrink-0 rounded-2xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{copy.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{isIos ? copy.ios : copy.sub}</p>
          {!isIos && (
            <button
              onClick={install}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              {copy.cta}
            </button>
          )}
          {isIos && (
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent/60 px-3 py-1.5 text-xs font-bold text-accent-foreground">
              <Share className="h-3.5 w-3.5" />
              {copy.cta}
            </span>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label={copy.close}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent/50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
