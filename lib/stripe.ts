import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js'
import Stripe from 'stripe'

let stripeServer: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeServer) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key || key === 'YOUR_STRIPE_KEY') {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeServer = new Stripe(key)
  }
  return stripeServer
}

let stripePromise: Promise<StripeJs | null> | null = null

export function getStripeJs(): Promise<StripeJs | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      return Promise.resolve(null)
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}
