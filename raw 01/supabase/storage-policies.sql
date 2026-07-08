-- Run after creating bucket 'kyc-documents' in Supabase Storage (private bucket)

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
