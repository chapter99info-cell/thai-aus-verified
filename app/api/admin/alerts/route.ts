export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getAlertTypeLabel } from '@/lib/scam-alerts'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'

async function requireAdmin(): Promise<
  { service: NonNullable<ReturnType<typeof createServiceClient>> } | { error: NextResponse }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  const service = createServiceClient()
  if (!service) {
    return { error: NextResponse.json({ error: 'Server misconfigured' }, { status: 500 }) }
  }

  return { service }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return auth.error

    const body = await request.json()
    const {
      title,
      description,
      alert_type,
      severity,
      state,
      evidence_url,
      is_published,
    } = body

    if (!title || !description || !alert_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const category = getAlertTypeLabel(alert_type)

    const { data, error } = await auth.service
      .from('scam_alerts')
      .insert({
        title,
        description,
        category,
        alert_type,
        severity: severity ?? 'warning',
        state: state ?? 'ไม่ระบุ',
        evidence_url: evidence_url || null,
        is_published: is_published ?? true,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ alert: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return auth.error

    const body = await request.json()
    const { id, is_published } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing alert id' }, { status: 400 })
    }

    const { error } = await auth.service
      .from('scam_alerts')
      .update({ is_published })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return auth.error

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing alert id' }, { status: 400 })
    }

    const { error } = await auth.service.from('scam_alerts').delete().eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
