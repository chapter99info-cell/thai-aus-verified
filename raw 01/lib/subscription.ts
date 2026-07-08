import type { ServiceProvider } from '@/types'

type SubscriptionFields = Pick<
  ServiceProvider,
  'subscription_status' | 'subscription_grace_until'
>

export function isPremiumProvider(provider: SubscriptionFields): boolean {
  if (provider.subscription_status === 'premium') return true
  if (!provider.subscription_grace_until) return false
  return new Date(provider.subscription_grace_until) > new Date()
}

export function isInPaymentGrace(provider: SubscriptionFields): boolean {
  if (!provider.subscription_grace_until) return false
  return new Date(provider.subscription_grace_until) > new Date()
}

export function isGraceExpired(provider: SubscriptionFields): boolean {
  if (provider.subscription_status === 'premium') return false
  if (!provider.subscription_grace_until) return true
  return new Date(provider.subscription_grace_until) <= new Date()
}

export function graceDaysRemaining(provider: SubscriptionFields): number | null {
  if (!provider.subscription_grace_until) return null
  const diff = new Date(provider.subscription_grace_until).getTime() - Date.now()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
