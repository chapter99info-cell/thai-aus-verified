import Link from 'next/link'
import { HOMEPAGE_CATEGORY_ICONS } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="bg-white px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 inline-flex rounded-full border border-[#1e3a5f]/30 bg-slate-50 px-4 py-1.5 text-sm text-[#1e3a5f]">
          🛡️ ชุมชนบริการสีขาว คนไทยในออสเตรเลีย
        </p>

        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
          ค้นหาบริการไทย ที่เชื่อถือได้ในออสเตรเลีย
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          ทุกธุรกิจในไดเรกทอรีนี้ผ่านการตรวจสอบ ABN และยืนยันตัวตนแล้ว ปลอดภัย ไม่มีโกง
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {HOMEPAGE_CATEGORY_ICONS.map((item) => (
            <Link
              key={item.label}
              href={`/directory?category=${item.category}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#1e3a5f]/20 bg-slate-50 px-3 py-1.5 text-sm text-[#1e3a5f] transition-colors hover:border-[#1e3a5f] hover:bg-white"
            >
              <img
                src={item.icon}
                alt={item.label}
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/directory"
            className="w-full rounded-lg bg-[#1e3a5f] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d5282] sm:w-auto"
          >
            ค้นหาธุรกิจ
          </Link>
          <Link
            href="/register"
            className="w-full rounded-lg border-2 border-[#1e3a5f] px-8 py-3 text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-slate-50 sm:w-auto"
          >
            ลงทะเบียนธุรกิจของคุณ
          </Link>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          500+ ธุรกิจ | ABN Verified | 0 เรื่องโกง
        </p>
      </div>
    </section>
  )
}
