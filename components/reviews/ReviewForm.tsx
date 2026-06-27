'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
  providerId: string
  isLoggedIn: boolean
}

export function ReviewForm({ providerId, isLoggedIn }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isLoggedIn) {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <a href="/login" className="font-medium text-[#1e3a5f] hover:underline">
          เข้าสู่ระบบ
        </a>{' '}
        เพื่อเขียนรีวิว
      </p>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_id: providerId, rating, comment }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'เกิดข้อผิดพลาด')
      setLoading(false)
      return
    }

    setSuccess(true)
    setComment('')
    setRating(0)
    setLoading(false)
    router.refresh()
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        ขอบคุณสำหรับรีวิว!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-slate-900">เขียนรีวิว</h3>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-4 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5"
          >
            <Star
              size={28}
              className={cn(
                (hover || rating) >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              )}
            />
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-slate-700">
          ความคิดเห็น (อย่างน้อย 20 ตัวอักษร)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          minLength={20}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
          placeholder="แบ่งปันประสบการณ์ของคุณ..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="mt-4 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282] disabled:opacity-50"
      >
        {loading ? 'กำลังส่ง...' : 'ส่งรีวิว'}
      </button>
    </form>
  )
}
