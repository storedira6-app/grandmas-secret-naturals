REVOKE SELECT ON public.store_products FROM anon, authenticated;
GRANT SELECT (id, source, external_id, name, description, image_url, currency, price, category, tags, url, regions, in_stock, active, created_at, updated_at) ON public.store_products TO anon, authenticated;
GRANT ALL ON public.store_products TO service_role;