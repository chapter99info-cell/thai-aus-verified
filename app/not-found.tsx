import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D1B3E] px-4 py-16 text-center">
      <p className="text-7xl font-bold text-[#C9A84C]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">ไม่พบหน้านี้</h1>
      <p className="mt-2 max-w-md text-sm text-white/60">
        หน้าที่คุณค้นหาอาจถูกลบหรือย้ายไปแล้ว
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#0D1B3E] transition-colors hover:bg-[#D4A017]"
      >
        กลับหน้าแรก
      </Link>
    </div>
  )
}
