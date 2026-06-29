'use client'

import { useState } from 'react'

type Props = {
  className?: string
  label?: string
  loadingLabel?: string
}

export function UpgradeButton({
  className = 'w-full rounded-lg bg-[#1e3a5f] py-3 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50',
  label = 'สมัคร Premium',
  loadingLabel = 'กำลังโหลด...',
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login?redirect=/pricing'
          return
        }
        setError(data.error ?? 'ไม่สามารถเริ่มชำระเงินได้')
        return
      }

      if (data.url) {
        window.location.href = data.url
        return
      }

      setError('ไม่สามารถเริ่มชำระเงินได้')
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button type="button" onClick={handleCheckout} disabled={loading} className={className}>
        {loading ? loadingLabel : label}
      </button>
      {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}
