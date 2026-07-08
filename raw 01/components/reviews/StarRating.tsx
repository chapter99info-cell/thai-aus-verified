'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating?: number
  value?: number
  onChange?: (value: number) => void
  size?: number
  showAverage?: boolean
  reviewCount?: number
  className?: string
}

export function StarRating({
  rating,
  value = 0,
  onChange,
  size = 18,
  showAverage,
  reviewCount,
  className,
}: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const interactive = !!onChange
  const displayValue = interactive ? hover || value : Math.round(rating ?? 0)

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue
        const starClass = cn(
          filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
        )

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
              aria-label={`${star} ดาว`}
            >
              <Star size={size} className={starClass} />
            </button>
          )
        }

        return <Star key={star} size={size} className={starClass} />
      })}
      {showAverage && rating !== undefined && (
        <span className="ml-2 text-sm text-slate-600">
          {Number(rating).toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount} รีวิว)`}
        </span>
      )}
    </div>
  )
}
