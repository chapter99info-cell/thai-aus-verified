import { PremiumHome } from '@/components/home/PremiumHome'
import { buildCategoryCounts } from '@/lib/categories'
import {
  buildMarqueeTrack,
  mapProviderToMarquee,
  type MarqueeBusiness,
} from '@/lib/marquee-businesses'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ScamAlert } from '@/types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://thai-ausverified.com.au'

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: SITE_URL,
    },
  }
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured()) return {}

  const supabase = await createClient()
  const { data } = await supabase.from('providers').select('job_category, category')
  return buildCategoryCounts(
    (data ?? []).map((row) => ({
      category: row.job_category ?? row.category ?? null,
    }))
  )
}

async function getMarqueeBusinesses(): Promise<MarqueeBusiness[]> {
  if (!isSupabaseConfigured()) {
    return buildMarqueeTrack([])
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('providers')
    .select('id, business_name, job_category, category, profile_image_url')
    .eq('is_verified', true)
    .limit(20)

  const mapped = (data ?? []).map((row) =>
    mapProviderToMarquee({
      ...row,
      category: row.job_category ?? row.category,
    })
  )
  return buildMarqueeTrack(mapped)
}

async function getHomeStats() {
  if (!isSupabaseConfigured()) {
    return { verifiedCount: 0, stateCount: 0, latestAlert: null as ScamAlert | null }
  }

  const supabase = await createClient()

  const [providersRes, alertRes] = await Promise.all([
    supabase.from('providers').select('state').eq('is_verified', true),
    supabase
      .from('scam_alerts')
      .select('title')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const verifiedProviders = providersRes.data ?? []
  const states = new Set(verifiedProviders.map((p) => p.state).filter(Boolean))

  return {
    verifiedCount: verifiedProviders.length,
    stateCount: states.size,
    latestAlert: (alertRes.data as ScamAlert | null) ?? null,
  }
}

export default async function HomePage() {
  const [{ verifiedCount, stateCount, latestAlert }, marqueeBusinesses, categoryCounts] =
    await Promise.all([getHomeStats(), getMarqueeBusinesses(), getCategoryCounts()])

  return (
    <PremiumHome
      verifiedCount={verifiedCount}
      stateCount={stateCount}
      alertTitle={latestAlert?.title}
      marqueeBusinesses={marqueeBusinesses}
      categoryCounts={categoryCounts}
    />
  )
}
