import { Store } from 'lucide-react'
import {
  ShopCard,
  ShopFilterBar,
  ShopsEmptyState,
} from '@/components/shops/ShopDirectoryParts'
import { JobsPagination } from '@/components/jobs/JobBoardParts'
import { MvpErrorState } from '@/components/mvp/MvpStates'
import { parsePageParam, totalPages } from '@/lib/job-board'
import { SHOP_PAGE_SIZE } from '@/lib/mvp-constants'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { JobBoardBusiness, JobBoardBusinessType } from '@/types/job-board'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'ร้านค้า Verified | Thai-Aus Verified',
  description: 'รายชื่อร้านอาหารและร้านนวดไทยที่ผ่านการ Verify ในออสเตรเลีย',
}

const BASE_PATH = '/shops'

interface Props {
  searchParams: Promise<{ page?: string; type?: string; search?: string }>
}

export default async function ShopsDirectoryPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parsePageParam(params.page)
  const typeFilter = params.type ?? ''
  const query = params.search?.trim() ?? ''
  const from = (page - 1) * SHOP_PAGE_SIZE
  const to = from + SHOP_PAGE_SIZE - 1

  if (!isSupabaseConfigured()) {
    return (
      <PageShell>
        <MvpErrorState
          title="ไม่สามารถโหลดรายชื่อร้านได้"
          message="ระบบยังไม่ได้ตั้งค่า กรุณาลองใหม่ภายหลัง"
          actionHref="/"
          actionLabel="กลับหน้าแรก"
        />
      </PageShell>
    )
  }

  const supabase = await createClient()

  let dbQuery = supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .eq('is_verified', true)
    .order('business_name', { ascending: true })

  if (typeFilter === 'restaurant' || typeFilter === 'massage') {
    dbQuery = dbQuery.eq('business_type', typeFilter as JobBoardBusinessType)
  }

  if (query) {
    dbQuery = dbQuery.or(
      `business_name.ilike.%${query}%,state.ilike.%${query}%,suburb.ilike.%${query}%`
    )
  }

  const { data, error, count } = await dbQuery.range(from, to)

  if (error) {
    return (
      <PageShell>
        <MvpErrorState
          title="โหลดรายชื่อร้านไม่สำเร็จ"
          message="เกิดข้อผิดพลาดชั่วคราว กรุณากดรีเฟรชหรือลองใหม่อีกครั้ง"
          actionHref={BASE_PATH}
          actionLabel="ลองใหม่"
        />
      </PageShell>
    )
  }

  const shops = (data ?? []) as JobBoardBusiness[]
  const pages = totalPages(count ?? 0, SHOP_PAGE_SIZE)
  const hasFilter = Boolean(typeFilter || query)
  const paginationBase = buildPaginationBase(typeFilter, query)

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-[22px] font-bold text-[#0D1B3E]">
          <Store className="h-7 w-7 text-[#D4A017]" aria-hidden />
          ร้านค้า Verified
        </h1>
        <p className="mt-1 text-base text-[#0D1B3E]">ร้านอาหารและร้านนวดไทยที่ผ่านการตรวจสอบแล้ว</p>
      </div>

      <ShopFilterBar
        basePath={BASE_PATH}
        currentType={typeFilter}
        currentSearch={query}
      />

      <div className="mt-6">
        {shops.length === 0 ? (
          <ShopsEmptyState basePath={BASE_PATH} hasFilter={hasFilter} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
            <JobsPagination page={page} totalPages={pages} basePath={paginationBase} />
          </>
        )}
      </div>
    </PageShell>
  )
}

function buildPaginationBase(type: string, search: string): string {
  const params = new URLSearchParams()
  if (type) params.set('type', type)
  if (search) params.set('search', search)
  const qs = params.toString()
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  )
}
