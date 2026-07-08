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

  const body = (await request.json()) as {
    review_id?: string
    action?: 'strike' | 'dismiss'
  }

  if (!body.review_id || !body.action) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const service = createServiceClient()
  if (!service) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  if (body.action === 'strike') {
    const { error } = await service
      .from('reviews')
      .update({ status: 'hidden' })
      .eq('id', body.review_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    const { error } = await service
      .from('reviews')
      .update({ report_count: 0, reported_at: null })
      .eq('id', body.review_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
