'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    if (!res.ok) {
      setError('รหัส PIN ไม่ถูกต้อง')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1B3E] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#C9A84C]/30 bg-[#1B2A5E] p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="text-4xl" aria-hidden>
            🔒
          </span>
          <h1 className="mt-3 text-xl font-bold text-[#C9A84C]">Admin Access</h1>
          <p className="mt-1 text-sm text-white/60">Thai-Aus Verified Community</p>
        </div>

        <div className="space-y-3">
          <label htmlFor="admin-pin" className="block text-sm font-medium text-white/80">
            รหัส PIN
          </label>
          <input
            id="admin-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-lg border border-[#C9A84C]/30 bg-[#0D1B3E] px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading || !pin.trim()}
            className="w-full rounded-lg bg-[#C9A84C] py-3 text-base font-bold text-[#0D1B3E] transition-colors hover:bg-[#D4A017] disabled:opacity-50"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    </div>
  )
}
