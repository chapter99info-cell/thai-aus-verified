'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ServiceCategory } from '@/types'

const CATEGORIES: { emoji: string; label: string; category: ServiceCategory }[] = [
  { emoji: '🍜', label: 'ร้านอาหาร', category: 'restaurant' },
  { emoji: '💆', label: 'นวดและสปา', category: 'massage' },
  { emoji: '📸', label: 'ช่างภาพ', category: 'photography' },
  { emoji: '🔧', label: 'ช่างฝีมือ', category: 'tradesperson' },
  { emoji: '🏠', label: 'อสังหาริมทรัพย์', category: 'accommodation' },
  { emoji: '🚗', label: 'ขนส่ง', category: 'transport' },
]

export default function OccupationCategories({
  hero = false,
  showScrollHint = false,
}: {
  hero?: boolean
  showScrollHint?: boolean
  showGradient?: boolean
} = {}) {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
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
  }, [])

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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((item) => (
            <Link
              key={item.category}
              href={`/directory?category=${item.category}`}
              className="block rounded-2xl border-2 border-[#1e3a5f] bg-white p-6 text-center transition-shadow hover:shadow-md"
            >
              <span className="text-4xl">{item.emoji}</span>
              <h3 className="mt-2 font-bold text-[#1e3a5f]">{item.label}</h3>
              <span className="mt-1 block text-sm text-slate-500">
                {counts[item.category] ?? 0} ธุรกิจ
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export { OccupationCategories }
