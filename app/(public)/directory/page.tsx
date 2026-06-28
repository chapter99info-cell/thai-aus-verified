import { Suspense } from 'react'
import Link from 'next/link'
import OccupationCategories from '@/components/OccupationCategories'
import { BusinessCard } from '@/components/directory/BusinessCard'
import { SearchFilter } from '@/components/directory/SearchFilter'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { isPremiumProvider } from '@/lib/subscription'
import type { ServiceCategory, ServiceProvider } from '@/types'

const CATEGORY_QUERY_ALIASES: Record<string, ServiceCategory> = {
  'นวดแผนไทย': 'massage',
  'ร้านอาหาร': 'restaurant',
  'ช่างภาพ': 'photography',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    state?: string
    suburb?: string
    verified?: string
    sort?: string
  }>
}

async function fetchBusinesses(params: Awaited<PageProps['searchParams']>) {
  if (!isSupabaseConfigured()) {
    return { businesses: [] as ServiceProvider[], suburbs: [] as string[] }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('service_providers').select('*')

    if (error) throw error

    let businesses = (data ?? []) as ServiceProvider[]
    const suburbs = Array.from(
      new Set(businesses.map((b) => b.suburb).filter(Boolean))
    ).sort()

    if (params.q) {
      const q = params.q.toLowerCase()
      businesses = businesses.filter((b) => b.business_name.toLowerCase().includes(q))
    }
    if (params.category) {
      const resolved =
        CATEGORY_QUERY_ALIASES[params.category] ?? (params.category as ServiceCategory)
      businesses = businesses.filter((b) => b.category === resolved)
    }
    if (params.state) {
      businesses = businesses.filter((b) => b.state === params.state)
    }
    if (params.suburb) {
      businesses = businesses.filter(
        (b) => b.suburb.toLowerCase() === params.suburb!.toLowerCase()
      )
    }
    if (params.verified === 'true') {
      businesses = businesses.filter((b) => b.is_verified)
    }

    if (params.sort === 'rating') {
      businesses.sort((a, b) => {
        const aP = isPremiumProvider(a) ? 1 : 0
        const bP = isPremiumProvider(b) ? 1 : 0
        if (bP !== aP) return bP - aP
        return Number(b.rating) - Number(a.rating)
      })
    } else {
      businesses.sort((a, b) => {
        const aP = isPremiumProvider(a) ? 1 : 0
        const bP = isPremiumProvider(b) ? 1 : 0
        if (bP !== aP) return bP - aP
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    }

    return { businesses, suburbs }
  } catch {
    return { businesses: [] as ServiceProvider[], suburbs: [] as string[] }
  }
}

export default async function DirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { businesses, suburbs } = await fetchBusinesses(params)

  return (
    <>
      <OccupationCategories hero showScrollHint />

      <div className="h-12 bg-gradient-to-b from-black to-white" />

      <div className="bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-slate-500 hover:text-[#1e3a5f]">
            ← กลับหน้าแรก
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">ค้นหาธุรกิจ</h1>
          <p className="mt-2 text-slate-600">พบ {businesses.length} ธุรกิจ</p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <Suspense fallback={<p className="text-sm text-slate-500">กำลังโหลดตัวกรอง...</p>}>
              <SearchFilter suburbs={suburbs} />
            </Suspense>
          </div>

          {businesses.length === 0 ? (
            <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-slate-600">ยังไม่มีธุรกิจในหมวดนี้ เป็นคนแรกที่ลงทะเบียน!</p>
              <Link
                href="/register"
                className="mt-4 inline-block text-sm font-medium text-[#1e3a5f] hover:underline"
              >
                ลงทะเบียนธุรกิจ →
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
