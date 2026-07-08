export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/admin'

function getCustomerId(customer: Stripe.Invoice['customer'] | Stripe.Checkout.Session['customer']) {
  if (!customer) return null
  return typeof customer === 'string' ? customer : customer.id
}

async function setProfileMembership(
  admin: NonNullable<ReturnType<typeof createServiceClient>>,
  userId: string,
  updates: {
    membership_tier: 'free' | 'premium'
    stripe_customer_id?: string | null
    stripe_subscription_id?: string | null
  }
) {
  const profileUpdate: Record<string, unknown> = {
    membership_tier: updates.membership_tier,
  }
  if (updates.stripe_customer_id !== undefined) {
    profileUpdate.stripe_customer_id = updates.stripe_customer_id
  }
  if (updates.stripe_subscription_id !== undefined) {
    profileUpdate.stripe_subscription_id = updates.stripe_subscription_id
  }

  await admin.from('providers').update(profileUpdate).eq('id', userId)

  const providerUpdate: Record<string, unknown> = {
    subscription_status: updates.membership_tier,
  }
  if (updates.stripe_customer_id !== undefined) {
    providerUpdate.stripe_customer_id = updates.stripe_customer_id
  }
  if (updates.stripe_subscription_id !== undefined) {
    providerUpdate.stripe_subscription_id = updates.stripe_subscription_id
  }
  if (updates.membership_tier === 'premium') {
    providerUpdate.subscription_grace_until = null
  }

  await admin.from('service_providers').update(providerUpdate).eq('profile_id', userId)
}

async function setMembershipByCustomerId(
  admin: NonNullable<ReturnType<typeof createServiceClient>>,
  customerId: string,
  membership_tier: 'free' | 'premium'
) {
  const { data: profile } = await admin
    .from('providers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()

  if (profile?.id) {
    await setProfileMembership(admin, profile.id, {
      membership_tier,
      stripe_subscription_id: membership_tier === 'free' ? null : undefined,
    })
  }
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret || webhookSecret === 'YOUR_WEBHOOK_SECRET') {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createServiceClient()
  if (!admin) {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const customerId = getCustomerId(session.customer)
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

    if (userId) {
      await setProfileMembership(admin, userId, {
        membership_tier: 'premium',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId ?? null,
      })
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = getCustomerId(invoice.customer)

    if (customerId) {
      await setMembershipByCustomerId(admin, customerId, 'free')
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = getCustomerId(subscription.customer)

    if (customerId) {
      await setMembershipByCustomerId(admin, customerId, 'free')
    }
  }

  return NextResponse.json({ received: true })
}
