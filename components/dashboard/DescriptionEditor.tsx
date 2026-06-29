'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  providerId: string
  initialDescription?: string | null
}

export function DescriptionEditor({ providerId, initialDescription }: Props) {
  const router = useRouter()
  const [description, setDescription] = useState(initialDescription ?? '')
  const [editingDesc, setEditingDesc] = useState(false)
  const [saving, setSaving] = useState(false)

  async function saveDescription() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('service_providers')
      .update({ description })
      .eq('id', providerId)

    setSaving(false)

    if (error) {
      return
    }

    setEditingDesc(false)
    router.refresh()
  }

  function handleCancel() {
    setDescription(initialDescription ?? '')
    setEditingDesc(false)
  }

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-[#1e3a5f]">เกี่ยวกับเรา / คำอธิบายธุรกิจ</h3>
        <button
          type="button"
          onClick={() => (editingDesc ? handleCancel() : setEditingDesc(true))}
          className="text-sm text-blue-600 underline"
        >
          {editingDesc ? 'ยกเลิก' : '✏️ แก้ไข'}
        </button>
      </div>
      {editingDesc ? (
        <div className="space-y-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={300}
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            placeholder="อธิบายธุรกิจของคุณ..."
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{description.length}/300</span>
            <button
              type="button"
              onClick={saveDescription}
              disabled={saving}
              className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          {description || 'ยังไม่มีคำอธิบาย — กด แก้ไข เพื่อเพิ่ม'}
        </p>
      )}
    </div>
  )
}
