import { Suspense } from 'react'
import Link from 'next/link'
import OccupationCategories from '@/components/OccupationCategories'
import { DirectorySearchSection } from '@/components/directory/DirectorySearchSection'
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

  return (
    <>
      <OccupationCategories hero showScrollHint />

      <div className="bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-slate-500 hover:text-[#1e3a5f]">
            ← กลับหน้าแรก
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">ค้นหาธุรกิจ</h1>

          <Suspense
            fallback={
              <div className="mt-8 space-y-4">
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 animate-pulse rounded-2xl bg-[#1e3a5f]/4" />
                  ))}
                </div>
              </div>
            }
          >
            <DirectorySearchSection suburbs={suburbs} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
