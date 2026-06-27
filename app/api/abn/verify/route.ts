export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { abn } = await req.json()

  const cleanABN = String(abn ?? '').replace(/\s/g, '')
  if (!/^\d{11}$/.test(cleanABN)) {
    return NextResponse.json({
      valid: false,
      error: 'ABN ต้องมี 11 หลักครับ',
    })
  }

  try {
    const guid = process.env.ABN_LOOKUP_GUID
    if (!guid || guid === 'PENDING_FROM_EMAIL') {
      return NextResponse.json({
        valid: false,
        error: 'ระบบตรวจสอบ ABN ยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแล',
      })
    }

    const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${cleanABN}&callback=callback&guid=${guid}`

    const response = await fetch(url)
    const text = await response.text()

    const jsonStr = text.replace(/^callback\(/, '').replace(/\);?$/, '')
    const data = JSON.parse(jsonStr)

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

    return NextResponse.json({
      valid: false,
      error: `ABN นี้มีสถานะ: ${data.AbnStatus ?? 'ไม่ทราบ'} — ไม่สามารถยืนยันได้`,
    })
  } catch {
    return NextResponse.json({
      valid: false,
      error: 'ไม่สามารถตรวจสอบ ABN ได้ กรุณาลองใหม่อีกครั้ง',
    })
  }
}
