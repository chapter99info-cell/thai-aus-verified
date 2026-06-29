'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  deleteBusinessPhotoByUrl,
  getDbClient,
  uploadBusinessPhoto,
} from '@/lib/supabase/storage-upload'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024
const MAX_GALLERY = 6

type Props = {
  providerId: string
  initialGallery?: string[] | null
}

export function GalleryUpload({ providerId, initialGallery }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>(initialGallery?.filter(Boolean) ?? [])
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 4000)
  }

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length === 0) return

    const remaining = MAX_GALLERY - images.length
    if (remaining <= 0) {
      setError(`เพิ่มได้สูงสุด ${MAX_GALLERY} รูป`)
      return
    }

    const toUpload = files.slice(0, remaining)
    for (const file of toUpload) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('รองรับเฉพาะ JPEG, PNG หรือ WebP')
        return
      }
      if (file.size > MAX_SIZE) {
        setError('ไฟล์ต้องไม่เกิน 5MB ครับ')
        return
      }
    }

    setError('')
    setUploading(true)

    try {
      const newUrls: string[] = []

      for (const file of toUpload) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const publicUrl = await uploadBusinessPhoto(
          `gallery/${Date.now()}-${safeName}`,
          file
        )
        newUrls.push(publicUrl)
      }

      const updated = [...images, ...newUrls]
      const supabase = getDbClient()
      const { error: updateError } = await supabase
        .from('service_providers')
        .update({ gallery_images: updated })
        .eq('id', providerId)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setImages(updated)
      showToast('เพิ่มรูปผลงานสำเร็จ ✅')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(url: string) {
    setDeleting(url)
    setError('')

    try {
      await deleteBusinessPhotoByUrl(url)

      const updated = images.filter((img) => img !== url)
      const supabase = getDbClient()
      const { error: updateError } = await supabase
        .from('service_providers')
        .update({ gallery_images: updated })
        .eq('id', providerId)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setImages(updated)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ลบรูปไม่สำเร็จ')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFilesChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || images.length >= MAX_GALLERY}
        className="rounded-xl bg-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50"
      >
        {uploading ? 'กำลังอัปโหลด...' : 'เพิ่มรูปผลงาน (สูงสุด 6 รูป)'}
      </button>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 grid-rows-2 gap-2">
          {images.map((url) => (
            <div key={url} className="relative h-24 overflow-hidden rounded-xl sm:h-28">
              <Image src={url} alt="ผลงาน" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => handleDelete(url)}
                disabled={deleting === url}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-50"
                aria-label="ลบรูป"
              >
                <X size={14} />
              </button>
            </div>
          ))}
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
