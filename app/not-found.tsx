import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-bold text-[#1e3a5f]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">ไม่พบหน้าที่ต้องการ</h1>
      <p className="mt-2 text-slate-600">หน้าที่คุณค้นหาอาจถูกลบหรือย้ายไปแล้ว</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2d5282]"
      >
        กลับหน้าแรก
      </Link>
    </div>
  )
}
