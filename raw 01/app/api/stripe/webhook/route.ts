export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/admin'

function graceUntilSevenDays(): string {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString()
}

function getCustomerId(invoice: Stripe.Invoice): string | null {
  if (!invoice.customer) return null
  return typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id
}

async function updateProviderByCustomer(
  admin: NonNullable<ReturnType<typeof createServiceClient>>,
  customerId: string,
  updates: Record<string, unknown>
) {
  await admin.from('service_providers').update(updates).eq('stripe_customer_id', customerId)
}

async function findProviderBySubscription(
  admin: NonNullable<ReturnType<typeof createServiceClient>>,
  subscriptionId: string
) {
  const { data } = await admin
    .from('service_providers')
    .select('id, subscription_grace_until, subscription_status')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle()
  return data
}

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret || webhookSecret === 'YOUR_WEBHOOK_SECRET') {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = new Stripe(stripeKey)
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
    const providerId = session.metadata?.provider_id
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

    if (providerId) {
      await admin
        .from('service_providers')
        .update({
          subscription_status: 'premium',
          stripe_subscription_id: subscriptionId ?? null,
          subscription_grace_until: null,
        })
        .eq('id', providerId)
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = getCustomerId(invoice)

    if (customerId) {
      await updateProviderByCustomer(admin, customerId, {
        subscription_grace_until: graceUntilSevenDays(),
      })

      console.info('[stripe] payment_failed — grace period set for customer', customerId)
    }
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = getCustomerId(invoice)

    if (customerId) {
      await updateProviderByCustomer(admin, customerId, {
        subscription_status: 'premium',
        subscription_grace_until: null,
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const provider = await findProviderBySubscription(admin, subscription.id)

    if (provider) {
      const graceActive =
        provider.subscription_grace_until &&
        new Date(provider.subscription_grace_until) > new Date()

      if (!graceActive) {
        await admin
          .from('service_providers')
          .update({
            subscription_status: 'free',
            stripe_subscription_id: null,
            subscription_grace_until: null,
          })
          .eq('id', provider.id)
      }
    }
  }

  return NextResponse.json({ received: true })
}
