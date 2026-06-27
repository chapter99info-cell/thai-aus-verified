import Link from 'next/link'
import { Star } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceProvider } from '@/types'

interface BusinessCardProps {
  business: ServiceProvider
}

export function BusinessCard({ business }: BusinessCardProps) {
  const category = CATEGORY_LABELS[business.category]

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-[#1e3a5f]">{business.business_name}</h3>
        {business.is_verified ? (
          <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            ✅ ยืนยันแล้ว
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

      <div className="mt-3 flex items-center gap-1 text-sm text-slate-600">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.round(Number(business.rating))
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }
          />
        ))}
        <span className="ml-1">
          {Number(business.rating).toFixed(1)} ({business.review_count})
        </span>
      </div>

      <Link
        href={`/business/${business.id}`}
        className="mt-5 inline-block rounded-lg bg-[#1e3a5f] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#2d5282]"
      >
        ดูรายละเอียด
      </Link>
    </article>
  )
}
