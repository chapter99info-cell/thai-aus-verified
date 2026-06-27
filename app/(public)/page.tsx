import Link from 'next/link'
import { CategorySection } from '@/components/home/CategorySection'
import { HeroSection } from '@/components/home/HeroSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">วิธีใช้งาน</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl">🔍</p>
              <p className="mt-3 font-semibold text-[#1e3a5f]">ค้นหาบริการที่ต้องการ</p>
            </div>
            <div>
              <p className="text-3xl">✅</p>
              <p className="mt-3 font-semibold text-[#1e3a5f]">เช็ค Badge &quot;Verified&quot; สีเขียว</p>
            </div>
            <div>
              <p className="text-3xl">📞</p>
              <p className="mt-3 font-semibold text-[#1e3a5f]">ติดต่อได้เลย ปลอดภัย 100%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-4 mb-8 rounded-xl bg-[#fef3c7] px-4 py-4 sm:mx-6">
        <p className="text-center text-sm text-amber-900 sm:text-base">
          ⚠️{' '}
          <Link href="/alerts" className="font-medium underline hover:text-amber-950">
            แจ้งเตือนภัย: ระวังการโกงค่าเช่าบ้านและงานออนไลน์ ดูรายละเอียด →
          </Link>
        </p>
      </section>

      <section className="bg-[#1e3a5f] px-4 py-16 text-center text-white sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">เจ้าของธุรกิจ? ลงทะเบียนวันนี้ฟรี</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          รับ Badge Verified และเข้าถึงลูกค้าคนไทยทั่วออสเตรเลีย
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-slate-100"
        >
          ลงทะเบียนเลย
        </Link>
      </section>
    </>
  )
}
