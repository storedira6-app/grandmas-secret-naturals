import { deriveTags, isBeautyProduct, pickString, toNumber, type SupplierProduct } from "./supplier-types";

const DEFAULT_BASE = "https://api.cod.network/api/v2/seller";
const MAX_PAGES = 60;

type MarketplaceResponse = {
  data?: Record<string, unknown>[];
  meta?: { pagination?: { total_pages?: number } };
};

/**
 * Code Partners (COD Network) dropshipping marketplace catalog.
 * Only products flagged as available for dropshipping are ingested,
 * and the beauty/personal-care filter keeps the catalog on-brand.
 */
export async function fetchCodePartnersProducts(): Promise<SupplierProduct[]> {
  const apiKey = process.env["CODE_PARTNERS_API_KEY"];
  if (!apiKey) throw new Error("CODE_PARTNERS_API_KEY is not configured");
  const configured = process.env["CODE_PARTNERS_API_BASE"] ?? "";
  // The base secret sometimes holds a token by mistake; only trust real URLs.
  const base = (/^https?:\/\//.test(configured) ? configured : DEFAULT_BASE).replace(/\/+$/, "");

  const headers = { Authorization: `Bearer ${apiKey}`, Accept: "application/json" };
  const out: SupplierProduct[] = [];
  const seen = new Set<string>();
  let totalPages = MAX_PAGES;

  for (let page = 1; page <= Math.min(totalPages, MAX_PAGES); page += 1) {
    const res = await fetch(`${base}/marketplace/products?page=${page}&per_page=100`, { headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Code Partners request failed [${res.status}]: ${body.slice(0, 300)}`);
    }

    const payload = (await res.json()) as MarketplaceResponse;
    const items = payload.data ?? [];
    totalPages = payload.meta?.pagination?.total_pages ?? totalPages;
    if (items.length === 0) break;

    for (const raw of items) {
      const product = normalize(raw);
      if (!product || seen.has(product.external_id)) continue;
      if (!isBeautyProduct(product)) continue;
      seen.add(product.external_id);
      out.push(product);
    }
  }

  return out;
}

function stripHtml(value: string | null): string | null {
  if (!value) return null;
  const text = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text || null;
}

function normalize(raw: Record<string, unknown>): SupplierProduct | null {
  const externalId = pickString(raw["id"], raw["sku"], raw["slug"]);
  const name = pickString(raw["name"], raw["title"]);
  if (!externalId || !name) return null;
  if (raw["available_for_drop"] === false) return null;

  const description = stripHtml(pickString(raw["description"], raw["short_description"]));
  const category = pickString(raw["type"], raw["category"]);
  const cost = toNumber(raw["price"] ?? raw["cost"]);

  return {
    source: "code",
    external_id: String(externalId),
    name,
    description,
    image_url: pickString(raw["image_url"], raw["path_image"], raw["image"]),
    currency: pickString(raw["currency"], raw["currency_code"]) ?? "USD",
    base_cost: cost,
    category,
    tags: deriveTags(name, description, category),
    url: pickString(raw["url"], raw["product_url"]),
    in_stock: raw["inStock"] !== false,
  };
}
