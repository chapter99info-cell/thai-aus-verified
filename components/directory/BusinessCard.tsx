'use client'

import Link from 'next/link'
import { StarRating } from '@/components/reviews/StarRating'
import { CATEGORY_LABELS } from '@/lib/constants'
import { ensureHttpUrl, lineHref, telHref } from '@/lib/contact'
import { isPremiumProvider } from '@/lib/subscription'
import type { ServiceProvider } from '@/types'

interface BusinessCardProps {
  business: ServiceProvider
}

export function BusinessCard({ business }: BusinessCardProps) {
  const category = CATEGORY_LABELS[business.category]
  const isPremium = isPremiumProvider(business)

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:border-[#1e3a5f]/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-[#1e3a5f]">{business.business_name}</h3>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {business.is_verified && (
            <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              ✅ Verified
            </span>
          )}
          {isPremium && (
            <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
              ⭐ Premium
            </span>
          )}
        </div>
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

      <div className="mt-4 flex flex-wrap gap-2">
        {business.phone?.trim() && (
          <a
            href={telHref(business.phone)}
            onClick={(e) => e.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-lg hover:bg-green-100"
            aria-label="โทร"
            title="โทร"
          >
            📞
          </a>
        )}
        {business.line_id?.trim() && (
          <a
            href={lineHref(business.line_id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-lg hover:bg-green-100"
            aria-label="Line"
            title="Line"
          >
            💬
          </a>
        )}
        {business.facebook_url?.trim() && (
          <a
            href={ensureHttpUrl(business.facebook_url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-lg hover:bg-blue-100"
            aria-label="Facebook"
            title="Facebook"
          >
            👥
          </a>
        )}
        {business.instagram_url?.trim() && (
          <a
            href={ensureHttpUrl(business.instagram_url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-pink-200 bg-pink-50 text-lg hover:bg-pink-100"
            aria-label="Instagram"
            title="Instagram"
          >
            📸
          </a>
        )}
      </div>

      <Link
        href={`/business/${business.id}`}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-center text-base font-medium text-white transition-colors hover:bg-[#2d5282]"
      >
        ดูโปรไฟล์เต็ม →
      </Link>
    </article>
  )
}
