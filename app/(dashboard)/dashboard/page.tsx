import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import OccupationCategories from '@/components/OccupationCategories'
import { PremiumBadge, VerifiedBadge } from '@/components/business/PremiumBadge'
import { DashboardToast } from '@/components/dashboard/DashboardToast'
import { SignOutButton } from '@/components/dashboard/SignOutButton'
import { CATEGORY_LABELS } from '@/lib/constants'
import {
  graceDaysRemaining,
  isInPaymentGrace,
  isPremiumProvider,
} from '@/lib/subscription'
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
  const isPremium = provider ? isPremiumProvider(provider) : false
  const inGrace = provider ? isInPaymentGrace(provider) : false
  const graceDays = provider ? graceDaysRemaining(provider) : null
  const showExpiredBanner =
    provider &&
    provider.subscription_status === 'free' &&
    provider.subscription_grace_until &&
    new Date(provider.subscription_grace_until) <= new Date()

  return (
    <>
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Suspense fallback={null}>
        <DashboardToast />
      </Suspense>

      {inGrace && graceDays !== null && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          ⚠️ การชำระเงินล้มเหลว กรุณาอัปเดตข้อมูลบัตรภายใน {graceDays} วัน
          <Link href="/pricing" className="ml-2 font-medium underline">
            อัปเดตการชำระเงิน
          </Link>
        </div>
      )}

      {showExpiredBanner && !inGrace && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          สมาชิก Premium หมดอายุแล้ว{' '}
          <Link href="/pricing" className="font-medium text-[#1e3a5f] hover:underline">
            กดที่นี่เพื่อต่ออายุ
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">สวัสดีครับ {displayName}</h1>
        {provider?.is_verified && <VerifiedBadge />}
        {isPremium && <PremiumBadge />}
        {provider && !isPremium && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Free
          </span>
        )}
      </div>

      {provider ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
          <Link
            href={`/business/${provider.id}`}
            className="mt-4 inline-block text-sm font-medium text-[#1e3a5f] hover:underline"
          >
            ดูโปรไฟล์สาธารณะ →
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">คุณยังไม่ได้ลงทะเบียนธุรกิจ</p>
          <Link
            href="/register"
            className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
          >
            ลงทะเบียนธุรกิจ
          </Link>
        </div>
      )}
    </div>

    <OccupationCategories />

    <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
      <div className="flex flex-wrap gap-3">
        {provider && !isPremium && (
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
          >
            อัปเกรด Premium A$9/เดือน
          </Link>
        )}
        {profile?.role === 'admin' && (
          <Link
            href="/admin"
            className="inline-flex min-h-12 items-center rounded-xl border-2 border-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-[#1e3a5f] hover:bg-slate-50"
          >
            แผงผู้ดูแล
          </Link>
        )}
        <SignOutButton />
      </div>
    </div>
    </>
  )
}
