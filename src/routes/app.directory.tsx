import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Star,
  Heart,
  Plus,
  List,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n, type Lang } from "@/lib/i18n";
import { COMMUNITY_PLACES, type CommunityPlace, type PlaceCategory } from "@/data/places";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/directory")({
  head: () => ({
    meta: [
      { title: "Community directory | سر الجدة — دليل الطبيعة" },
      {
        name: "description",
        content:
          "A community-driven directory of traditional herbalists, natural spas and oil distilleries — ratings, reviews and directions.",
      },
      { property: "og:title", content: "Community directory | سر الجدة" },
      {
        property: "og:description",
        content: "Herbalists, hammams and oil distilleries recommended by the community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DirectoryTab,
});

const L = {
  ar: {
    title: "دليل الطبيعة",
    sub: "أماكن موثوقة رشّحتها بنات المجتمع",
    suggest: "+ اقترحي معشبة أو سبا في مدينتك",
    suggestTitle: "اقترحي مكاناً",
    suggestSub: "شاركي المجتمع مكانك المفضل للجمال الطبيعي",
    fName: "اسم المكان",
    fCategory: "التصنيف",
    fCity: "المدينة / الحي",
    fPhoto: "رابط صورة (اختياري)",
    fWhy: "لماذا توصين بهذا المكان؟",
    submit: "إرسال الاقتراح",
    thanks: "شكراً لك 🌿 وصل اقتراحك للجدة نورة",
    list: "قائمة الأماكن",
    map: "الخريطة",
    all: "الكل",
    herbalist: "🌿 أشهر المعشبات العتيقة",
    spa: "🧖‍♀️ سبا وحمامات طبيعية",
    oils: "🍃 تقطير الزيوت والأعشاب",
    top: "⭐ الأكثر تقييماً",
    reviews: "تقييم",
    call: "اتصال",
    directions: "الاتجاهات",
    save: "حفظ",
    savedMsg: "أُضيف للمفضلة ❤️",
    unsavedMsg: "أُزيل من المفضلة",
  },
  en: {
    title: "Natural directory",
    sub: "Trusted spots recommended by the community",
    suggest: "+ Suggest a local spot",
    suggestTitle: "Suggest a place",
    suggestSub: "Share your favourite natural beauty spot",
    fName: "Place name",
    fCategory: "Category",
    fCity: "City / area",
    fPhoto: "Photo link (optional)",
    fWhy: "Why do you recommend it?",
    submit: "Send suggestion",
    thanks: "Thank you 🌿 your suggestion reached Grandma Noura",
    list: "Community list",
    map: "Map view",
    all: "All",
    herbalist: "🌿 Traditional herbalists",
    spa: "🧖‍♀️ Spas & baths",
    oils: "🍃 Oils & hydrosols",
    top: "⭐ Top rated",
    reviews: "reviews",
    call: "Call",
    directions: "Directions",
    save: "Save",
    savedMsg: "Added to favourites ❤️",
    unsavedMsg: "Removed from favourites",
  },
  fr: {
    title: "Annuaire naturel",
    sub: "Adresses recommandées par la communauté",
    suggest: "+ Proposez une adresse",
    suggestTitle: "Proposer une adresse",
    suggestSub: "Partagez votre lieu beauté naturelle préféré",
    fName: "Nom du lieu",
    fCategory: "Catégorie",
    fCity: "Ville / quartier",
    fPhoto: "Lien photo (optionnel)",
    fWhy: "Pourquoi le recommandez-vous ?",
    submit: "Envoyer",
    thanks: "Merci 🌿 votre suggestion est bien reçue",
    list: "Liste",
    map: "Carte",
    all: "Tout",
    herbalist: "🌿 Herboristeries",
    spa: "🧖‍♀️ Spas & hammams",
    oils: "🍃 Huiles & hydrolats",
    top: "⭐ Mieux notés",
    reviews: "avis",
    call: "Appeler",
    directions: "Itinéraire",
    save: "Garder",
    savedMsg: "Ajouté aux favoris ❤️",
    unsavedMsg: "Retiré des favoris",
  },
  es: {
    title: "Directorio natural",
    sub: "Lugares recomendados por la comunidad",
    suggest: "+ Sugiere un lugar",
    suggestTitle: "Sugerir un lugar",
    suggestSub: "Comparte tu lugar favorito de belleza natural",
    fName: "Nombre del lugar",
    fCategory: "Categoría",
    fCity: "Ciudad / zona",
    fPhoto: "Enlace de foto (opcional)",
    fWhy: "¿Por qué lo recomiendas?",
    submit: "Enviar sugerencia",
    thanks: "Gracias 🌿 hemos recibido tu sugerencia",
    list: "Lista",
    map: "Mapa",
    all: "Todo",
    herbalist: "🌿 Herbolarios",
    spa: "🧖‍♀️ Spas y baños",
    oils: "🍃 Aceites e hidrolatos",
    top: "⭐ Mejor valorados",
    reviews: "reseñas",
    call: "Llamar",
    directions: "Cómo llegar",
    save: "Guardar",
    savedMsg: "Añadido a favoritos ❤️",
    unsavedMsg: "Eliminado de favoritos",
  },
};

const CHIPS: (PlaceCategory | "all")[] = ["all", "herbalist", "spa", "oils", "top"];

const PIN_POS: Record<string, { x: number; y: number }> = {
  "attar-fes": { x: 24, y: 30 },
  "hammam-marrakech": { x: 55, y: 24 },
  "oils-taroudant": { x: 38, y: 62 },
  "attar-riyadh": { x: 78, y: 44 },
  "spa-tunis": { x: 66, y: 72 },
  "oils-cairo": { x: 18, y: 70 },
};

function DirectoryTab() {
  const { lang } = useI18n();
  const s = L[lang];
  const [filter, setFilter] = useState<PlaceCategory | "all">("all");
  const [view, setView] = useState<"list" | "map">("list");
  const [saved, setSaved] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const places = useMemo(() => {
    if (filter === "top") {
      return [...COMMUNITY_PLACES].sort((a, b) => b.rating - a.rating).slice(0, 3);
    }
    return COMMUNITY_PLACES.filter((p) => filter === "all" || p.category === filter);
  }, [filter]);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const has = prev.includes(id);
      toast.success(has ? s.unsavedMsg : s.savedMsg);
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">{s.title}</h1>
          <p className="text-xs text-muted-foreground">{s.sub}</p>
        </div>
        <div className="glass-card flex shrink-0 gap-1 rounded-2xl p-1">
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-label={v === "list" ? s.list : s.map}
              className={`grid h-8 w-8 place-items-center rounded-xl transition-all active:scale-90 ${
                view === v ? "gradient-forest text-primary-foreground" : "text-primary"
              }`}
            >
              {v === "list" ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="gradient-gold glow-ring flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold text-gold-foreground transition-transform active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">{s.suggest}</span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-[92vw] rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{s.suggestTitle}</DialogTitle>
            <DialogDescription>{s.suggestSub}</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              toast.success(s.thanks);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="sp-name">{s.fName}</Label>
              <Input id="sp-name" required className="rounded-2xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sp-cat">{s.fCategory}</Label>
                <select
                  id="sp-cat"
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm"
                >
                  <option value="herbalist">{s.herbalist}</option>
                  <option value="spa">{s.spa}</option>
                  <option value="oils">{s.oils}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sp-city">{s.fCity}</Label>
                <Input id="sp-city" required className="rounded-2xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sp-photo">{s.fPhoto}</Label>
              <Input id="sp-photo" type="url" placeholder="https://" className="rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sp-why">{s.fWhy}</Label>
              <Textarea id="sp-why" rows={3} required className="rounded-2xl" />
            </div>
            <button
              type="submit"
              className="gradient-forest w-full rounded-2xl py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              {s.submit}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
              filter === c ? "gradient-forest text-primary-foreground" : "glass-card text-primary"
            }`}
          >
            {s[c]}
          </button>
        ))}
      </div>

      {view === "map" ? (
        <div className="glass-card relative h-72 overflow-hidden rounded-3xl">
          <div className="gradient-warm absolute inset-0" />
          <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
            <defs>
              <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="oklch(0.42 0.075 150 / 0.18)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path
              d="M-10 170 C 90 100, 170 210, 340 120"
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
              onClick={() => setActive(active === p.id ? null : p.id)}
              aria-label={p.name[lang]}
              className={`absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-all duration-300 ${
                active === p.id
                  ? "gradient-gold glow-ring scale-125 text-gold-foreground"
                  : "gradient-forest animate-float text-primary-foreground"
              }`}
              style={{ left: `${PIN_POS[p.id]?.x ?? 50}%`, top: `${PIN_POS[p.id]?.y ?? 50}%` }}
            >
              <MapPin className="h-4 w-4" />
            </button>
          ))}
          {active && (
            <div className="glass-card animate-rise absolute inset-x-3 bottom-3 rounded-2xl p-3">
              {(() => {
                const p = COMMUNITY_PLACES.find((x) => x.id === active)!;
                return (
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{p.name[lang]}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{p.city[lang]}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(p.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gradient-gold grid h-9 w-9 shrink-0 place-items-center rounded-full text-gold-foreground"
                      aria-label={s.directions}
                    >
                      <Navigation className="h-4 w-4" />
                    </a>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {places.map((p, i) => (
            <PlaceCard
              key={p.id}
              place={p}
              lang={lang}
              s={s}
              index={i}
              saved={saved.includes(p.id)}
              onToggleSave={() => toggleSave(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlaceCard({
  place: p,
  lang,
  s,
  index,
  saved,
  onToggleSave,
}: {
  place: CommunityPlace;
  lang: Lang;
  s: (typeof L)["en"];
  index: number;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article
      className="glass-card animate-rise overflow-hidden rounded-2xl"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={p.image}
          alt={p.name[lang]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span
          className={`absolute top-3 start-3 inline-flex max-w-[80%] items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            p.badgeTone === "gold"
              ? "gradient-gold text-gold-foreground"
              : "gradient-forest text-primary-foreground"
          }`}
        >
          <Sparkles className="h-3 w-3 shrink-0" />
          <span className="truncate">{p.badge[lang]}</span>
        </span>
        <button
          type="button"
          onClick={onToggleSave}
          aria-label={s.save}
          className="glass-card absolute top-3 end-3 grid h-9 w-9 place-items-center rounded-full transition-transform active:scale-90"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current text-gold" : "text-primary"}`} />
        </button>
        <div className="absolute inset-x-3 bottom-3">
          <h3 className="truncate text-base font-bold text-primary-foreground drop-shadow">
            {p.name[lang]}
          </h3>
          <p className="truncate text-[11px] text-primary-foreground/85">{p.city[lang]}</p>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/60 px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
            <Star className="h-3 w-3 fill-current" />
            {p.rating.toFixed(1)} ({p.reviews} {s.reviews})
          </span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
            {s[p.category]}
          </span>
        </div>

        <p className="border-s-2 border-gold/60 ps-2 text-xs leading-relaxed text-muted-foreground italic">
          “{p.note[lang]}”
        </p>

        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${p.phone}`}
            className="gradient-forest flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
          >
            <Phone className="h-3.5 w-3.5" />
            {s.call}
          </a>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(p.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-gold flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold text-gold-foreground transition-transform active:scale-95"
          >
            <Navigation className="h-3.5 w-3.5" />
            {s.directions}
          </a>
          <button
            type="button"
            onClick={onToggleSave}
            className="glass-card flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold text-primary transition-transform active:scale-95"
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-current text-gold" : ""}`} />
            {s.save}
          </button>
        </div>
      </div>
    </article>
  );
}
