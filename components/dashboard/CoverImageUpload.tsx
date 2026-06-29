'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { getDbClient, uploadBusinessPhoto } from '@/lib/supabase/storage-upload'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

type Props = {
  providerId: string
  initialCoverUrl?: string | null
}

export function CoverImageUpload({ providerId, initialCoverUrl }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 4000)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('รองรับเฉพาะ JPEG, PNG หรือ WebP')
      return
    }

    if (file.size > MAX_SIZE) {
      setError('ไฟล์ต้องไม่เกิน 5MB ครับ')
      showToast('ไฟล์ต้องไม่เกิน 5MB ครับ')
      return
    }

    setError('')
    setUploading(true)

    try {
      const cacheBustedUrl = await uploadBusinessPhoto('cover/cover.jpg', file)

      const supabase = getDbClient()
      const { error: updateError } = await supabase
        .from('service_providers')
        .update({ cover_image_url: cacheBustedUrl })
        .eq('id', providerId)

      if (updateError) {
        setError(updateError.message)
        setUploading(false)
        return
      }

      setCoverUrl(cacheBustedUrl)
      showToast('อัปโหลดรูปหน้าปกสำเร็จ ✅')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-xl bg-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50"
      >
        {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปหน้าปก 📸'}
      </button>

      {coverUrl && (
        <div className="relative mt-4 h-32 overflow-hidden rounded-xl sm:h-40">
          <Image
            src={coverUrl}
            alt="ตัวอย่างรูปหน้าปก"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {toast && (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {toast}
        </p>
      )}
    </div>
  )
}
