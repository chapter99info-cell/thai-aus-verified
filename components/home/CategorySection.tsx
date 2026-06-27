import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceCategory } from '@/types'

const HOMEPAGE_CATEGORIES: ServiceCategory[] = [
  'accommodation',
  'jobs',
  'restaurant',
  'massage',
  'transport',
  'visa',
]

export function CategorySection() {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          หมวดหมู่บริการ
        </h2>
        <p className="mt-2 text-center text-slate-600">เลือกหมวดที่ต้องการค้นหา</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOMEPAGE_CATEGORIES.map((category) => {
            const meta = CATEGORY_LABELS[category]
            return (
              <Link
                key={category}
                href={`/directory?category=${category}`}
                className="rounded-xl border-2 border-[#1e3a5f]/20 bg-white p-6 transition-colors hover:border-[#1e3a5f] hover:shadow-sm"
              >
                <span className="text-3xl">{meta.emoji}</span>
                <p className="mt-3 text-lg font-semibold text-[#1e3a5f]">{meta.th}</p>
                <p className="text-sm text-slate-500">{meta.en}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
