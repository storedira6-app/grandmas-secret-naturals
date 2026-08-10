CREATE TABLE public.store_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('code','zid','manual')),
  external_id text NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  currency text NOT NULL DEFAULT 'SAR',
  base_cost numeric(12,2) NOT NULL DEFAULT 0,
  price numeric(12,2) NOT NULL DEFAULT 0,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  url text,
  regions text[] NOT NULL DEFAULT '{}',
  in_stock boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, external_id)
);

GRANT SELECT ON public.store_products TO anon;
GRANT SELECT ON public.store_products TO authenticated;
GRANT ALL ON public.store_products TO service_role;

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can browse active products"
  ON public.store_products FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE INDEX store_products_category_idx ON public.store_products (category);
CREATE INDEX store_products_tags_idx ON public.store_products USING gin (tags);

CREATE TABLE public.customer_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  country text,
  product_id text,
  product_name text,
  product_price text,
  quantity integer NOT NULL DEFAULT 1,
  coupon_code text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  notified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.customer_leads TO service_role;

ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.store_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  items_synced integer NOT NULL DEFAULT 0,
  ok boolean NOT NULL DEFAULT true,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.store_sync_runs TO service_role;

ALTER TABLE public.store_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER store_products_updated_at BEFORE UPDATE ON public.store_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER customer_leads_updated_at BEFORE UPDATE ON public.customer_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();