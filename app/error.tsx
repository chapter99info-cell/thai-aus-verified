'use client'

import Link from 'next/link'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">เกิดข้อผิดพลาด</h1>
      <p className="mt-2 text-slate-600">เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2d5282]"
        >
          ลองใหม่
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[#1e3a5f] px-6 py-3 text-sm font-semibold text-[#1e3a5f] hover:bg-slate-50"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  )
}
