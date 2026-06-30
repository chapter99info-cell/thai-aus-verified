import Link from 'next/link'
import { Calendar, Camera, MessageCircle, Smartphone, Sparkles } from 'lucide-react'
import { DigitalMenuDemo } from '@/components/services/DigitalMenuDemo'
import { LINE_OA_URL } from '@/lib/mvp-constants'

export const metadata = {
  title: 'บริการดิจิทัล | Thai-Aus Verified',
  description: 'เมนู QR Code ระบบจองคิว และถ่ายภาพอาหารสำหรับร้านไทยในออสเตรเลีย',
}

function LineCta({ label, large }: { label: string; large?: boolean }) {
  return (
    <Link
      href={LINE_OA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] text-base font-semibold text-[#0D1B3E] transition-opacity hover:opacity-90 ${
        large ? 'min-h-[56px] text-lg' : 'min-h-[52px]'
      }`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      {label}
    </Link>
  )
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#0D1B3E] px-4 py-12 text-center sm:px-6">
        <Sparkles className="mx-auto h-10 w-10 text-[#D4A017]" aria-hidden />
        <h1 className="mt-4 text-[22px] font-bold text-white sm:text-3xl">
          ยกระดับธุรกิจของคุณด้วยเทคโนโลยี
        </h1>
        <p className="mt-3 text-base text-[#D4A017]">บริการครบวงจรสำหรับร้านไทยในออสเตรเลีย</p>
        <div className="mx-auto mt-6 max-w-md">
          <LineCta label="💬 ปรึกษาฟรีผ่าน Line" />
        </div>
      </section>

      <div className="mx-auto max-w-2xl space-y-12 px-4 py-10 sm:px-6">
        <section>
          <h2 className="flex items-center gap-2 text-[22px] font-bold text-[#0D1B3E]">
            <Smartphone className="h-6 w-6 text-[#D4A017]" aria-hidden />
            📱 เมนูดิจิทัล QR Code
          </h2>
          <ul className="mt-4 space-y-2 text-base text-[#0D1B3E]">
            <li>• ลูกค้าสแกน QR สั่งอาหารได้ทันที ไม่ต้องรอพนักงาน</li>
            <li>• อัปเดตราคาและเมนูได้เองง่ายๆ ไม่มีค่าพิมพ์ซ้ำ</li>
            <li>• รองรับทั้ง iPhone และ Android ทุกรุ่น</li>
          </ul>
          <div className="mt-6">
            <DigitalMenuDemo />
          </div>
          <div className="mt-6">
            <LineCta label="💬 สนใจระบบนี้? ปรึกษาฟรีผ่าน Line" />
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-[22px] font-bold text-[#0D1B3E]">
            <Calendar className="h-6 w-6 text-[#D4A017]" aria-hidden />
            📅 ระบบจองคิวออนไลน์
          </h2>
          <ul className="mt-4 space-y-2 text-base text-[#0D1B3E]">
            <li>• ลูกค้าจองได้ตลอด 24 ชั่วโมง ไม่ต้องรอโทรถาม</li>
            <li>• ลดการจองซ้อน ระบบตรวจสอบเวลาว่างอัตโนมัติ</li>
            <li>• แจ้งเตือนนัดหมายผ่าน Line อัตโนมัติ</li>
          </ul>
          <p className="mt-4 text-base font-semibold text-[#0D1B3E]">ตัวอย่างหน้าจองคิว (Demo เท่านั้น)</p>
          <div className="mt-3 space-y-4 rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-5 opacity-70">
            <div>
              <label className="mb-2 block text-base font-semibold text-[#0D1B3E]">ชื่อ-นามสกุล</label>
              <input
                disabled
                readOnly
                value="Maria Thompson"
                className="w-full rounded-xl border-2 border-[#0D1B3E]/20 bg-[#0D1B3E]/5 px-4 py-3 text-base text-[#0D1B3E]"
              />
            </div>
            <div>
              <label className="mb-2 block text-base font-semibold text-[#0D1B3E]">วันที่</label>
              <input
                disabled
                readOnly
                value="15 กรกฎาคม 2025"
                className="w-full rounded-xl border-2 border-[#0D1B3E]/20 bg-[#0D1B3E]/5 px-4 py-3 text-base text-[#0D1B3E]"
              />
            </div>
            <div>
              <label className="mb-2 block text-base font-semibold text-[#0D1B3E]">บริการ</label>
              <select
                disabled
                className="w-full rounded-xl border-2 border-[#0D1B3E]/20 bg-[#0D1B3E]/5 px-4 py-3 text-base text-[#0D1B3E]"
              >
                <option>นวดไทย 60 นาที - $65</option>
              </select>
            </div>
            <button
              type="button"
              disabled
              className="min-h-[52px] w-full rounded-xl bg-[#0D1B3E] text-base font-semibold text-white opacity-70"
            >
              จองเลย
            </button>
          </div>
          <div className="mt-6">
            <LineCta label="💬 ปรึกษาฟรีผ่าน Line" />
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-[22px] font-bold text-[#0D1B3E]">
            <Camera className="h-6 w-6 text-[#D4A017]" aria-hidden />
            📸 ถ่ายภาพอาหารและบรรยากาศร้าน
          </h2>
          <ul className="mt-4 space-y-2 text-base text-[#0D1B3E]">
            <li>• ภาพถ่ายคุณภาพสูงจากช่างภาพมืออาชีพ 30 ปีประสบการณ์</li>
            <li>• เพิ่มยอดสั่งอาหาร Delivery ด้วยภาพที่น่าดึงดูด</li>
            <li>• ได้รับไฟล์ JPG ความละเอียดสูง พร้อมใช้งานทันที</li>
          </ul>
          <div className="mt-6">
            <LineCta label="💬 ปรึกษาฟรีผ่าน Line" />
          </div>
        </section>
      </div>

      <section className="bg-[#0D1B3E] px-4 py-12 text-center sm:px-6">
        <h2 className="text-[22px] font-bold text-[#D4A017]">พร้อมเริ่มต้นแล้ว? คุยกับเราได้เลยวันนี้</h2>
        <div className="mx-auto mt-6 max-w-md">
          <LineCta label="💬 ติดต่อฟรีผ่าน Line" large />
        </div>
      </section>
    </div>
  )
}
