'use client'

import { useMemo, useState } from 'react'

const PROFILE_BASE_URL = 'https://thai-ausverified.com.au/business'

type Props = {
  businessName: string
  abnNumber: string
  providerId: string
}

function formatAbnDisplay(abn: string) {
  const clean = abn.replace(/\s/g, '')
  if (clean.length === 11) {
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 8)} ${clean.slice(8, 11)}`
  }
  return abn
}

function buildFacebookPost(businessName: string, profileUrl: string) {
  return `✅ ธุรกิจของเราได้รับการยืนยัน ABN จาก Thai-Aus Verified Community แล้วครับ/ค่ะ
ดูโปรไฟล์และติดต่อเราได้ที่:
👉 ${profileUrl}
#ThaiAusVerified #ABNVerified #${businessName.replace(/\s+/g, '')}`
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

export function VerifiedBadgeShareSection({ businessName, abnNumber, providerId }: Props) {
  const [toast, setToast] = useState('')

  const profileUrl = `${PROFILE_BASE_URL}/${providerId}`
  const formattedAbn = formatAbnDisplay(abnNumber)
  const facebookPost = useMemo(
    () => buildFacebookPost(businessName, profileUrl),
    [businessName, profileUrl]
  )

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3500)
  }

  async function handleCopyLink() {
    try {
      await copyText(profileUrl)
      showToast('คัดลอกแล้ว! นำไปแปะใน Facebook ได้เลยครับ ✅')
    } catch {
      showToast('ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง')
    }
  }

  async function handleCopyPost() {
    try {
      await copyText(facebookPost)
      showToast('คัดลอกโพสต์แล้ว! นำไปแปะใน Facebook ได้เลยครับ ✅')
    } catch {
      showToast('ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง')
    }
  }

  return (
    <section className="mt-8 space-y-6">
      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {toast}
        </div>
      )}

      <div className="rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm">
        <p className="text-sm font-bold text-green-800">✅ ยืนยันแล้ว — ABN Verified</p>
        <p className="mt-2 text-xl font-bold text-[#1e3a5f]">{businessName}</p>
        <p className="mt-1 text-sm text-green-900">ABN: {formattedAbn}</p>
        <p className="mt-3 text-xs font-medium text-green-700">Thai-Aus Verified Community</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label htmlFor="profile-link" className="block text-sm font-semibold text-[#1e3a5f]">
          ลิงก์โปรไฟล์ของคุณ
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="profile-link"
            readOnly
            value={profileUrl}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="shrink-0 rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282]"
          >
            คัดลอกลิงก์
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-[#1e3a5f]">วิธีใช้ลิงก์นี้:</p>
          <ol className="mt-2 space-y-1">
            <li>1️⃣ คัดลอกลิงก์ด้านบน</li>
            <li>2️⃣ นำไปแปะในโพสต์ Facebook หรือ Bio</li>
            <li>3️⃣ ลูกค้าคลิกเข้ามาดูโปรไฟล์ที่ Verified แล้วได้เลย</li>
          </ol>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#1e3a5f]">เทมเพลตโพสต์ Facebook</p>
        <textarea
          readOnly
          rows={6}
          value={facebookPost}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
        />
        <button
          type="button"
          onClick={handleCopyPost}
          className="mt-3 rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282]"
        >
          คัดลอกโพสต์
        </button>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        🏅 Verified Badge Image — Coming Soon
      </div>
    </section>
  )
}
