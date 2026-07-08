export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const priceId = process.env.STRIPE_PRICE_ID

  if (!priceId || priceId === 'YOUR_PRICE_ID') {
    return NextResponse.json({ error: 'Stripe ยังไม่ได้ตั้งค่า' }, { status: 503 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('providers')
    .select('id, stripe_customer_id, email')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: 'ไม่พบโปรไฟล์ผู้ใช้' }, { status: 400 })
  }

  const stripe = getStripe()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  let customerId = profile.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? profile.email,
      metadata: {
        userId: user.id,
      },
    })
    customerId = customer.id

    await supabase.from('providers').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?payment=success`,
    cancel_url: `${siteUrl}/pricing`,
    metadata: {
      userId: user.id,
      userEmail: user.email ?? profile.email,
    },
  })

  return NextResponse.json({ url: session.url })
}
