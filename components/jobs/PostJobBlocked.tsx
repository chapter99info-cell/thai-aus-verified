import Link from 'next/link'
import { Lock, MessageCircle, Store } from 'lucide-react'
import { LINE_OA_URL } from '@/lib/mvp-constants'
import { GoldButton } from '@/components/mvp/MvpButtons'

export function PostJobBlocked({
  variant,
}: {
  variant: 'not_verified' | 'no_business'
}) {
  if (variant === 'not_verified') {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-8 text-center">
        <Lock className="mx-auto h-12 w-12 text-[#D4A017]" aria-hidden />
        <h1 className="mt-4 text-[22px] font-bold text-[#0D1B3E]">
          หน้านี้สำหรับร้านที่ผ่านการ Verify แล้วเท่านั้น
        </h1>
        <ul className="mt-4 space-y-2 text-left text-base text-[#0D1B3E]">
          <li>• โพสต์ประกาศหางานได้ไม่จำกัด</li>
          <li>• ร้านของคุณจะปรากฏในหน้าร้านค้า Verified</li>
        </ul>
        <div className="mt-6 space-y-3">
          <GoldButton href={LINE_OA_URL}>💬 ติดต่อขอ Verify ร้านของคุณ</GoldButton>
          <Link href="/jobs" className="block text-base font-semibold text-[#0D1B3E] underline">
            ← กลับหน้าหางาน
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-8 text-center">
      <Store className="mx-auto h-12 w-12 text-[#D4A017]" aria-hidden />
      <h1 className="mt-4 text-[22px] font-bold text-[#0D1B3E]">
        ยังไม่พบร้านค้าที่ผ่านการ Verify ของคุณ
      </h1>
      <div className="mt-6 space-y-3">
        <GoldButton href={LINE_OA_URL}>💬 ติดต่อแอดมิน</GoldButton>
        <Link href="/jobs" className="block text-base font-semibold text-[#0D1B3E] underline">
          ← กลับหน้าหางาน
        </Link>
      </div>
    </div>
  )
}
