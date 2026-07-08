export const runtime = 'nodejs'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  getAdminToken,
  verifyAdminCookie,
  verifyAdminPin,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!process.env.ADMIN_PIN?.trim()) {
    return NextResponse.json({ error: 'Admin PIN not configured' }, { status: 500 })
  }

  const body = (await request.json().catch(() => ({}))) as { pin?: string }
  const pin = body.pin?.trim() ?? ''

  if (!verifyAdminPin(pin)) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  const token = getAdminToken()
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions())
  return response
}

export async function DELETE() {
  const cookieStore = await cookies()

  if (!verifyAdminCookie(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions(), maxAge: 0 })
  return response
}
