import { deriveTags, isBeautyProduct, pickString, toNumber, type SupplierProduct } from "./supplier-types";

/** Grandma's Secret store identifier on the Zid platform. */
export const ZID_STORE_ID = "3200580";

/** Public storefront for the same Zid store (tokenless catalog source). */
export const ZID_STOREFRONT_URL = "https://shamsroyalmall.zid.store";

const PAGE_SIZE = 50;
const MAX_PAGES = 20;

/**
 * Fetches and normalizes the Zid catalog from the PUBLIC storefront API.
 * No access/manager tokens are used, so the sync never breaks on token expiry.
 */
export async function fetchZidProducts(): Promise<SupplierProduct[]> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar",
    "Store-Id": ZID_STORE_ID,
    "User-Agent": "GrandmasSecret/1.0 (+catalog-sync)",
  };

  const out: SupplierProduct[] = [];
  let page = 1;

  while (page <= MAX_PAGES) {
    const url = `${ZID_STOREFRONT_URL}/api/v1/products?page=${page}&page_size=${PAGE_SIZE}`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Zid storefront request failed [${res.status}]: ${body.slice(0, 300)}`);
    }

    const payload = (await res.json()) as { results?: unknown; data?: unknown };
    const items = (Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.data)
        ? payload.data
        : []) as Record<string, unknown>[];

    if (items.length === 0) break;

    for (const raw of items) {
      const product = normalize(raw);
      if (product && isBeautyProduct(product)) out.push(product);
    }

    if (items.length < PAGE_SIZE) break;
    page += 1;
  }

  return out;
}

function localized(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (value && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    return pickString(rec["ar"], rec["en"], rec["value"]);
  }
  return null;
}

function imageFrom(raw: Record<string, unknown>): string | null {
  const images = (raw["images"] as unknown[]) ?? [];
  const first = images[0];
  if (first && typeof first === "object") {
    const rec = first as Record<string, unknown>;
    return pickString(rec["image"], rec["full_size"], rec["url"], rec["thumbnail"], rec["path"]);
  }
  return pickString(first, raw["image"], raw["thumbnail"]);
}

function normalize(raw: Record<string, unknown>): SupplierProduct | null {
  const externalId = pickString(raw["id"], raw["uuid"], raw["sku"]);
  const name = localized(raw["name"]) ?? localized(raw["title"]);
  if (!externalId || !name) return null;

  const description = localized(raw["description"]) ?? localized(raw["short_description"]);
  const categories = raw["categories"] as unknown[] | undefined;
  const category = localized(categories?.[0]) ?? localized(raw["category"]);

  // Public storefront exposes retail prices; treat the lowest published price as our base cost.
  const cost = toNumber(raw["sale_price"] ?? raw["price"] ?? raw["formatted_price"]);

  const slug = pickString(raw["slug"], raw["url"], raw["html_url"]);

  return {
    source: "zid",
    external_id: String(externalId),
    name,
    description,
    image_url: imageFrom(raw),
    currency: pickString(raw["currency"], raw["currency_code"]) ?? "SAR",
    base_cost: cost,
    category,
    tags: deriveTags(name, description, category),
    url: slug?.startsWith("http") ? slug : slug ? `${ZID_STOREFRONT_URL}/products/${slug}` : ZID_STOREFRONT_URL,
    in_stock: raw["is_published"] !== false && toNumber(raw["quantity"] ?? 1) > 0,
  };
}
