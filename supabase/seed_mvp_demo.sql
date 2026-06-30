-- Optional SQL seed for MVP demo (Supabase SQL Editor)
-- Prefer: node --env-file=.env.local scripts/seed-mvp-demo.mjs
--
-- This version attaches demo businesses to the first admin profile found.
-- Safe to re-run: skips rows that already exist by business_name / job_title.

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

  INSERT INTO public.businesses (owner_id, business_name, business_type, contact_phone, line_id, suburb, state, is_verified)
  VALUES (v_owner_id, 'Siam Kitchen Sydney', 'restaurant', '0412 345 678', 'siamkitchensyd', 'Cabramatta', 'NSW', true)
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_b1 FROM public.businesses WHERE business_name = 'Siam Kitchen Sydney';

  INSERT INTO public.businesses (owner_id, business_name, business_type, contact_phone, line_id, suburb, state, is_verified)
  VALUES
    (v_owner_id, 'Bangkok Street Food', 'restaurant', '0423 456 789', 'bangkokstreetmelb', 'Richmond', 'VIC', true),
    (v_owner_id, 'Thai Orchid Massage', 'massage', '0434 567 890', 'thaiorchidspa', 'Parramatta', 'NSW', true),
    (v_owner_id, 'Lotus Thai Spa', 'massage', '0445 678 901', 'lotusthaibris', 'Fortitude Valley', 'QLD', true),
    (v_owner_id, 'Golden Elephant Restaurant', 'restaurant', '0456 789 012', 'goldenelephant', 'Haymarket', 'NSW', true)
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_b2 FROM public.businesses WHERE business_name = 'Bangkok Street Food';
  SELECT id INTO v_b3 FROM public.businesses WHERE business_name = 'Thai Orchid Massage';
  SELECT id INTO v_b4 FROM public.businesses WHERE business_name = 'Lotus Thai Spa';
  SELECT id INTO v_b5 FROM public.businesses WHERE business_name = 'Golden Elephant Restaurant';

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
