'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BusinessCard } from '@/components/directory/BusinessCard'
import { SearchFilter } from '@/components/directory/SearchFilter'
import {
  getCategoryThaiLabel,
  resolveCategoryFromQuery,
} from '@/lib/categories'
import { createClient } from '@/lib/supabase/client'
import { isPremiumProvider } from '@/lib/subscription'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceCategory, ServiceProvider } from '@/types'

interface DirectorySearchSectionProps {
  suburbs: string[]
}

interface SearchFilters {
  searchText: string
  category: string
  state: string
  suburb: string
  verifiedOnly: boolean
  sort: string
}

function sortResults(businesses: ServiceProvider[], sort: string) {
  const sorted = [...businesses]
  if (sort === 'rating') {
    sorted.sort((a, b) => {
      const aP = isPremiumProvider(a) ? 1 : 0
      const bP = isPremiumProvider(b) ? 1 : 0
      if (bP !== aP) return bP - aP
      return Number(b.rating) - Number(a.rating)
    })
  } else {
    sorted.sort((a, b) => {
      const aP = isPremiumProvider(a) ? 1 : 0
      const bP = isPremiumProvider(b) ? 1 : 0
      if (bP !== aP) return bP - aP
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }
  return sorted
}

export function DirectorySearchSection({ suburbs }: DirectorySearchSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const skipUrlEffect = useRef(false)

  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState('')
  const [state, setState] = useState('')
  const [suburb, setSuburb] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState('newest')
  const [results, setResults] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)

  const runSearch = useCallback(async (filters: SearchFilters) => {
    setLoading(true)
    setHasSearched(true)

    try {
      const supabase = createClient()
      let query = supabase
        .from('service_providers')
        .select(
          'id, business_name, category, state, suburb, abn_number, verification_status, is_verified, phone, whatsapp, line_id, facebook_url, instagram_url, youtube_url, tiktok_url, google_maps_url, profile_image_url, portfolio_url, website, rating, review_count, created_at, subscription_status, subscription_grace_until'
        )

      if (filters.searchText.trim()) {
        query = query.ilike('business_name', `%${filters.searchText.trim()}%`)
      }
      if (filters.category && filters.category !== 'ทุกประเภท') {
        query = query.eq('category', filters.category)
      }
      if (filters.state && filters.state !== 'ทุกรัฐ') {
        query = query.eq('state', filters.state)
      }
      if (filters.suburb) {
        query = query.ilike('suburb', filters.suburb)
      }
      if (filters.verifiedOnly) {
        query = query.eq('is_verified', true)
      }

      const { data, error } = await query.limit(20)

      if (error) throw error

      setResults(sortResults((data ?? []) as ServiceProvider[], filters.sort))
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const syncUrl = useCallback(
    (filters: SearchFilters) => {
      const params = new URLSearchParams()
      if (filters.searchText.trim()) params.set('q', filters.searchText.trim())
      if (filters.category) params.set('category', filters.category)
      if (filters.state) params.set('state', filters.state)
      if (filters.suburb) params.set('suburb', filters.suburb)
      if (filters.verifiedOnly) params.set('verified', 'true')
      if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort)
      const qs = params.toString()
      router.replace(qs ? `/directory?${qs}` : '/directory', { scroll: false })
    },
    [router]
  )

  const handleSearch = useCallback(() => {
    const filters: SearchFilters = {
      searchText,
      category,
      state,
      suburb,
      verifiedOnly,
      sort,
    }
    skipUrlEffect.current = true
    syncUrl(filters)
    void runSearch(filters)
  }, [searchText, category, state, suburb, verifiedOnly, sort, syncUrl, runSearch])

  useEffect(() => {
    if (skipUrlEffect.current) {
      skipUrlEffect.current = false
      return
    }

    const catParam = searchParams.get('category') ?? ''
    const resolvedCategory = resolveCategoryFromQuery(catParam)

    const filters: SearchFilters = {
      searchText: searchParams.get('q') ?? searchParams.get('search') ?? '',
      category: resolvedCategory,
      state: searchParams.get('state') ?? '',
      suburb: searchParams.get('suburb') ?? '',
      verifiedOnly: searchParams.get('verified') === 'true',
      sort: searchParams.get('sort') ?? 'newest',
    }

    setSearchText(filters.searchText)
    setCategory(filters.category)
    setState(filters.state)
    setSuburb(filters.suburb)
    setVerifiedOnly(filters.verifiedOnly)
    setSort(filters.sort)

    void runSearch(filters)
  }, [searchParams.toString(), runSearch])

  const stateLabel = state && state !== 'ทุกรัฐ' ? state : null
  const activeCategoryLabel =
    category && category in CATEGORY_LABELS
      ? getCategoryThaiLabel(category as ServiceCategory)
      : null

  return (
    <>
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <SearchFilter
          suburbs={suburbs}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          category={category}
          onCategoryChange={setCategory}
          state={state}
          onStateChange={setState}
          suburb={suburb}
          onSuburbChange={setSuburb}
          verifiedOnly={verifiedOnly}
          onVerifiedOnlyChange={setVerifiedOnly}
          sort={sort}
          onSortChange={setSort}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-[#1e3a5f]/4" />
          ))}
        </div>
      ) : hasSearched ? (
        <>
          {activeCategoryLabel && (
            <div className="mb-4 mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">หมวดหมู่:</span>
              <span className="rounded-full bg-[#1e3a5f] px-3 py-1 text-sm text-white">
                {activeCategoryLabel}
              </span>
              <Link href="/directory" className="text-xs text-gray-400 underline">
                ล้างตัวกรอง
              </Link>
            </div>
          )}

          <p className={`text-sm text-[#1e3a5f]/50 ${activeCategoryLabel ? '' : 'mt-4'}`}>
            {results.length === 0 ? (
              <span className="text-xs italic text-[#1e3a5f]/50">เปิดรับลงทะเบียน</span>
            ) : (
              <>
                พบ {results.length} ธุรกิจ
                {stateLabel ? ` ใน ${stateLabel}` : ' ทั่วออสเตรเลีย'}
              </>
            )}
          </p>

          {results.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-2 text-lg font-bold text-[#1e3a5f]">ไม่พบธุรกิจในหมวดนี้</h3>
              <p className="mb-6 text-sm text-[#1e3a5f]/50">เป็นคนแรกที่ลงทะเบียนในหมวดนี้!</p>
              <Link
                href="/register"
                className="inline-block rounded-full bg-[#1e3a5f] px-6 py-3 text-sm font-bold text-white"
              >
                ลงทะเบียนธุรกิจฟรี →
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </>
      ) : null}
    </>
  )
}
