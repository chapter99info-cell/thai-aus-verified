import Link from 'next/link'
import { CategorySection } from '@/components/home/CategorySection'
import { HeroSection } from '@/components/home/HeroSection'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ScamAlert } from '@/types'

export const dynamic = 'force-dynamic'

async function getHomeStats() {
  if (!isSupabaseConfigured()) {
    return { verifiedCount: 0, reviewCount: 0, stateCount: 0, latestAlert: null as ScamAlert | null }
  }

  const supabase = await createClient()

  const [providersRes, reviewsRes, alertRes] = await Promise.all([
    supabase.from('service_providers').select('state').eq('is_verified', true),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
    supabase
      .from('scam_alerts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const verifiedProviders = providersRes.data ?? []
  const states = new Set(verifiedProviders.map((p) => p.state).filter(Boolean))

  return {
    verifiedCount: verifiedProviders.length,
    reviewCount: reviewsRes.count ?? 0,
    stateCount: states.size,
    latestAlert: (alertRes.data as ScamAlert | null) ?? null,
  }
}

export default async function HomePage() {
  const { verifiedCount, reviewCount, stateCount, latestAlert } = await getHomeStats()

  return (
    <>
      <HeroSection />
      <CategorySection />

      {latestAlert && (
        <section className="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:mx-6">
          <p className="text-center text-sm text-amber-900 sm:text-base">
            ⚠️ <span className="font-medium">{latestAlert.title}</span>{' '}
            <Link href="/alerts" className="font-medium underline hover:text-amber-950">
              ดูทั้งหมด →
            </Link>
          </p>
        </section>
      )}

      <section className="bg-[#1e3a5f]/5 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-[#1e3a5f]">ชุมชนของเรา</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#1e3a5f]">{verifiedCount}</p>
              <p className="mt-2 text-sm text-slate-600">ธุรกิจ Verified</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#1e3a5f]">{reviewCount}</p>
              <p className="mt-2 text-sm text-slate-600">รีวิวจากสมาชิก</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#1e3a5f]">{stateCount}</p>
              <p className="mt-2 text-sm text-slate-600">รัฐที่ครอบคลุม</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">วิธีใช้งาน</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl">🔍</p>
              <p className="mt-3 font-semibold text-[#1e3a5f]">ค้นหาบริการที่ต้องการ</p>
            </div>
            <div>
              <p className="text-3xl">✅</p>
              <p className="mt-3 font-semibold text-[#1e3a5f]">เช็ค Badge &quot;Verified&quot; สีเขียว</p>
            </div>
            <div>
              <p className="text-3xl">📞</p>
              <p className="mt-3 font-semibold text-[#1e3a5f]">ติดต่อได้เลย ปลอดภัย 100%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1e3a5f] px-4 py-16 text-center text-white sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">เจ้าของธุรกิจ? ลงทะเบียนวันนี้ฟรี</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          รับ Badge Verified และเข้าถึงลูกค้าคนไทยทั่วออสเตรเลีย
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-slate-100"
        >
          ลงทะเบียนเลย
        </Link>
      </section>
    </>
  )
}
