import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { businessTypeBadge } from '@/lib/job-board'
import { lineHref, telHref } from '@/lib/contact'
import type { JobBoardBusiness } from '@/types/job-board'

type ShopWithContacts = JobBoardBusiness & {
  facebook_url?: string | null
  instagram_url?: string | null
  email?: string | null
}

const outlineBtn =
  'inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#0D1B3E] bg-white text-base font-semibold text-[#0D1B3E]'

export function ShopCard({ shop }: { shop: ShopWithContacts }) {
  const badge = businessTypeBadge(shop.business_type)
  const location = [shop.suburb, shop.state].filter(Boolean).join(', ')

  return (
    <article className="rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-5 shadow-sm">
      <span className="inline-block rounded-full bg-[#0D1B3E] px-3 py-1 text-sm font-semibold text-[#D4A017]">
        {badge.emoji} {badge.label}
      </span>
      <h2 className="mt-3 text-xl font-bold text-[#0D1B3E]">{shop.business_name}</h2>
      {location && (
        <p className="mt-2 flex items-center gap-2 text-base text-[#0D1B3E]">
          <MapPin className="h-5 w-5 shrink-0 text-[#D4A017]" aria-hidden />
          📍 {location}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 lg:flex lg:flex-row">
        {shop.contact_phone?.trim() && (
          <a
            href={telHref(shop.contact_phone)}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0D1B3E] text-base font-semibold text-white"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            📞 โทรเลย {shop.contact_phone}
          </a>
        )}
        {shop.line_id?.trim() && (
          <a
            href={lineHref(shop.line_id)}
            target="_blank"
            rel="noopener noreferrer"
            className={outlineBtn}
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            💬 Line {shop.line_id}
          </a>
        )}
        {shop.facebook_url?.trim() && (
          <a
            href={shop.facebook_url.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className={outlineBtn}
          >
            <Facebook className="h-4 w-4 shrink-0" aria-hidden />
            👍 Facebook
          </a>
        )}
        {shop.instagram_url?.trim() && (
          <a
            href={shop.instagram_url.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className={outlineBtn}
          >
            <Instagram className="h-4 w-4 shrink-0" aria-hidden />
            📸 Instagram
          </a>
        )}
        {shop.email?.trim() && (
          <a href={`mailto:${shop.email.trim()}`} className={outlineBtn}>
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            ✉️ อีเมล
          </a>
        )}
      </div>
    </article>
  )
}

export function ShopFilterBar({
  basePath,
  currentType,
  currentSearch,
}: {
  basePath: string
  currentType?: string
  currentSearch?: string
}) {
  const types = [
    { key: '', label: 'ทั้งหมด', emoji: '' },
    { key: 'restaurant', label: 'ร้านอาหาร', emoji: '🍜' },
    { key: 'massage', label: 'ร้านนวด', emoji: '💆' },
  ] as const

  return (
    <div className="sticky top-16 z-10 -mx-4 border-b-2 border-[#0D1B3E]/10 bg-white px-4 py-4 sm:mx-0 sm:rounded-2xl sm:border-2">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const params = new URLSearchParams()
          if (type.key) params.set('type', type.key)
          if (currentSearch) params.set('search', currentSearch)
          const qs = params.toString()
          const href = qs ? `${basePath}?${qs}` : basePath
          const active = (currentType ?? '') === type.key

          return (
            <Link
              key={type.key || 'all'}
              href={href}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 text-base font-semibold ${
                active
                  ? 'bg-[#0D1B3E] text-[#D4A017]'
                  : 'border-2 border-[#0D1B3E] bg-white text-[#0D1B3E]'
              }`}
            >
              {type.emoji ? `${type.emoji} ` : ''}
              {type.label}
            </Link>
          )
        })}
      </div>

      <form method="get" action={basePath} className="mt-3">
        {currentType && <input type="hidden" name="type" value={currentType} />}
        <label htmlFor="shop-search" className="mb-2 block text-base font-semibold text-[#0D1B3E]">
          ค้นหา
        </label>
        <input
          id="shop-search"
          name="search"
          type="search"
          defaultValue={currentSearch ?? ''}
          placeholder="🔍 ค้นหาชื่อร้าน หรือ รัฐ/เขต..."
          className="min-h-[44px] w-full rounded-xl border-2 border-[#0D1B3E]/20 px-4 text-base text-[#0D1B3E] focus:border-[#D4A017] focus:outline-none"
        />
      </form>
    </div>
  )
}

export function ShopsEmptyState({
  basePath,
  hasFilter,
}: {
  basePath: string
  hasFilter: boolean
}) {
  if (!hasFilter) {
    return (
      <div className="rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-8 text-center">
        <div className="text-5xl" aria-hidden>
          🏪
        </div>
        <h2 className="mt-4 text-[22px] font-bold text-[#0D1B3E]">ยังไม่มีร้านค้าในขณะนี้</h2>
        <p className="mt-2 text-base text-[#0D1B3E]">ร้านที่ผ่านการ Verify จะแสดงที่นี่</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-8 text-center">
      <div className="text-5xl" aria-hidden>
        🔍
      </div>
      <h2 className="mt-4 text-[22px] font-bold text-[#0D1B3E]">ไม่พบร้านที่ตรงกับการค้นหา</h2>
      <Link
        href={basePath}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#0D1B3E] text-base font-semibold text-white sm:w-auto sm:px-8"
      >
        ล้างตัวกรอง
      </Link>
    </div>
  )
}
