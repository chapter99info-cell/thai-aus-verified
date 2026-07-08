# Supabase Storage — Thai-Aus Verified Community

## Project
URL: https://cxcdzxauqcklajmvaxii.supabase.co
Org: thai-aus-verified (Free plan)

## Current Buckets

### business-photos (PUBLIC)
Purpose: รูปภาพโปรไฟล์และผลงานของธุรกิจ
Access: Public — anyone can view
Max file size: 50MB
Allowed types: image/jpeg, image/png, image/webp
Folder structure:
  {provider_id}/profile/{filename}     ← รูปโปรไฟล์หลัก
  {provider_id}/gallery/{filename}     ← รูปผลงาน/gallery
  {provider_id}/cover/{filename}       ← รูป cover/banner

### business-VDO (PUBLIC)
Purpose: วิดีโอโชว์ผลงานของธุรกิจ
Access: Public — anyone can view
Max file size: 50MB
Allowed types: video/mp4, video/quicktime
Folder structure:
  {provider_id}/videos/{filename}      ← วิดีโอผลงาน

## Future Buckets (Phase 4)

### business-documents (PRIVATE) — NOT YET CREATED
Purpose: เอกสารสำคัญ (ถ้าต้องการในอนาคต)
Access: Private — owner + admin only
Note: ตอนนี้ใช้ ABN API แทน ไม่จำเป็นต้องอัปโหลดเอกสาร

## Database Tables (NOT Storage)
ข้อมูลต่อไปนี้เก็บใน PostgreSQL ไม่ใช่ Storage:
- profiles — ข้อมูลผู้ใช้
- service_providers — ข้อมูลธุรกิจ + contact + ABN
- reviews — รีวิวจากลูกค้า
- scam_alerts — การแจ้งเตือนภัย

## Storage Policies (Run in SQL Editor)

```sql
-- Allow public to view business photos
CREATE POLICY "Public can view business photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-photos');

-- Allow authenticated users to upload own photos
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view business videos
CREATE POLICY "Public can view business videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-VDO');

-- Allow authenticated users to upload own videos
CREATE POLICY "Users can upload own videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-VDO' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## How to Upload (Code Reference)

```typescript
// Upload profile photo
const { data, error } = await supabase.storage
  .from('business-photos')
  .upload(`${providerId}/profile/${fileName}`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('business-photos')
  .getPublicUrl(`${providerId}/profile/${fileName}`)

// Upload gallery photo
const { data, error } = await supabase.storage
  .from('business-photos')
  .upload(`${providerId}/gallery/${fileName}`, file)

// Upload video
const { data, error } = await supabase.storage
  .from('business-VDO')
  .upload(`${providerId}/videos/${fileName}`, file)
```

## Free Plan Limits
- Storage: 1 GB total
- File size: 50 MB per file
- Bandwidth: 5 GB/month
- Estimated capacity: ~500 business profiles with photos

---
Last updated: June 2026
