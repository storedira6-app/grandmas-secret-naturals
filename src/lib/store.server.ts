import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { StoreProduct } from "./store.functions";

/** Publishable-key client for public catalog reads (RLS as anon). */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export async function getPublicProducts(): Promise<StoreProduct[]> {
  const { data, error } = await publicClient()
    .from("store_products")
    .select("id, source, name, description, image_url, currency, price, category, tags, url, in_stock")
    .eq("active", true)
    .order("in_stock", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[store] catalog read failed:", error.message);
    return [];
  }
  return (data ?? []).map((p) => ({ ...p, price: Number(p.price) })) as StoreProduct[];
}
