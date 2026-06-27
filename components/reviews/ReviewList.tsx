import { Star } from 'lucide-react'

interface ReviewItem {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles?: { full_name: string } | { full_name: string }[] | null
}

function getReviewerName(profiles: ReviewItem['profiles']): string {
  if (!profiles) return 'สมาชิก'
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? 'สมาชิก'
  return profiles.full_name ?? 'สมาชิก'
}

interface ReviewListProps {
  reviews: ReviewItem[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-slate-500">ยังไม่มีรีวิว เป็นคนแรกที่รีวิว!</p>
    )
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-slate-900">
              {getReviewerName(review.profiles)}
            </p>
            <time className="text-xs text-slate-500">
              {new Date(review.created_at).toLocaleDateString('th-TH')}
            </time>
          </div>
          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < review.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }
              />
            ))}
          </div>
          {review.comment && (
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
