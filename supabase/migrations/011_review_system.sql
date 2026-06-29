-- Review moderation columns
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status text DEFAULT 'visible';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS report_count integer DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reported_at timestamptz;

UPDATE reviews SET status = 'visible' WHERE status IS NULL;

-- Owner replies (one reply per review)
CREATE TABLE IF NOT EXISTS review_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid UNIQUE REFERENCES reviews(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
  reply_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Review replies viewable by all"
  ON review_replies FOR SELECT USING (true);

CREATE POLICY "Owners can insert replies"
  ON review_replies FOR INSERT
  WITH CHECK (
    provider_id IN (SELECT id FROM service_providers WHERE profile_id = auth.uid())
  );

CREATE POLICY "Owners can update own replies"
  ON review_replies FOR UPDATE
  USING (
    provider_id IN (SELECT id FROM service_providers WHERE profile_id = auth.uid())
  );

-- Allow authenticated users to report reviews (update report_count / status)
CREATE POLICY "Authenticated users can report reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
