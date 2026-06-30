'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Crown } from 'lucide-react'
import { UpgradeButton } from '@/components/UpgradeButton'

const VALID_PROMO_CODES = ['THAIAUS3FREE', 'EARLYBIRD']

export function PricingCards() {
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState('')

  function handleApplyPromo() {
    const code = promoCode.trim().toUpperCase()
    if (VALID_PROMO_CODES.includes(code)) {
      setPromoMessage('✅ โค้ดใช้ได้! รับฟรี 3 เดือนเมื่อสมัคร Premium')
      return
    }
    setPromoMessage('โค้ดไม่ถูกต้อง ลองใช้ THAIAUS3FREE')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">แผนราคา</h1>
        <p className="mt-2 text-slate-600">เริ่มต้นฟรี ไม่ต้องใช้บัตรเครดิต</p>
      </div>

      <div className="mb-8 mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center">
        <p className="text-lg font-bold text-amber-800">
          🎉 Early Adopter Special — สมัครตอนนี้รับฟรี 3 เดือนแรก!
        </p>
        <p className="mt-1 text-sm text-amber-700">
          สำหรับ 50 ธุรกิจแรกเท่านั้น — ไม่ต้องใช้บัตรเครดิต
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1e3a5f]">FREE</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900">ฟรี</p>
          <p className="mt-1 text-sm text-slate-500">ตลอดไป</p>
          <p className="mt-3 text-sm font-medium text-slate-600">
            เหมาะสำหรับ: ธุรกิจที่เพิ่งเริ่มต้น
          </p>

          <ul className="mt-6">
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>✅</span>
              <span>ค้นหาร้านค้าในไดเรกทอรี</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>✅</span>
              <span>กดติดต่อร้านได้ทุกช่องทาง (โทร, Line, Facebook, อีเมล)</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>✅</span>
              <span>ค้นหางานในชุมชนไทย</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>✅</span>
              <span>อ่านบทความกฎหมายและวีซ่า</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>✅</span>
              <span>แจ้งเตือนภัยร้านค้าต้มตุ๋น (Scam Alerts)</span>
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
          <p className="mt-2">
            <s className="text-slate-400">A$9/เดือน</s>
          </p>
          <p className="mt-1 text-2xl font-bold text-green-600">ฟรี 3 เดือน</p>
          <p className="mt-1 text-xs text-slate-500">จากนั้น A$9/เดือน — ยกเลิกได้ตลอด</p>

          <ul className="mt-6">
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>🌟</span>
              <span>ทุกอย่างในแผนฟรี</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>📢</span>
              <span>โพสต์ประกาศรับสมัครงานได้ไม่จำกัด</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>🏆</span>
              <span>Badge &quot;Verified Premium&quot; สีทอง บนโปรไฟล์ร้าน</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>⬆️</span>
              <span>ร้านของคุณขึ้นอันดับต้นๆ ในการค้นหา</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>📊</span>
              <span>ดูสถิติว่ามีคนดูร้านคุณกี่คน (Analytics)</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>💼</span>
              <span>เข้าร่วม Facebook Group เจ้าของธุรกิจไทย</span>
            </li>
            <li className="flex items-start gap-2 py-2 text-base leading-relaxed text-[#0D1B3E]">
              <span className="shrink-0" aria-hidden>🎯</span>
              <span>รับโอกาสถูกแนะนำในบทความและโซเชียล</span>
            </li>
          </ul>

          <UpgradeButton
            label="สมัครฟรี 3 เดือน"
            className="mt-8 w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          />

          <div className="mt-4">
            <label htmlFor="promo-code" className="block text-sm font-medium text-slate-700">
              มีโค้ดส่วนลดไหม?
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="promo-code"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="EARLYBIRD"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="shrink-0 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d5282]"
              >
                ใช้โค้ด
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">ใช้โค้ด THAIAUS3FREE รับฟรี 3 เดือน</p>
            {promoMessage && (
              <p className="mt-2 text-xs font-medium text-green-700">{promoMessage}</p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-[#1e3a5f]">
        เริ่มต้นฟรี ไม่ต้องใช้บัตรเครดิต
      </p>
    </div>
  )
}
