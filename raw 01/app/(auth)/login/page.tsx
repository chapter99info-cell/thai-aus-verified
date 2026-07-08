import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'เข้าสู่ระบบ | Thai-Aus Verified',
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">เข้าสู่ระบบ</h1>
      <p className="mt-2 text-sm text-slate-600">เข้าสู่ชุมชนธุรกิจไทยในออสเตรเลีย</p>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  )
}
