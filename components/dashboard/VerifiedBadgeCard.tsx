'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

const EMBED_BASE_URL = 'https://thai-ausverified.com.au/badge'

type Props = {
  businessName: string
  abnNumber: string
  providerId: string
}

function maskAbn(abn: string) {
  const clean = abn.replace(/\s/g, '')
  if (clean.length < 5) return abn
  const visible = clean.slice(0, 5)
  const hidden = clean.slice(5).replace(/\d/g, 'X')
  const grouped = `${visible}${hidden}`.match(/.{1,3}/g)?.join(' ') ?? clean
  return grouped
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

export function VerifiedBadgeCard({ businessName, abnNumber, providerId }: Props) {
  const badgeRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState('')
  const [downloading, setDownloading] = useState(false)

  const badgeId = `TAV-${providerId.slice(0, 6).toUpperCase()}`
  const embedUrl = `${EMBED_BASE_URL}/${providerId}`

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3500)
  }

  async function handleDownload() {
    if (!badgeRef.current) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: '#1e3a5f',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `thai-aus-verified-${providerId.slice(0, 6)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      showToast('ดาวน์โหลดไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setDownloading(false)
    }
  }

  async function handleCopyEmbed() {
    try {
      await copyText(embedUrl)
      showToast('คัดลอกแล้ว! ✓')
    } catch {
      showToast('ไม่สามารถคัดลอกได้')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#1e3a5f]">Verified Badge</p>

      <div
        ref={badgeRef}
        className="mt-4 rounded-2xl bg-[#1e3a5f] p-6 text-white shadow-md"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-white/70">
          Thai-Aus Verified Community
        </p>
        <p className="mt-3 text-xl font-bold">{businessName}</p>
        <p className="mt-2 text-sm font-semibold text-green-300">✓ Thai-Aus Verified</p>
        <p className="mt-4 text-xs text-white/80">ABN: {maskAbn(abnNumber)}</p>
        <p className="mt-2 font-mono text-xs text-white/60">Badge ID: {badgeId}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 rounded-xl bg-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50"
        >
          {downloading ? 'กำลังสร้างไฟล์...' : 'ดาวน์โหลด Badge'}
        </button>
        <button
          type="button"
          onClick={handleCopyEmbed}
          className="flex-1 rounded-xl border border-[#1e3a5f] px-4 py-2.5 text-sm font-semibold text-[#1e3a5f] hover:bg-slate-50"
        >
          คัดลอก Embed Link
        </button>
      </div>

      {toast && (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {toast}
        </p>
      )}
    </div>
  )
}
