-- Enhanced scam_alerts columns
ALTER TABLE public.scam_alerts
  ADD COLUMN IF NOT EXISTS alert_type text DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS severity text DEFAULT 'warning',
  ADD COLUMN IF NOT EXISTS evidence_url text,
  ADD COLUMN IF NOT EXISTS state text DEFAULT 'ไม่ระบุ';

-- Ensure is_published exists with sensible default for new rows
ALTER TABLE public.scam_alerts
  ALTER COLUMN is_published SET DEFAULT true;

-- Admin full access (read drafts, create, update, delete)
DROP POLICY IF EXISTS "Admin can manage scam alerts" ON public.scam_alerts;
CREATE POLICY "Admin can manage scam alerts"
  ON public.scam_alerts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));
