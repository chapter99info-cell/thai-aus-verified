-- Contact & gallery fields for service_providers
ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS instagram_url TEXT;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS youtube_url TEXT;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- line_id may already exist from initial schema
ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS line_id TEXT;
