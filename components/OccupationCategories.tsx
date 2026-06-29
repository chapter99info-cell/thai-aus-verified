'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CategoryCountLabel } from '@/components/CategoryCountLabel'
import { DIRECTORY_CATEGORIES } from '@/lib/categories'
import { createClient } from '@/lib/supabase/client'

export default function OccupationCategories({
  hero = false,
  showScrollHint = false,
  initialCounts,
}: {
  hero?: boolean
  showScrollHint?: boolean
  showGradient?: boolean
  initialCounts?: Record<string, number>
} = {}) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts ?? {})

  useEffect(() => {
    if (initialCounts) {
      setCounts(initialCounts)
      return
    }

    async function loadCounts() {
      const supabase = createClient()
      const { data } = await supabase.from('service_providers').select('category')

      if (!data) return

      const next: Record<string, number> = {}
      for (const row of data) {
        if (row.category) {
          next[row.category] = (next[row.category] ?? 0) + 1
        }
      }
      setCounts(next)
    }

    loadCounts()
  }, [initialCounts])

  return (
    <section className="w-full overflow-x-hidden bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`text-center ${hero ? 'pt-2 pb-6' : 'mb-8'}`}>
          {!hero && (
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f]/30">
              อาชีพยอดฮิตของคนไทยในออสเตรเลีย
            </p>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-[#1e3a5f] md:text-3xl">
            ค้นหาตามประเภทธุรกิจ
          </h2>
          {showScrollHint && (
            <p className="mt-3 text-sm text-slate-500">เลื่อนลงเพื่อค้นหา</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {DIRECTORY_CATEGORIES.map((item) => (
            <Link
              key={item.category}
              href={`/directory?category=${item.category}`}
              className="relative block rounded-2xl border-2 border-[#1e3a5f] bg-white p-5 text-center transition-shadow hover:shadow-md"
            >
              {item.badge && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.badge.className}`}
                >
                  {item.badge.text}
                </span>
              )}
              <span className="text-3xl md:text-4xl">{item.emoji}</span>
              <h3 className="mt-2 text-sm font-bold text-[#1e3a5f] md:text-base">{item.label}</h3>
              <CategoryCountLabel count={counts[item.category] ?? 0} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export { OccupationCategories }
