import { Suspense } from 'react'
import Link from 'next/link'
import OccupationCategories from '@/components/OccupationCategories'
import { DirectorySearchSection } from '@/components/directory/DirectorySearchSection'
import { buildCategoryCounts } from '@/lib/categories'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function fetchSuburbs() {
  if (!isSupabaseConfigured()) return [] as string[]

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('service_providers').select('suburb')

    if (error) throw error

    return Array.from(
      new Set((data ?? []).map((row) => row.suburb).filter(Boolean))
    ).sort() as string[]
  } catch {
    return [] as string[]
  }
}

export default async function DirectoryPage() {
  const suburbs = await fetchSuburbs()
  let categoryCounts: Record<string, number> = {}

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data } = await supabase.from('service_providers').select('category')
    categoryCounts = buildCategoryCounts(data)
  }

  return (
    <div className="bg-[#F5F5F0]">
      <div className="bg-[#0D1B3E] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-white/60 hover:text-[#C9A84C]">
            ← กลับหน้าแรก
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">ค้นหาธุรกิจ</h1>
          <p className="mt-2 text-base text-white/70">
            ธุรกิจไทยที่ผ่านการยืนยัน ABN ทั่วออสเตรเลีย
          </p>
        </div>
      </div>

      <OccupationCategories hero showScrollHint initialCounts={categoryCounts} />

      <div className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Suspense
            fallback={
              <div className="mt-8 space-y-4">
                <div className="h-12 animate-pulse rounded-xl bg-white" />
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 animate-pulse rounded-2xl bg-white" />
                  ))}
                </div>
              </div>
            }
          >
            <DirectorySearchSection suburbs={suburbs} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
