-- MVP Phase 1: Job Board (Module A) + Verified Business Directory (Module B)
-- Note: public.profiles already exists from base schema — extend role check only

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('member', 'verified_business', 'admin', 'regular', 'verified_owner'));

CREATE TABLE IF NOT EXISTS public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_type text NOT NULL CHECK (business_type IN ('restaurant', 'massage')),
  contact_phone text,
  line_id text,
  suburb text,
  state text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read verified businesses" ON public.businesses;
CREATE POLICY "Public read verified businesses"
  ON public.businesses FOR SELECT
  USING (is_verified = true);

DROP POLICY IF EXISTS "Owner manage own business" ON public.businesses;
CREATE POLICY "Owner manage own business"
  ON public.businesses FOR ALL
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admin full access businesses" ON public.businesses;
CREATE POLICY "Admin full access businesses"
  ON public.businesses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  description text NOT NULL,
  contact_info text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active jobs" ON public.job_postings;
CREATE POLICY "Public read active jobs"
  ON public.job_postings FOR SELECT
  USING (
    is_active = true
    AND created_at > now() - interval '14 days'
  );

DROP POLICY IF EXISTS "Verified owner insert jobs" ON public.job_postings;
CREATE POLICY "Verified owner insert jobs"
  ON public.job_postings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.profiles p ON p.id = b.owner_id
      WHERE b.id = business_id
        AND p.id = auth.uid()
        AND p.role IN ('verified_owner', 'verified_business')
        AND b.is_verified = true
    )
  );

DROP POLICY IF EXISTS "Owner manage own jobs" ON public.job_postings;
CREATE POLICY "Owner manage own jobs"
  ON public.job_postings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_id AND owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admin full access job_postings" ON public.job_postings;
CREATE POLICY "Admin full access job_postings"
  ON public.job_postings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION public.expire_old_jobs()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.job_postings
  SET is_active = false
  WHERE is_active = true
    AND created_at < now() - interval '14 days';
$$;

GRANT EXECUTE ON FUNCTION public.expire_old_jobs() TO anon, authenticated;
