export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { ABN_DOWNTIME_MESSAGE, ABN_FETCH_TIMEOUT_MS } from '@/lib/abn'

function isGuidConfigured(): boolean {
  const guid = process.env.ABN_LOOKUP_GUID?.trim()
  return !!guid && guid !== 'PENDING_FROM_EMAIL'
}

function mockPendingResponse(cleanABN: string) {
  return NextResponse.json({
    valid: true,
    businessName: 'Business (ABN Pending Verification)',
    abn: cleanABN,
    status: 'Active',
    state: 'NSW',
    entityType: 'Individual/Sole Trader',
    pendingVerification: true,
  })
}

function downtimeResponse() {
  return NextResponse.json({
    valid: false,
    apiDown: true,
    error: ABN_DOWNTIME_MESSAGE,
  })
}

export async function POST(req: Request) {
  const { abn } = await req.json()

  const cleanABN = String(abn ?? '').replace(/\s/g, '')
  if (!/^\d{11}$/.test(cleanABN)) {
    return NextResponse.json({
      valid: false,
      error: 'ABN ต้องมี 11 หลักครับ — ห้ามกรอก TFN (Tax File Number)',
    })
  }

  const guid = process.env.ABN_LOOKUP_GUID
  if (!isGuidConfigured()) {
    return mockPendingResponse(cleanABN)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), ABN_FETCH_TIMEOUT_MS)

    const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${cleanABN}&callback=callback&guid=${guid}`

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) {
      return downtimeResponse()
    }

    const text = await response.text()
    const jsonStr = text.replace(/^callback\(/, '').replace(/\);?$/, '')
    const data = JSON.parse(jsonStr)

    if (data.Message) {
      return downtimeResponse()
    }

    if (data.AbnStatus === 'Active') {
      return NextResponse.json({
        valid: true,
        businessName: data.EntityName || data.BusinessName?.[0]?.OrganisationName,
        abn: data.Abn,
        status: data.AbnStatus,
        type: data.EntityTypeName,
        state: data.BusinessAddress?.StateCode,
        postcode: data.BusinessAddress?.Postcode,
      })
    }

    if (data.AbnStatus === 'Cancelled') {
      return NextResponse.json({
        valid: false,
        error: 'ABN นี้ถูกยกเลิกแล้ว (Cancelled) — ไม่สามารถลงทะเบียนได้',
      })
    }

    return NextResponse.json({
      valid: false,
      error: `ABN นี้มีสถานะ: ${data.AbnStatus ?? 'ไม่ทราบ'} — ไม่สามารถยืนยันได้`,
    })
  } catch {
    return downtimeResponse()
  }
}
