import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'ลงทะเบียนช่าง | Thai-Aus Verified',
  description: 'ลงทะเบียนช่างและสายอาชีพคนไทย ABN Verified ในออสเตรเลีย',
}

export default function RegisterProfessionalPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-[#0D1B3E]">ลงทะเบียนช่าง / สายอาชีพ</h1>
        <p className="mt-2 text-base text-[#243B6E]/70">
          ยืนยัน ABN กับรัฐบาลออสเตรเลีย — ขึ้น Directory ภายใน 48 ชั่วโมง
        </p>
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <RegisterForm showProgress />
        </div>
      </div>
    </div>
  )
}
