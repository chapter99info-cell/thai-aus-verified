'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type SuccessData = {
  businessName: string
  category: string
  state: string
  suburb: string
  abn: string
  email: string
}

const STORAGE_KEY = 'thai_aus_register_success'

export default function RegisterSuccessPage() {
  const [data, setData] = useState<SuccessData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        setData(JSON.parse(raw) as SuccessData)
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      setData(null)
    }
  }, [])

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://thai-ausverified.com.au'
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F0] px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-[#C9A84C]/30 bg-white p-8 shadow-lg">
        <div className="text-center">
          <span className="text-5xl" aria-hidden>
            🎉
          </span>
          <h1 className="mt-4 text-2xl font-bold text-[#0D1B3E]">ส่งใบสมัครแล้ว!</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#243B6E]/80">
            ทีมงานจะตรวจสอบ ABN ของคุณภายใน 48 ชั่วโมง
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#243B6E]/80">
            คุณจะได้รับการแจ้งเตือนเมื่อโปรไฟล์ได้รับการยืนยัน
          </p>
        </div>

        {data && (
          <div className="mt-8 rounded-xl border border-gray-100 bg-[#F5F5F0] p-5">
            <h2 className="text-sm font-bold text-[#0D1B3E]">สรุปข้อมูลที่ส่ง</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#243B6E]/60">ธุรกิจ</dt>
                <dd className="text-right font-medium text-[#0D1B3E]">{data.businessName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#243B6E]/60">ประเภท</dt>
                <dd className="text-right text-[#0D1B3E]">{data.category}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#243B6E]/60">ที่ตั้ง</dt>
                <dd className="text-right text-[#0D1B3E]">
                  {data.suburb}, {data.state}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#243B6E]/60">ABN</dt>
                <dd className="text-right text-[#0D1B3E]">{data.abn}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#243B6E]/60">อีเมล</dt>
                <dd className="text-right text-[#0D1B3E]">{data.email}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-lg bg-[#C9A84C] py-3 text-center text-sm font-bold text-[#0D1B3E] transition-colors hover:bg-[#D4A017]"
          >
            กลับหน้าแรก
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-lg border border-[#0D1B3E] py-3 text-sm font-semibold text-[#0D1B3E] transition-colors hover:bg-[#0D1B3E]/5"
          >
            {copied ? 'คัดลอกแล้ว ✓' : 'แชร์ให้เพื่อน'}
          </button>
        </div>
      </div>
    </div>
  )
}
