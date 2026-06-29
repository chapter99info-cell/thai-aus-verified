'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatThaiDate } from '@/lib/utils'

export type BusinessReview = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles?: { full_name: string; email?: string } | { full_name: string; email?: string }[] | null
}

export type ReviewReply = {
  id: string
  review_id: string
  provider_id: string
  reply_text: string
  created_at: string
}

function getReviewerName(profiles: BusinessReview['profiles']): string {
  if (!profiles) return 'สมาชิก'
  const profile = Array.isArray(profiles) ? profiles[0] : profiles
  if (profile?.full_name?.trim()) return profile.full_name
  if (profile?.email) return profile.email.split('@')[0]
  return 'สมาชิก'
}

type Props = {
  reviews: BusinessReview[]
  replies: ReviewReply[]
  providerId: string
  isOwner: boolean
}

export function BusinessReviewList({ reviews, replies, providerId, isOwner }: Props) {
  const router = useRouter()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const repliesByReviewId = new Map(replies.map((r) => [r.review_id, r]))

  async function handleReport(reviewId: string) {
    const supabase = createClient()
    const { data: review } = await supabase
      .from('reviews')
      .select('report_count, rating')
      .eq('id', reviewId)
      .single()

    const newCount = (review?.report_count ?? 0) + 1
    const shouldHide = newCount >= 1 && review?.rating === 1

    await supabase
      .from('reviews')
      .update({
        report_count: newCount,
        reported_at: new Date().toISOString(),
        status: shouldHide ? 'hidden' : 'visible',
      })
      .eq('id', reviewId)

    window.alert('ขอบคุณที่แจ้งเรา ทีมงานจะตรวจสอบโดยเร็ว')
    router.refresh()
  }

  async function handleReply(reviewId: string, text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    const supabase = createClient()
    await supabase.from('review_replies').upsert(
      {
        review_id: reviewId,
        provider_id: providerId,
        reply_text: trimmed,
      },
      { onConflict: 'review_id' }
    )

    setReplyingTo(null)
    setReplyText('')
    router.refresh()
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-slate-500">ยังไม่มีรีวิว เป็นคนแรกที่รีวิว!</p>
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => {
        const reply = repliesByReviewId.get(review.id)
        const reviewerName = getReviewerName(review.profiles)

        return (
          <li key={review.id} className="space-y-2 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400">{formatThaiDate(review.created_at)}</span>
            </div>
            <p className="text-sm font-medium">{reviewerName}</p>
            <p className="text-sm text-gray-600">{review.comment}</p>

            {reply && (
              <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="mb-1 text-xs font-semibold text-blue-700">💬 เจ้าของตอบกลับ</p>
                <p className="text-sm text-blue-800">{reply.reply_text}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {isOwner && !reply && (
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(review.id)
                    setReplyText('')
                  }}
                  className="text-xs text-blue-600 underline"
                >
                  💬 ตอบกลับรีวิวนี้
                </button>
              )}
              {!isOwner && (
                <button
                  type="button"
                  onClick={() => handleReport(review.id)}
                  className="ml-auto text-xs text-gray-400 hover:text-red-500"
                >
                  🚩 แจ้งรีวิวไม่เหมาะสม
                </button>
              )}
            </div>

            {isOwner && replyingTo === review.id && (
              <div className="space-y-2 pt-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border p-2 text-sm"
                  placeholder="เขียนคำตอบกลับ..."
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleReply(review.id, replyText)}
                    className="rounded-lg bg-[#1e3a5f] px-3 py-1.5 text-xs text-white"
                  >
                    ส่งคำตอบ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText('')
                    }}
                    className="text-xs text-gray-500 underline"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
