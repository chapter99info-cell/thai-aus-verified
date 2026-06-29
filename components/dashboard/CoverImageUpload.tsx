'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
      setError('ไฟล์ต้องไม่เกิน 5MB')
      return
    }

    setError('')
    setUploading(true)

    const supabase = createClient()
    const path = `${providerId}/cover/cover.jpg`

    const { error: uploadError } = await supabase.storage
      .from('business-photos')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('business-photos').getPublicUrl(path)

    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`

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
    setUploading(false)
    router.refresh()
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-[#1e3a5f]">รูปหน้าปกโปรไฟล์</p>
      <p className="mt-1 text-xs text-slate-500">JPEG, PNG หรือ WebP · สูงสุด 5MB</p>

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
        className="mt-4 rounded-xl bg-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50"
      >
        {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปหน้าปก'}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {toast && (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {toast}
        </p>
      )}
    </div>
  )
}
