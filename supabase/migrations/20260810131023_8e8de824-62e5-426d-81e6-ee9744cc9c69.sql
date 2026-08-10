-- customer_leads: explicit, restrictive access model
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_leads FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.customer_leads FROM anon;
REVOKE ALL ON public.customer_leads FROM authenticated;
GRANT SELECT ON public.customer_leads TO authenticated;
GRANT ALL ON public.customer_leads TO service_role;

DROP POLICY IF EXISTS "Users can view their own leads" ON public.customer_leads;
CREATE POLICY "Users can view their own leads"
  ON public.customer_leads
  FOR SELECT
  TO authenticated
  USING (user_id IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages leads" ON public.customer_leads;
CREATE POLICY "Service role manages leads"
  ON public.customer_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- store_sync_runs: internal logs, service role only
ALTER TABLE public.store_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_sync_runs FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.store_sync_runs FROM anon;
REVOKE ALL ON public.store_sync_runs FROM authenticated;
GRANT ALL ON public.store_sync_runs TO service_role;

DROP POLICY IF EXISTS "Service role manages sync runs" ON public.store_sync_runs;
CREATE POLICY "Service role manages sync runs"
  ON public.store_sync_runs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);