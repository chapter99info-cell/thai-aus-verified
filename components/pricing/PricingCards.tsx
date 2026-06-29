'use client'

import Link from 'next/link'
import { Check, Crown } from 'lucide-react'
import { UpgradeButton } from '@/components/UpgradeButton'

export function PricingCards() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">แผนราคา</h1>
        <p className="mt-2 text-slate-600">เริ่มต้นฟรี ไม่ต้องใช้บัตรเครดิต</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1e3a5f]">FREE</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">ฟรี</p>
          <p className="mt-1 text-sm text-slate-500">ตลอดไป</p>

          <ul className="mt-6 space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              Verified Badge บน Directory
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              ขึ้น Directory ค้นหาได้
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              ยืนยัน ABN อัตโนมัติ
            </li>
          </ul>

          <Link
            href="/register"
            className="mt-8 block w-full rounded-lg border border-[#1e3a5f] py-3 text-center text-sm font-semibold text-[#1e3a5f] hover:bg-slate-50"
          >
            ลงทะเบียนฟรี
          </Link>
        </div>

        <div className="relative rounded-2xl border-2 border-[#1e3a5f] bg-white p-8 shadow-md">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1e3a5f] px-3 py-1 text-xs font-semibold text-white">
            แนะนำ
          </span>
          <div className="flex items-center gap-2">
            <Crown size={22} className="text-[#1e3a5f]" />
            <h2 className="text-xl font-bold text-[#1e3a5f]">PREMIUM</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            A$9<span className="text-base font-normal text-slate-500">/เดือน</span>
          </p>

          <ul className="mt-6 space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              ทุกอย่างใน Free
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              โพสต์โฆษณาใน Facebook Group ได้
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              แสดงลำดับต้นใน Directory
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              ⭐ Premium Verified badge
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-green-600" />
              สนับสนุนชุมชนไทย-ออส
            </li>
          </ul>

          <UpgradeButton className="mt-8 w-full rounded-lg bg-[#1e3a5f] py-3 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50" />
        </div>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-[#1e3a5f]">
        เริ่มต้นฟรี ไม่ต้องใช้บัตรเครดิต
      </p>
    </div>
  )
}
