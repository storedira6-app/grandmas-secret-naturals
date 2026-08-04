import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Navigation, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PLACES, type Place } from "@/data/content";

export const Route = createFileRoute("/app/directory")({
  head: () => ({
    meta: [
      { title: "Natural directory | سر الجدة — دليل الطبيعة" },
      {
        name: "description",
        content: "Find herbalist shops, organic spas and thermal baths near you, with ratings and contacts.",
      },
      { property: "og:title", content: "Natural directory | سر الجدة" },
      { property: "og:description", content: "Herbalists, organic spas and thermal baths near you." },
    ],
  }),
  component: DirectoryTab,
});

const FILTERS = ["all", "herbalist", "spa", "bath"] as const;

function DirectoryTab() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [active, setActive] = useState<Place | null>(null);

  const places = PLACES.filter((p) => filter === "all" || p.type === filter);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{t("mapTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("mapSub")}</p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
              filter === f
                ? "gradient-forest text-primary-foreground"
                : "glass-card text-primary"
            }`}
          >
            {t(f)}
          </button>
        ))}
      </div>

      <div className="glass-card relative h-56 overflow-hidden rounded-3xl">
        <div className="gradient-warm absolute inset-0" />
        <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
          <defs>
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0H0V28" fill="none" stroke="oklch(0.42 0.075 150 / 0.18)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path
            d="M-10 150 C 80 90, 160 190, 320 110"
            fill="none"
            stroke="oklch(0.42 0.075 150 / 0.35)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        {places.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p)}
            aria-label={p.name[lang]}
            className={`absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-all duration-300 ${
              active?.id === p.id
                ? "gradient-gold scale-125 glow-ring text-gold-foreground"
                : "gradient-forest text-primary-foreground animate-float"
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <MapPin className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {places.map((p, i) => (
          <article
            key={p.id}
            className={`glass-card animate-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl p-3 ${
              active?.id === p.id ? "glow-ring" : ""
            }`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <button type="button" onClick={() => setActive(p)} className="min-w-0 text-start">
              <h3 className="truncate text-sm font-bold">{p.name[lang]}</h3>
              <p className="truncate text-[11px] text-muted-foreground">
                {t(p.type)} · {p.area[lang]}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                <Star className="h-3 w-3 fill-current" />
                {p.rating}
              </span>
            </button>
            <div className="flex shrink-0 gap-2">
              <a
                href={`tel:${p.phone}`}
                aria-label={t("call")}
                className="gradient-forest grid h-9 w-9 place-items-center rounded-full text-primary-foreground transition-transform active:scale-90"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(p.name.en)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("directions")}
                className="gradient-gold grid h-9 w-9 place-items-center rounded-full text-gold-foreground transition-transform active:scale-90"
              >
                <Navigation className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
