import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">ลงทะเบียนธุรกิจ</h1>
      <p className="mt-2 text-sm text-slate-600">
        ลงทะเบียนฟรีเพื่อรับ Badge Verified และเข้าถึงลูกค้าคนไทยทั่วออสเตรเลีย
      </p>
      <Link
        href="/verify"
        className="mt-6 inline-block rounded-lg bg-[#1e3a5f] px-6 py-3 text-sm font-medium text-white hover:bg-[#2d5282]"
      >
        เริ่มยืนยันตัวตน →
      </Link>
    </div>
  )
}
