import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata = {
  title: 'Admin | Thai-Aus Verified',
}

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">แผงผู้ดูแลระบบ</h1>
      <p className="mt-1 text-sm text-slate-600">อนุมัติธุรกิจและจัดการแจ้งเตือนภัย</p>
      <div className="mt-8">
        <AdminDashboard />
      </div>
    </div>
  )
}
