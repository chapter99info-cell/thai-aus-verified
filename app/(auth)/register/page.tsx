import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'ลงทะเบียน | Thai-Aus Verified',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-[#0D1B3E]">ลงทะเบียนธุรกิจ</h1>
        <p className="mt-2 text-base text-[#243B6E]/70">
          ลงทะเบียนใน 30 วินาที — ตรวจสอบ ABN อัตโนมัติ ขึ้น Directory ทันที
        </p>
        <div className="mt-4 rounded-lg border border-[#C9A84C]/30 bg-[#0D1B3E] px-4 py-3 text-sm text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-xs font-bold text-[#0D1B3E]">
              1
            </span>
            <p>กรอก ABN → ข้อมูลธุรกิจ → สร้างบัญชี ใช้เวลาไม่กี่นาที</p>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
