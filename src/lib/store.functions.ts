import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

export type StoreProduct = {
  id: string;
  source: string;
  name: string;
  description: string | null;
  image_url: string | null;
  currency: string;
  price: number;
  category: string | null;
  tags: string[];
  url: string | null;
  in_stock: boolean;
};

const LeadInput = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(4).max(300),
  country: z.string().trim().max(4).nullable().default(null),
  product_id: z.string().trim().max(80).nullable().default(null),
  product_name: z.string().trim().max(200).nullable().default(null),
  product_price: z.string().trim().max(40).nullable().default(null),
  quantity: z.number().int().min(1).max(20).default(1),
  coupon_code: z.string().trim().max(40).nullable().default(null),
  notes: z.string().trim().max(500).nullable().default(null),
});

/** Detects the visitor country from edge geo headers. */
export const detectCountry = createServerFn({ method: "GET" }).handler(async () => {
  const country =
    getRequestHeader("cf-ipcountry") ??
    getRequestHeader("x-vercel-ip-country") ??
    getRequestHeader("x-country-code") ??
    null;
  return { country: country && country !== "XX" ? country.toUpperCase() : null };
});

/** Public catalog read (anon-safe columns only). */
export const listStoreProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicProducts } = await import("./store.server");
  return getPublicProducts();
});

/** Runs the Code Partners + Zid ingestion and applies the 50% margin. */
export const syncStoreCatalog = createServerFn({ method: "POST" }).handler(async () => {
  const { syncAllSuppliers } = await import("./store/sync.server");
  return syncAllSuppliers();
});

/** Saves a checkout lead and emails the admin. */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { notifyAdminOfLead } = await import("./store/notify.server");

    const { data: inserted, error } = await supabaseAdmin
      .from("customer_leads")
      .insert({ ...data, status: "new" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const notified = await notifyAdminOfLead(data, inserted.id);
    if (notified) {
      await supabaseAdmin.from("customer_leads").update({ notified: true }).eq("id", inserted.id);
    }

    return { id: inserted.id, notified };
  });
