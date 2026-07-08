export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getAlertTypeLabel } from '@/lib/scam-alerts'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'

const ALERT_COLUMNS =
  'id, title, description, category, is_published, alert_type, severity, evidence_url, state, created_at'

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
    .from('providers')
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

export async function GET() {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return auth.error

    const { data, error } = await auth.service
      .from('scam_alerts')
      .select(ALERT_COLUMNS)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if ('error' in auth) return auth.error

    const body = await request.json()

    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const alertType = body.alert_type || body.category || 'other'
    const category =
      body.category ||
      (typeof alertType === 'string' && alertType.length <= 20
        ? getAlertTypeLabel(alertType)
        : alertType) ||
      'อื่นๆ'

    const { data, error } = await auth.service
      .from('scam_alerts')
      .insert({
        title: body.title,
        description: body.description,
        category,
        alert_type: alertType,
        severity: body.severity || 'warning',
        evidence_url: body.evidence_url || null,
        state: body.state || 'ไม่ระบุ',
        is_published: body.is_published ?? true,
      })
      .select(ALERT_COLUMNS)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
