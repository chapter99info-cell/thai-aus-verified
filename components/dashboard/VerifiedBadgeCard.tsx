'use client'

import { useState } from 'react'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceCategory } from '@/types'

const BADGE_LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

type Props = {
  businessName: string
  abn: string
  category: ServiceCategory
  providerId: string
}

function formatAbnDisplay(abn: string) {
  const clean = abn.replace(/\s/g, '')
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  }
  return abn
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.rect(x, y, w, h)
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function VerifiedBadgeCard({ businessName, abn, category, providerId }: Props) {
  const [toast, setToast] = useState('')
  const [downloading, setDownloading] = useState(false)

  const categoryLabel = CATEGORY_LABELS[category]?.th ?? category
  const formattedAbn = formatAbnDisplay(abn)

  const business = {
    business_name: businessName,
    abn_number: formattedAbn,
    category: categoryLabel,
  }

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3500)
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 600
      canvas.height = 320
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.fillStyle = '#0D1B3E'
      drawRoundRect(ctx, 0, 0, 600, 320, 20)
      ctx.fill()

      const logo = new Image()
      logo.crossOrigin = 'anonymous'
      logo.src = BADGE_LOGO_URL
      await new Promise<void>((resolve) => {
        logo.onload = () => resolve()
        logo.onerror = () => resolve()
      })
      if (logo.complete && logo.naturalWidth > 0) {
        ctx.drawImage(logo, 32, 28, 48, 48)
      }

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 18px sans-serif'
      ctx.fillText('Thai-Aus Verified', 92, 60)

      ctx.fillStyle = '#22c55e'
      drawRoundRect(ctx, 32, 100, 24, 24, 4)
      ctx.fill()
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px sans-serif'
      ctx.fillText('✓', 38, 118)

      ctx.fillStyle = '#9ca3af'
      ctx.font = '13px sans-serif'
      ctx.fillText('ยืนยันแล้ว — ABN Verified', 64, 118)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 26px sans-serif'
      ctx.fillText(business.business_name || 'ธุรกิจของคุณ', 32, 165)

      ctx.fillStyle = '#1e2d4f'
      drawRoundRect(ctx, 32, 188, 536, 60, 8)
      ctx.fill()
      ctx.fillStyle = '#9ca3af'
      ctx.font = '11px sans-serif'
      ctx.fillText('ABN', 50, 210)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 20px monospace'
      ctx.fillText(business.abn_number || '', 50, 236)

      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px sans-serif'
      ctx.fillText(business.category || '', 40, 295)
      ctx.fillText('thai-ausverified.com.au', 380, 295)

      const link = document.createElement('a')
      link.download = `thai-aus-verified-badge-${business.business_name.replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      showToast('ดาวน์โหลดไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setDownloading(false)
    }
  }

  async function handleCopyPost() {
    const post = `✅ ธุรกิจของเราได้รับการยืนยัน ABN แล้วครับ/ค่ะ
ชื่อธุรกิจ: ${businessName}
ABN: ${formattedAbn}
ดูโปรไฟล์และติดต่อเราได้ที่:
👉 https://thai-ausverified.com.au/business/${providerId}
#ThaiAusVerified #ABNVerified #${businessName.replace(/\s/g, '')}`

    try {
      await copyText(post)
      showToast('คัดลอกแล้ว ✅ นำไปแปะใน Facebook ได้เลย')
    } catch {
      showToast('ไม่สามารถคัดลอกได้')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#1e3a5f]">Verified Badge</p>

      <div
        id="verified-badge-card"
        className="mx-auto mt-4 w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5282] p-6 text-white shadow-xl"
      >
        <div className="mb-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BADGE_LOGO_URL}
            alt="Thai-AUS Verified"
            className="h-10 w-10 object-contain"
          />
          <span className="text-sm font-bold opacity-80">Thai-Aus Verified</span>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-3xl">✅</span>
          <div>
            <p className="text-xs opacity-70">ยืนยันแล้ว — ABN Verified</p>
            <p className="text-xl font-bold">{businessName}</p>
          </div>
        </div>

        <div className="mb-4 rounded-xl bg-white/10 p-3">
          <p className="text-xs opacity-70">ABN</p>
          <p className="font-mono font-bold tracking-widest">{formattedAbn}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs">{categoryLabel}</span>
          <span className="text-xs opacity-60">thai-ausverified.com.au</span>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-sm space-y-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] py-3 font-medium text-white hover:bg-[#2d5282] disabled:opacity-50"
        >
          {downloading ? 'กำลังสร้างไฟล์...' : '📥 ดาวน์โหลด Badge'}
        </button>
        <button
          type="button"
          onClick={handleCopyPost}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1e3a5f] py-3 font-medium text-[#1e3a5f] hover:bg-slate-50"
        >
          📋 คัดลอกโพสต์ Facebook
        </button>
      </div>

      {toast && (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-800">
          {toast}
        </p>
      )}
    </div>
  )
}
