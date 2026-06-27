import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
          .from('profiles')
          .update({ role: 'verified_business' })
          .eq('id', provider.profile_id)
      }
    } else {
      const { error } = await service
        .from('service_providers')
        .update({
          is_verified: false,
          verification_status: 'rejected',
        })
        .eq('id', provider_id)

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
