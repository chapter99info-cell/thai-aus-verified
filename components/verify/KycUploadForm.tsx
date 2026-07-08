'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { KycDocument, KycDocumentType } from '@/types'

const DOCUMENT_TYPES: { type: KycDocumentType; label: string }[] = [
  { type: 'abn_certificate', label: 'ABN Certificate' },
  { type: 'id_document', label: 'ID Document (Passport/Driver License)' },
  { type: 'business_license', label: 'Business License (if applicable)' },
  { type: 'insurance', label: 'Public Liability Insurance' },
]

const STATUS_LABELS = {
  pending: { text: 'รอตรวจสอบ', className: 'bg-amber-50 text-amber-800' },
  approved: { text: 'อนุมัติแล้ว', className: 'bg-green-50 text-green-700' },
  rejected: { text: 'ไม่ผ่าน', className: 'bg-red-50 text-red-700' },
}

const MAX_SIZE = 5 * 1024 * 1024

export function KycUploadForm() {
  const router = useRouter()
  const [providerId, setProviderId] = useState<string | null>(null)
  const [documents, setDocuments] = useState<KycDocument[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: provider } = await supabase
        .from('providers')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!provider) {
        router.push('/register')
        return
      }

      setProviderId(provider.id)

      const { data: docs } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('provider_id', provider.id)
        .order('uploaded_at', { ascending: false })

      setDocuments((docs ?? []) as KycDocument[])
    }
    load()
  }, [router])

  async function handleUpload(type: KycDocumentType, file: File) {
    if (!providerId) return
    if (file.size > MAX_SIZE) {
      setError('ไฟล์ต้องไม่เกิน 5MB')
      return
    }

    setError('')
    setUploading(type)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${providerId}/${type}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(null)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('kyc-documents').getPublicUrl(path)

    const fileUrl = publicUrl

    const { error: insertError } = await supabase.from('kyc_documents').insert({
      provider_id: providerId,
      document_type: type,
      file_url: fileUrl,
      status: 'pending',
    })

    if (insertError) {
      setError(insertError.message)
      setUploading(null)
      return
    }

    const { data: docs } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('provider_id', providerId)
      .order('uploaded_at', { ascending: false })

    setDocuments((docs ?? []) as KycDocument[])
    setToast('อัปโหลดสำเร็จ! ทีมงานจะตรวจสอบภายใน 48 ชั่วโมง')
    setUploading(null)
    setTimeout(() => setToast(''), 5000)
  }

  if (!providerId) {
    return <p className="text-slate-600">กำลังโหลด...</p>
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {toast}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {DOCUMENT_TYPES.map(({ type, label }) => (
          <div
            key={type}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="font-medium text-slate-900">{label}</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-3 block w-full text-sm text-slate-600"
              disabled={uploading === type}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(type, file)
              }}
            />
            {uploading === type && (
              <p className="mt-2 text-xs text-slate-500">กำลังอัปโหลด...</p>
            )}
          </div>
        ))}
      </div>

      {documents.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-900">เอกสารที่อัปโหลดแล้ว</h2>
          <ul className="mt-4 space-y-3">
            {documents.map((doc) => {
              const status = STATUS_LABELS[doc.status]
              const label =
                DOCUMENT_TYPES.find((d) => d.type === doc.document_type)?.label ??
                doc.document_type
              return (
                <li
                  key={doc.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(doc.uploaded_at).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                  >
                    {status.text}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
