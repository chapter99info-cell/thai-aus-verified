import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/dashboard/SignOutButton'
import { CATEGORY_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Profile, ServiceProvider } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null
  const fullName = profile?.full_name ?? user.email ?? 'ผู้ใช้'

  const { data: providerData } = await supabase
    .from('service_providers')
    .select('*')
    .eq('profile_id', user.id)
    .maybeSingle()

  const provider = providerData as ServiceProvider | null

  const roleLabels: Record<string, string> = {
    member: 'สมาชิก',
    verified_business: 'ธุรกิจยืนยันแล้ว',
    admin: 'ผู้ดูแลระบบ',
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">สวัสดีครับ/ค่ะ {fullName}</h1>
      <p className="mt-1 text-slate-600">แดชบอร์ดของคุณ</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">ข้อมูลบัญชี</h2>
          <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          <span className="mt-3 inline-block rounded-full bg-[#1e3a5f]/10 px-3 py-1 text-xs font-medium text-[#1e3a5f]">
            {roleLabels[profile?.role ?? 'member'] ?? profile?.role}
          </span>
        </div>

        {provider && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">{provider.business_name}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {CATEGORY_LABELS[provider.category]?.th} · {provider.suburb}, {provider.state}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              ⭐ {Number(provider.rating).toFixed(1)} ({provider.review_count} รีวิว)
            </p>

            {provider.verification_status === 'pending' && (
              <span className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                เอกสารของคุณอยู่ระหว่างการตรวจสอบ
              </span>
            )}
            {provider.is_verified && (
              <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                ✅ ธุรกิจของคุณได้รับการยืนยันแล้ว
              </span>
            )}
            {provider.verification_status === 'rejected' && (
              <span className="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                การยืนยันถูกปฏิเสธ — กรุณาอัปโหลดเอกสารใหม่
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {provider && (
          <Link
            href="/verify"
            className="rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
          >
            อัปโหลดเอกสาร KYC
          </Link>
        )}
        {!provider && (
          <Link
            href="/register"
            className="rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
          >
            ลงทะเบียนธุรกิจ
          </Link>
        )}
        {profile?.role === 'admin' && (
          <Link
            href="/admin"
            className="rounded-lg border border-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-[#1e3a5f] hover:bg-slate-50"
          >
            แผงผู้ดูแล
          </Link>
        )}
        <SignOutButton />
      </div>
    </div>
  )
}
