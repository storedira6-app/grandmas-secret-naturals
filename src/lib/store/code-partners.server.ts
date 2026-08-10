import { deriveTags, isBeautyProduct, pickString, toNumber, type SupplierProduct } from "./supplier-types";

const DEFAULT_BASE = "https://api.cod.network/api/v2/seller";

/**
 * Code Partners dropshipping catalog.
 * Tolerant parser: suppliers vary in envelope shape, so we accept
 * `{data: []}`, `{products: []}`, `{results: []}` or a bare array.
 */
export async function fetchCodePartnersProducts(): Promise<SupplierProduct[]> {
  const apiKey = process.env["CODE_PARTNERS_API_KEY"];
  if (!apiKey) throw new Error("CODE_PARTNERS_API_KEY is not configured");
  const configured = process.env["CODE_PARTNERS_API_BASE"] ?? "";
  // The base secret sometimes holds a token by mistake; only trust real URLs.
  const base = (/^https?:\/\//.test(configured) ? configured : DEFAULT_BASE).replace(/\/+$/, "");


  const out: SupplierProduct[] = [];
  let page = 1;

  while (page <= 20) {
    const res = await fetch(`${base}/products?page=${page}&per_page=100`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-API-KEY": apiKey,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Code Partners request failed [${res.status}]: ${body.slice(0, 400)}`);
    }

    const payload: unknown = await res.json();
    const items = extractList(payload);
    if (items.length === 0) break;

    for (const raw of items) {
      const product = normalize(raw);
      if (product && isBeautyProduct(product)) out.push(product);
    }

    if (items.length < 100) break;
    page += 1;
  }

  return out;
}

function extractList(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    const rec = payload as Record<string, unknown>;
    for (const key of ["data", "products", "results", "items"]) {
      const value = rec[key];
      if (Array.isArray(value)) return value as Record<string, unknown>[];
      if (value && typeof value === "object") {
        const nested = (value as Record<string, unknown>)["data"];
        if (Array.isArray(nested)) return nested as Record<string, unknown>[];
      }
    }
  }
  return [];
}

function normalize(raw: Record<string, unknown>): SupplierProduct | null {
  const externalId = pickString(raw["id"], raw["sku"], raw["product_id"], raw["uuid"]);
  const name = pickString(raw["name"], raw["title"], raw["product_name"]);
  if (!externalId || !name) return null;

  const description = pickString(raw["description"], raw["short_description"], raw["details"]);
  const category = pickString(raw["category"], raw["category_name"], raw["type"]);
  const cost = toNumber(raw["cost"] ?? raw["price"] ?? raw["base_price"] ?? raw["wholesale_price"]);

  return {
    source: "code",
    external_id: String(externalId),
    name,
    description,
    image_url: pickString(raw["image"], raw["image_url"], raw["thumbnail"], (raw["images"] as unknown[])?.[0]),
    currency: pickString(raw["currency"], raw["currency_code"]) ?? "SAR",
    base_cost: cost,
    category,
    tags: deriveTags(name, description, category),
    url: pickString(raw["url"], raw["product_url"], raw["link"]),
    in_stock: raw["in_stock"] !== false && toNumber(raw["quantity"] ?? 1) > 0,
  };
}
