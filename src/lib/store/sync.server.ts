import { retailPrice } from "./pricing";
import { fetchCodePartnersProducts } from "./code-partners.server";
import { fetchZidProducts } from "./zid.server";
import type { SupplierProduct } from "./supplier-types";

/** Regions the dropshipping catalog ships to. */
export const DROPSHIP_REGIONS = ["SA", "AE", "KW", "QA", "BH", "OM", "MA", "EG"];

export type SyncResult = { source: string; items: number; ok: boolean; message?: string };

function toRow(p: SupplierProduct) {
  return {
    source: p.source,
    external_id: p.external_id,
    name: p.name,
    description: p.description,
    image_url: p.image_url,
    currency: p.currency,
    base_cost: p.base_cost,
    // 80% profit margin, ceiling-rounded to the nearest 0.50.
    price: retailPrice(p.base_cost),
    category: p.category,
    tags: p.tags,
    url: p.url,
    regions: DROPSHIP_REGIONS,
    in_stock: p.in_stock,
    active: true,
    updated_at: new Date().toISOString(),
  };
}

async function upsert(products: SupplierProduct[]) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const rows = products.filter((p) => p.base_cost > 0).map(toRow);
  for (let i = 0; i < rows.length; i += 200) {
    const { error } = await supabaseAdmin
      .from("store_products")
      .upsert(rows.slice(i, i + 200), { onConflict: "source,external_id" });
    if (error) throw new Error(error.message);
  }
  return rows.length;
}

async function log(result: SyncResult) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("store_sync_runs").insert({
    source: result.source,
    items_synced: result.items,
    ok: result.ok,
    message: result.message ?? null,
  });
}

async function runOne(source: "code" | "zid", fetcher: () => Promise<SupplierProduct[]>): Promise<SyncResult> {
  try {
    const products = await fetcher();
    const items = await upsert(products);
    const result: SyncResult = { source, items, ok: true };
    await log(result);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[store-sync:${source}]`, message);
    const result: SyncResult = { source, items: 0, ok: false, message };
    await log(result);
    return result;
  }
}

/** Ingests both supplier catalogs and applies the 80% retail margin. */
export async function syncAllSuppliers(): Promise<SyncResult[]> {
  return Promise.all([
    runOne("code", fetchCodePartnersProducts),
    runOne("zid", fetchZidProducts),
  ]);
}
