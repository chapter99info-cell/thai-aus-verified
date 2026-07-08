export const runtime = 'nodejs'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  if (!verifyAdminCookie(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { provider_id, action } = body as {
    provider_id: string
    action: 'approve' | 'reject'
  }

  if (!provider_id || !action) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  try {
    if (action === 'approve') {
      const { error } = await service
        .from('service_providers')
        .update({
          is_verified: true,
          verification_status: 'approved',
          verified_at: new Date().toISOString(),
        })
        .eq('id', provider_id)

      if (error) throw error

      const { data: provider } = await service
        .from('service_providers')
        .select('profile_id')
        .eq('id', provider_id)
        .single()

      if (provider) {
        await service
          .from('providers')
          .update({ is_verified: true })
          .eq('id', provider.profile_id)
      }
    } else {
      const { error } = await service
        .from('service_providers')
        .update({
          is_verified: false,
          verification_status: 'rejected',
          is_blacklisted: true,
        })
        .eq('id', provider_id)

      if (error) throw error

      const { data: provider } = await service
        .from('service_providers')
        .select('profile_id')
        .eq('id', provider_id)
        .single()

      if (provider) {
        await service
          .from('providers')
          .update({ is_blacklisted: true, is_verified: false })
          .eq('id', provider.profile_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
