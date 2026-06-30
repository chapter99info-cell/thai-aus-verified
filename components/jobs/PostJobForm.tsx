'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Megaphone, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GoldButton } from '@/components/mvp/MvpButtons'
import type { JobBoardBusiness } from '@/types/job-board'

export function PostJobForm({ business }: { business: JobBoardBusiness }) {
  const [jobTitle, setJobTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  function resetForm() {
    setSuccess(false)
    setJobTitle('')
    setDescription('')
    setContactInfo('')
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const supabase = createClient()
    const { error: insertError } = await supabase.from('job_postings').insert({
      business_id: business.id,
      job_title: jobTitle.trim(),
      description: description.trim(),
      contact_info: contactInfo.trim(),
      is_active: true,
    })

    setSaving(false)

    if (insertError) {
      setError('ไม่สามารถโพสต์ประกาศได้ กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง')
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="rounded-2xl border-2 border-[#D4A017] bg-[#D4A017]/10 p-6">
        <p className="text-base font-semibold text-[#0D1B3E]">
          ✅ โพสต์สำเร็จ! ประกาศของคุณจะแสดงผลภายใน 14 วัน
        </p>
        <div className="mt-4 space-y-3">
          <GoldButton href="/jobs">ดูประกาศทั้งหมด →</GoldButton>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0D1B3E] bg-white text-base font-semibold text-[#0D1B3E]"
          >
            <RotateCcw className="h-5 w-5" aria-hidden />
            โพสต์อีกครั้ง
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border-2 border-[#D4A017] bg-[#D4A017]/10 p-5">
        <p className="text-base font-semibold text-[#0D1B3E]">
          ✅ โพสต์ในนามของ: {business.business_name}
        </p>
      </div>

      <div>
        <label htmlFor="job_title" className="mb-2 block text-base font-semibold text-[#0D1B3E]">
          ตำแหน่งงาน *
        </label>
        <input
          id="job_title"
          type="text"
          required
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="เช่น พนักงานเสิร์ฟ กะเย็น"
          className="w-full rounded-xl border-2 border-[#0D1B3E]/20 px-4 py-3 text-base text-[#0D1B3E] focus:border-[#D4A017] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-base font-semibold text-[#0D1B3E]">
          รายละเอียดและค่าตอบแทน *
        </label>
        <textarea
          id="description"
          required
          maxLength={300}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-xl border-2 border-[#0D1B3E]/20 px-4 py-3 text-base text-[#0D1B3E] focus:border-[#D4A017] focus:outline-none"
        />
        <p className="mt-1 text-base font-semibold text-[#0D1B3E]">
          {description.length}/300 ตัวอักษร
        </p>
      </div>

      <div>
        <label htmlFor="contact_info" className="mb-2 block text-base font-semibold text-[#0D1B3E]">
          ช่องทางติดต่อ *
        </label>
        <input
          id="contact_info"
          type="text"
          required
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="เบอร์โทร หรือ Line ID"
          className="w-full rounded-xl border-2 border-[#0D1B3E]/20 px-4 py-3 text-base text-[#0D1B3E] focus:border-[#D4A017] focus:outline-none"
        />
      </div>

      {error && (
        <div className="rounded-xl border-2 border-[#D4A017] bg-white p-4">
          <p className="text-base font-semibold text-[#0D1B3E]">{error}</p>
          <p className="mt-1 text-base text-[#0D1B3E]">กรุณาตรวจสอบว่าคุณกรอกครบทุกช่องแล้วลองใหม่</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] text-base font-semibold text-[#0D1B3E] disabled:opacity-40"
      >
        <Megaphone className="h-5 w-5" aria-hidden />
        {saving ? 'กำลังโพสต์...' : '📢 โพสต์ประกาศงาน'}
      </button>
    </form>
  )
}
