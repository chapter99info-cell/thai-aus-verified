export const runtime = 'nodejs'

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
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนรีวิว' }, { status: 401 })
    }

    const body = await request.json()
    const { provider_id, rating, comment } = body as {
      provider_id: string
      rating: number
      comment: string
    }

    if (!provider_id || rating > 5) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบ' }, { status: 400 })
    }

    if (!comment || comment.trim().length < 20) {
      return NextResponse.json(
        { error: 'กรุณาเขียนอย่างน้อย 20 ตัวอักษร' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1) {
      return NextResponse.json({ error: 'กรุณาเลือกคะแนนดาวก่อน' }, { status: 400 })
    }

    const { error: insertError } = await supabase.from('reviews').insert({
      provider_id,
      reviewer_id: user.id,
      rating,
      comment: comment.trim(),
      status: 'visible',
    })

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'คุณรีวิวธุรกิจนี้แล้ว' }, { status: 400 })
      }
      throw insertError
    }

    const service = createServiceClient()
    if (service) {
      const { data: reviews } = await service
        .from('reviews')
        .select('rating')
        .eq('provider_id', provider_id)
        .eq('status', 'visible')

      const count = reviews?.length ?? 0
      const avg =
        count > 0
          ? (reviews!.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(2)
          : '0'

      await service
        .from('providers')
        .update({ rating: avg, review_count: count })
        .eq('id', provider_id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
