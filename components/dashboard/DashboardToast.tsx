'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function DashboardToast() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      setMessage('ยืนยัน ABN สำเร็จ! ธุรกิจของคุณขึ้น Directory แล้ว ✅')
    } else if (searchParams.get('upgraded') === 'true') {
      setMessage('อัปเกรด Premium สำเร็จ! 🎉')
    }
  }, [searchParams])

  if (!message) return null

  return (
    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      {message}
    </div>
  )
}
