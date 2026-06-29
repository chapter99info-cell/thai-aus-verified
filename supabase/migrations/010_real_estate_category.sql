-- Add real_estate to service_providers category check
ALTER TABLE public.service_providers
  DROP CONSTRAINT IF EXISTS service_providers_category_check;

ALTER TABLE public.service_providers
  ADD CONSTRAINT service_providers_category_check
  CHECK (category IN (
    'accommodation', 'jobs', 'visa', 'restaurant', 'massage',
    'transport', 'tradesperson', 'photography', 'other', 'real_estate'
  ));
