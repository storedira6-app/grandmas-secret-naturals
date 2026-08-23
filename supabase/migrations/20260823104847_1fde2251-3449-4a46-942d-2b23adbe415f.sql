CREATE TABLE public.skin_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area text NOT NULL,
  skin_type text,
  summary text,
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  thumbnail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skin_analyses TO authenticated;
GRANT ALL ON public.skin_analyses TO service_role;

ALTER TABLE public.skin_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own skin analyses"
ON public.skin_analyses FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX skin_analyses_user_created_idx ON public.skin_analyses (user_id, created_at DESC);