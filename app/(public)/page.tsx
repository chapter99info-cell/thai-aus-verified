import { PremiumHome } from '@/components/home/PremiumHome'
import { mergeMarqueeBusinesses, type MarqueeBusiness } from '@/lib/marquee-businesses'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ScamAlert } from '@/types'

export const dynamic = 'force-dynamic'

async function getMarqueeBusinesses(): Promise<MarqueeBusiness[]> {
  if (!isSupabaseConfigured()) {
    return mergeMarqueeBusinesses([])
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('service_providers')
    .select('id, business_name, profile_image_url, state')
    .eq('is_verified', true)
    .eq('verification_status', 'approved')
    .limit(20)

  const mapped: MarqueeBusiness[] = (data ?? []).map((row) => ({
    id: row.id,
    business_name: row.business_name,
    logo_url: row.profile_image_url ?? null,
    state: row.state,
  }))

  return mergeMarqueeBusinesses(mapped)
}

async function getHomeStats() {
  if (!isSupabaseConfigured()) {
    return { verifiedCount: 0, stateCount: 0, latestAlert: null as ScamAlert | null }
  }

  const supabase = await createClient()

  const [providersRes, alertRes] = await Promise.all([
    supabase.from('service_providers').select('state').eq('is_verified', true),
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
  const [{ verifiedCount, stateCount, latestAlert }, marqueeBusinesses] = await Promise.all([
    getHomeStats(),
    getMarqueeBusinesses(),
  ])

  return (
    <PremiumHome
      verifiedCount={verifiedCount}
      stateCount={stateCount}
      alertTitle={latestAlert?.title}
      marqueeBusinesses={marqueeBusinesses}
    />
  )
}
