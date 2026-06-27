-- Phase 2: Stripe subscription fields
ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'premium'));

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
