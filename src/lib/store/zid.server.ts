import { deriveTags, isBeautyProduct, pickString, toNumber, type SupplierProduct } from "./supplier-types";

/** Grandma's Secret store identifier on the Zid platform. */
export const ZID_STORE_ID = "3200580";

/** Public storefront for the same Zid store. */
export const ZID_STOREFRONT_URL = "https://shamsroyalmall.zid.store";

const ZID_BASE = "https://api.zid.sa/v1";

/** Fetches and normalizes the Zid managed store catalog. */
export async function fetchZidProducts(): Promise<SupplierProduct[]> {
  const accessToken = process.env["ZID_ACCESS_TOKEN"];
  const managerToken = process.env["ZID_X_MANAGER_TOKEN"];
  if (!accessToken) throw new Error("ZID_ACCESS_TOKEN is not configured");
  if (!managerToken) throw new Error("ZID_X_MANAGER_TOKEN is not configured");

  const headers: Record<string, string> = {
    "Access-Token": accessToken,
    Authorization: `Bearer ${managerToken}`,
    "X-Manager-Token": managerToken,
    "Store-Id": ZID_STORE_ID,
    Role: "Manager",
    "Accept-Language": "ar",
    Accept: "application/json",
  };

  const out: SupplierProduct[] = [];
  let page = 1;

  while (page <= 20) {
    const res = await fetch(`${ZID_BASE}/products/?page=${page}&page_size=50`, { headers });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Zid request failed [${res.status}]: ${body.slice(0, 400)}`);
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

    if (items.length < 50) break;
    page += 1;
  }

  return out;
}

function normalize(raw: Record<string, unknown>): SupplierProduct | null {
  const externalId = pickString(raw["id"], raw["sku"], raw["uuid"]);
  const name = pickString(raw["name"], raw["title"]);
  if (!externalId || !name) return null;

  const description = pickString(raw["description"], raw["short_description"]);
  const category = pickString(raw["categories"] ? (raw["categories"] as unknown[])[0] : null, raw["category"]);
  const cost = toNumber(raw["cost"] ?? raw["price"] ?? raw["sale_price"]);
  const images = (raw["images"] as unknown[]) ?? [];

  return {
    source: "zid",
    external_id: String(externalId),
    name,
    description,
    image_url: pickString(images[0], raw["image"], raw["thumbnail"]),
    currency: pickString(raw["currency"], raw["currency_code"]) ?? "SAR",
    base_cost: cost,
    category,
    tags: deriveTags(name, description, category),
    url: pickString(raw["html_url"], raw["url"], raw["product_url"]),
    in_stock: raw["is_published"] !== false && toNumber(raw["quantity"] ?? 1) > 0,
  };
}
