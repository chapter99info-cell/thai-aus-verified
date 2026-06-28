import Link from 'next/link'
import { CATEGORY_LABELS, HOMEPAGE_CATEGORY_ICONS } from '@/lib/constants'

export function CategorySection() {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          หมวดหมู่บริการ
        </h2>
        <p className="mt-2 text-center text-slate-600">เลือกหมวดที่ต้องการค้นหา</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOMEPAGE_CATEGORY_ICONS.map((item) => {
            const meta = CATEGORY_LABELS[item.category]
            return (
              <Link
                key={item.label}
                href={`/directory?category=${item.category}`}
                className="rounded-xl border-2 border-[#1e3a5f]/20 bg-white p-6 transition-colors hover:border-[#1e3a5f] hover:shadow-sm"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <p className="mt-3 text-lg font-semibold text-[#1e3a5f]">{item.label}</p>
                <p className="text-sm text-slate-500">{meta.en}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
