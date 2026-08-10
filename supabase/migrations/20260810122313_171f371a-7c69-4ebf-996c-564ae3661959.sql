CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'store-catalog-daily-sync',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--9e6f54ff-5572-40d6-9696-2b740b1f5c45.lovable.app/api/public/store-sync',
    headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_qc6rtDZ5SWu_RGjOX3xkmw_lia5tN9V"}'::jsonb,
    body := '{"source": "cron"}'::jsonb
  );
  $$
);