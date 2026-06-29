-- Run after creating buckets in Supabase Storage
-- business-photos (public), kyc-documents (private)
--
-- Upload path must use auth user id as first folder:
--   {auth.uid()}/cover/cover.jpg
--   {auth.uid()}/profile/avatar.jpg
--   {auth.uid()}/gallery/{filename}

-- Allow authenticated users to upload their own business photos
CREATE POLICY "Users can upload own business photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'business-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own business photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'business-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own business photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'business-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view business photos" ON storage.objects
FOR SELECT USING (bucket_id = 'business-photos');

-- Allow authenticated users to upload their own KYC docs (path: {provider_id}/{document_type}/{filename})
CREATE POLICY "Users can upload own KYC" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'kyc-documents' AND
  EXISTS (
    SELECT 1 FROM service_providers sp
    WHERE sp.id::text = (storage.foldername(name))[1]
    AND sp.profile_id = auth.uid()
  )
);

CREATE POLICY "Users can view own KYC" ON storage.objects
FOR SELECT USING (
  bucket_id = 'kyc-documents' AND
  EXISTS (
    SELECT 1 FROM service_providers sp
    WHERE sp.id::text = (storage.foldername(name))[1]
    AND sp.profile_id = auth.uid()
  )
);
