-- Optional SQL seed for MVP demo (Supabase SQL Editor)
-- Prefer: node --env-file=.env.local scripts/seed-mvp-demo.mjs
--
-- This version attaches demo businesses to the first admin profile found.
-- Safe to re-run: skips rows that already exist by business_name / job_title.

ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS email TEXT;

DO $$
DECLARE
  v_owner_id uuid;
  v_b1 uuid;
  v_b2 uuid;
  v_b3 uuid;
  v_b4 uuid;
  v_b5 uuid;
BEGIN
  SELECT id INTO v_owner_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  IF v_owner_id IS NULL THEN
    SELECT id INTO v_owner_id FROM public.profiles LIMIT 1;
  END IF;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'No profile found. Register a user first or run scripts/seed-mvp-demo.mjs';
  END IF;

  INSERT INTO public.businesses (
    owner_id, business_name, business_type, contact_phone, line_id,
    suburb, state, is_verified, facebook_url, instagram_url, email
  )
  VALUES (
    v_owner_id, 'Siam Kitchen Sydney', 'restaurant', '0412 345 678', 'siamkitchensyd',
    'Cabramatta', 'NSW', true,
    'https://www.facebook.com/siamkitchensyd',
    'https://www.instagram.com/siamkitchensyd',
    'siamkitchensyd@gmail.com'
  )
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_b1 FROM public.businesses WHERE business_name = 'Siam Kitchen Sydney';

  INSERT INTO public.businesses (
    owner_id, business_name, business_type, contact_phone, line_id,
    suburb, state, is_verified, facebook_url, instagram_url, email
  )
  VALUES
    (
      v_owner_id, 'Bangkok Street Food', 'restaurant', '0423 456 789', 'bangkokstreetmelb',
      'Richmond', 'VIC', true,
      'https://www.facebook.com/bangkokstreetfoodmelb',
      'https://www.instagram.com/bangkokstreetfoodmelb',
      'hello@bangkokstreetfood.com.au'
    ),
    (
      v_owner_id, 'Thai Orchid Massage', 'massage', '0434 567 890', 'thaiorchidspa',
      'Parramatta', 'NSW', true,
      'https://www.facebook.com/thaiorchidmassage',
      NULL,
      'thaiorchid.parramatta@gmail.com'
    ),
    (
      v_owner_id, 'Lotus Thai Spa', 'massage', '0445 678 901', 'lotusthaibris',
      'Fortitude Valley', 'QLD', true,
      'https://www.facebook.com/lotusthaispabris',
      'https://www.instagram.com/lotusthaispabris',
      'bookings@lotusthaispa.com.au'
    ),
    (
      v_owner_id, 'Golden Elephant Restaurant', 'restaurant', '0456 789 012', 'goldenelephant',
      'Haymarket', 'NSW', true,
      'https://www.facebook.com/goldenelephantrest',
      'https://www.instagram.com/goldenelephant_syd',
      'info@goldenelephantrest.com.au'
    )
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_b2 FROM public.businesses WHERE business_name = 'Bangkok Street Food';
  SELECT id INTO v_b3 FROM public.businesses WHERE business_name = 'Thai Orchid Massage';
  SELECT id INTO v_b4 FROM public.businesses WHERE business_name = 'Lotus Thai Spa';
  SELECT id INTO v_b5 FROM public.businesses WHERE business_name = 'Golden Elephant Restaurant';

  UPDATE public.businesses SET
    facebook_url = 'https://www.facebook.com/siamkitchensyd',
    instagram_url = 'https://www.instagram.com/siamkitchensyd',
    email = 'siamkitchensyd@gmail.com'
  WHERE business_name = 'Siam Kitchen Sydney';

  UPDATE public.businesses SET
    facebook_url = 'https://www.facebook.com/bangkokstreetfoodmelb',
    instagram_url = 'https://www.instagram.com/bangkokstreetfoodmelb',
    email = 'hello@bangkokstreetfood.com.au'
  WHERE business_name = 'Bangkok Street Food';

  UPDATE public.businesses SET
    facebook_url = 'https://www.facebook.com/thaiorchidmassage',
    instagram_url = NULL,
    email = 'thaiorchid.parramatta@gmail.com'
  WHERE business_name = 'Thai Orchid Massage';

  UPDATE public.businesses SET
    facebook_url = 'https://www.facebook.com/lotusthaispabris',
    instagram_url = 'https://www.instagram.com/lotusthaispabris',
    email = 'bookings@lotusthaispa.com.au'
  WHERE business_name = 'Lotus Thai Spa';

  UPDATE public.businesses SET
    facebook_url = 'https://www.facebook.com/goldenelephantrest',
    instagram_url = 'https://www.instagram.com/goldenelephant_syd',
    email = 'info@goldenelephantrest.com.au'
  WHERE business_name = 'Golden Elephant Restaurant';

  IF v_b1 IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.job_postings WHERE business_id = v_b1 AND job_title = 'พนักงานเสิร์ฟ กะเย็น'
  ) THEN
    INSERT INTO public.job_postings (business_id, job_title, description, contact_info, is_active, created_at)
    VALUES (
      v_b1,
      'พนักงานเสิร์ฟ กะเย็น',
      'รับสมัครพนักงานเสิร์ฟ กะ 17:00–22:00 ค่าจ้าง $25–28/ชม. + tips',
      '0412 345 678',
      true,
      now() - interval '1 day'
    );
  END IF;

  IF v_b3 IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.job_postings WHERE business_id = v_b3 AND job_title = 'นักนวดแผนไทย'
  ) THEN
    INSERT INTO public.job_postings (business_id, job_title, description, contact_info, is_active, created_at)
    VALUES (
      v_b3,
      'นักนวดแผนไทย',
      'รับสมัครนักนวดที่มีใบ Certificate หรือประสบการณ์ 2 ปี ค่าจ้าง 50/50',
      '@thaiorchidspa',
      true,
      now() - interval '2 days'
    );
  END IF;

  RAISE NOTICE 'MVP seed complete. Visit /jobs and /shops to test.';
END $$;
