import { PremiumHome } from '@/components/home/PremiumHome'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ScamAlert } from '@/types'

export const dynamic = 'force-dynamic'

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
  const { verifiedCount, stateCount, latestAlert } = await getHomeStats()

  return (
    <PremiumHome
      verifiedCount={verifiedCount}
      stateCount={stateCount}
      alertTitle={latestAlert?.title}
    />
  )
}
