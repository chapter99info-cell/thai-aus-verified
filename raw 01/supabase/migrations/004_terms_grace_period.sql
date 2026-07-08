-- v1.1: Terms acceptance + Stripe grace period
ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS subscription_grace_until TIMESTAMPTZ;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
