import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Auth API — Phase 1 placeholder' })
}

export async function POST() {
  return NextResponse.json({ status: 'ok', message: 'Auth handler — connect in Phase 2' })
}
