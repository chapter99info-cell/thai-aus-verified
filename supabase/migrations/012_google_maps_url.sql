ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
