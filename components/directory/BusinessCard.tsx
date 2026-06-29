'use client'

import Link from 'next/link'
import { SocialLinkPills } from '@/components/business/SocialLinkPills'
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
  const whatsappNumber = business.whatsapp?.trim() || business.phone?.trim()

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

      <div className="mt-4 grid grid-cols-2 gap-2">
        {business.phone?.trim() && (
          <a
            href={telHref(business.phone)}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] py-3 text-sm font-bold text-white transition-all active:scale-95"
          >
            📞 โทรเลย {business.phone}
          </a>
        )}

        {business.facebook_url?.trim() && (
          <a
            href={messengerHref(business.facebook_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.686 7.205v3.552l3.35-1.844c.895.248 1.843.382 2.964.382 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2z" />
            </svg>
            Messenger
          </a>
        )}

        {business.line_id?.trim() && (
          <a
            href={lineHref(business.line_id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#06C755] py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
          >
            <span className="text-base">💚</span>
            Line
          </a>
        )}

        {whatsappNumber && (
          <a
            href={whatsappHref(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.09.534 4.05 1.469 5.759L0 24l6.395-1.677A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.656-.513-5.175-1.407l-.372-.218-3.797.995.987-3.706-.24-.382A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp
          </a>
        )}
      </div>

      <SocialLinkPills business={business} />

      <div className="mt-2 flex flex-wrap gap-3">
        {websiteUrl && (
          <a
            href={ensureHttpUrl(websiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#1e3a5f]/50 transition-colors hover:text-[#1e3a5f]"
          >
            🌐 เว็บไซต์
          </a>
        )}

      </div>
    </div>
  )
}
