'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StarRating } from '@/components/reviews/StarRating'

interface ReviewFormProps {
  providerId: string
}

export function ReviewForm({ providerId }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('กรุณาเลือกคะแนนดาวก่อน')
      return
    }

    if (comment.trim().length < 20) {
      setError('กรุณาเขียนอย่างน้อย 20 ตัวอักษร')
      return
    }

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
        ขอบคุณสำหรับรีวิวครับ! ✅
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-slate-900">เขียนรีวิว</h3>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-4">
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>

      <div className="mt-4">
        <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-slate-700">
          ความคิดเห็น
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          minLength={20}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
          placeholder="แบ่งปันประสบการณ์ของคุณ... (อย่างน้อย 20 ตัวอักษร)"
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
