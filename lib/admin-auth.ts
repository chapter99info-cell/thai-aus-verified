import { createHmac, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/admin-cookie'

export { ADMIN_COOKIE }
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12 // 12 hours

export function getAdminToken(): string {
  const pin = process.env.ADMIN_PIN?.trim()
  if (!pin) return ''
  return createHmac('sha256', pin).update('thai-aus-admin-v1').digest('hex')
}

export function verifyAdminPin(pin: string): boolean {
  const expected = process.env.ADMIN_PIN?.trim()
  if (!expected || !pin) return false

  try {
    return timingSafeEqual(Buffer.from(pin), Buffer.from(expected))
  } catch {
    return false
  }
}

export function verifyAdminCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  const expected = getAdminToken()
  if (!expected) return false

  try {
    return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected))
  } catch {
    return false
  }
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifyAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  }
}
