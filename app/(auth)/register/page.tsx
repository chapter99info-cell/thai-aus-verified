import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'ลงทะเบียน | Thai-Aus Verified',
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">ลงทะเบียน</h1>
      <p className="mt-2 text-sm text-slate-600">
        สร้างบัญชีและลงทะเบียนธุรกิจเพื่อรับ Badge Verified
      </p>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
