'use client'

import { useState } from 'react'
import html2canvas from 'html2canvas'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceCategory } from '@/types'

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

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3500)
  }

  async function handleDownload() {
    const element = document.getElementById('verified-badge-card')
    if (!element) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1e3a5f',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `${businessName.replace(/\s+/g, '-')}-verified-badge.png`
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
            src="/logo.png"
            alt="Thai-Aus Verified"
            className="h-10 w-10 rounded-full border-2 border-white"
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
