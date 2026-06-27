import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { DashboardToast } from '@/components/dashboard/DashboardToast'
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

  const { data: providerData } = await supabase
    .from('service_providers')
    .select('*')
    .eq('profile_id', user.id)
    .maybeSingle()

  const provider = providerData as ServiceProvider | null
  const displayName = provider?.business_name ?? profile?.full_name ?? user.email ?? 'ผู้ใช้'
  const isPremium = provider?.subscription_status === 'premium'

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Suspense fallback={null}>
        <DashboardToast />
      </Suspense>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">สวัสดีครับ {displayName}</h1>
        {provider?.is_verified && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            ✅ Verified
          </span>
        )}
        {provider && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isPremium ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isPremium ? 'Premium' : 'Free'}
          </span>
        )}
      </div>

      {provider ? (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">ข้อมูลธุรกิจ</h2>
          <p className="mt-2 text-lg font-medium text-[#1e3a5f]">{provider.business_name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {CATEGORY_LABELS[provider.category]?.th} · {provider.suburb}, {provider.state}
          </p>
          {provider.phone && <p className="mt-1 text-sm text-slate-600">📞 {provider.phone}</p>}
          {provider.abn_number && (
            <p className="mt-1 text-sm text-slate-600">ABN: {provider.abn_number}</p>
          )}
          <p className="mt-2 text-sm text-slate-600">
            ⭐ {Number(provider.rating).toFixed(1)} ({provider.review_count} รีวิว)
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">คุณยังไม่ได้ลงทะเบียนธุรกิจ</p>
          <Link
            href="/register"
            className="mt-4 inline-block rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
          >
            ลงทะเบียนธุรกิจ
          </Link>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {provider && !isPremium && (
          <Link
            href="/pricing"
            className="rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
          >
            อัปเกรด Premium A$10/เดือน
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
