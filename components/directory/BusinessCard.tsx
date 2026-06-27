import Link from 'next/link'
import { StarRating } from '@/components/reviews/StarRating'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceProvider } from '@/types'

interface BusinessCardProps {
  business: ServiceProvider
}

export function BusinessCard({ business }: BusinessCardProps) {
  const category = CATEGORY_LABELS[business.category]

  return (
    <Link
      href={`/business/${business.id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:border-[#1e3a5f]/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-[#1e3a5f] group-hover:underline">
          {business.business_name}
        </h3>
        {business.is_verified ? (
          <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            ✅ Verified
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
            ⏳ รอการยืนยัน
          </span>
        )}
      </div>

      <span className="mt-2 inline-flex w-fit rounded-full bg-[#1e3a5f]/10 px-2.5 py-0.5 text-xs font-medium text-[#1e3a5f]">
        {category.emoji} {category.th}
      </span>

      <p className="mt-3 text-sm text-slate-600">
        {business.suburb}, {business.state}
      </p>

      <StarRating
        rating={Number(business.rating)}
        showAverage
        reviewCount={business.review_count}
        className="mt-3"
        size={14}
      />
    </Link>
  )
}
