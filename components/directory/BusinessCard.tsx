'use client'

import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/constants'
import {
  ensureHttpUrl,
  lineHref,
  messengerHref,
  telHref,
  whatsappHref,
} from '@/lib/contact'
import type { ServiceProvider } from '@/types'

interface BusinessCardProps {
  business: ServiceProvider
}

export function BusinessCard({ business }: BusinessCardProps) {
  const categoryLabel = CATEGORY_LABELS[business.category]?.th ?? business.category
  const websiteUrl = business.portfolio_url?.trim() || business.website?.trim()
  const hasFacebook = !!business.facebook_url?.trim()
  const hasPhone = !!business.phone?.trim()

  return (
    <div className="rounded-2xl border border-[#1e3a5f]/8 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <Link href={`/business/${business.id}`}>
            <h3 className="text-base font-bold leading-tight text-[#1e3a5f] hover:underline">
              {business.business_name}
            </h3>
          </Link>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#1e3a5f]/6 px-2 py-0.5 text-xs text-[#1e3a5f]/60">
              {categoryLabel}
            </span>
            <span className="rounded-full bg-[#1e3a5f]/6 px-2 py-0.5 text-xs text-[#1e3a5f]/60">
              📍 {business.state}
            </span>
            {business.is_verified && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                ✓ Verified ABN
              </span>
            )}
          </div>
        </div>
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-lg font-bold text-white">
          {business.business_name?.[0]?.toUpperCase() || '?'}
        </div>
      </div>

      {business.abn_number && (
        <p className="mb-3 text-xs text-[#1e3a5f]/40">ABN: {business.abn_number}</p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        {hasPhone && (
          <a
            href={telHref(business.phone!)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] py-3 text-sm font-semibold text-white transition-all active:scale-95"
          >
            📞 โทรเลย
          </a>
        )}

        {hasFacebook && (
          <a
            href={messengerHref(business.facebook_url!)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] py-3 text-sm font-semibold text-white transition-all active:scale-95"
          >
            💬 Inbox
          </a>
        )}

        {business.line_id?.trim() && (
          <a
            href={lineHref(business.line_id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#06C755] py-3 text-sm font-semibold text-white transition-all active:scale-95"
          >
            💚 Line
          </a>
        )}

        {websiteUrl && (
          <a
            href={ensureHttpUrl(websiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1e3a5f]/15 bg-white py-3 text-sm font-semibold text-[#1e3a5f] transition-all active:scale-95"
          >
            🌐 เว็บไซต์
          </a>
        )}

        {hasPhone && !hasFacebook && (
          <a
            href={whatsappHref(business.phone!)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-all active:scale-95"
          >
            💬 WhatsApp
          </a>
        )}
      </div>

      {business.instagram_url?.trim() && (
        <a
          href={ensureHttpUrl(business.instagram_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-center text-xs text-[#1e3a5f]/40 transition-colors hover:text-[#1e3a5f]"
        >
          Instagram →
        </a>
      )}
    </div>
  )
}
