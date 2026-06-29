-- Run this migration in Supabase SQL Editor (Dashboard → SQL → New query)
-- https://supabase.com/dashboard → your project → SQL Editor

ALTER TABLE service_providers
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
