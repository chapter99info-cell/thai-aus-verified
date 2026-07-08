export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID

  if (!stripeKey || stripeKey === 'YOUR_STRIPE_KEY' || !priceId || priceId === 'YOUR_PRICE_ID') {
    return NextResponse.json({ error: 'Stripe ยังไม่ได้ตั้งค่า' }, { status: 503 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: provider } = await supabase
    .from('service_providers')
    .select('id, stripe_customer_id')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (!provider) {
    return NextResponse.json({ error: 'ไม่พบข้อมูลธุรกิจ' }, { status: 400 })
  }

  const stripe = new Stripe(stripeKey)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  let customerId = provider.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        user_id: user.id,
        provider_id: provider.id,
      },
    })
    customerId = customer.id

    await supabase
      .from('service_providers')
      .update({ stripe_customer_id: customerId })
      .eq('id', provider.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?upgraded=true`,
    cancel_url: `${siteUrl}/pricing`,
    metadata: {
      user_id: user.id,
      provider_id: provider.id,
    },
  })

  return NextResponse.json({ url: session.url })
}
