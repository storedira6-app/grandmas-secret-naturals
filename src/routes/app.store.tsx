import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { GLOBAL_BRANDS } from "@/data/global-brands";
import { GrandmaPicks } from "@/components/store/GrandmaPicks";
import { GlobalBrandMarket } from "@/components/store/GlobalBrandMarket";

export const Route = createFileRoute("/app/store")({
  head: () => ({
    meta: [
      { title: "Global Beauty Market | سر الجدة — متجر الجمال العالمي" },
      {
        name: "description",
        content:
          "Shop clean, natural beauty from our trusted global partner brands, handpicked by Grandma Noura.",
      },
      { property: "og:title", content: "Global Beauty Market | سر الجدة" },
      {
        property: "og:description",
        content: "Trusted international clean-beauty brands picked for your skin and hair.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://grandmas-secret-naturals.lovable.app/app/store" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://grandmas-secret-naturals.lovable.app/app/store" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Global Beauty Market partner brands",
          itemListElement: GLOBAL_BRANDS.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Brand", name: b.brand, url: b.url },
          })),
        }),
      },
    ],
  }),
  component: StoreTab,
});

function StoreTab() {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <header className="animate-rise min-w-0">
        <h1 className="text-xl font-bold">{t("globalMarket")}</h1>
        <p className="text-xs text-muted-foreground">{t("globalMarketSub")}</p>
      </header>

      <GlobalBrandMarket />

      <GrandmaPicks />

      <a
        href="https://ko-fi.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="gradient-warm animate-rise flex items-center gap-3 rounded-3xl border border-gold/40 p-3"
      >
        <span className="gradient-gold grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-gold-foreground">
          <Megaphone className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {t("sponsor")}
          </span>
          <span className="block truncate text-sm font-semibold">{t("sponsorText")}</span>
        </span>
      </a>
    </div>
  );
}
