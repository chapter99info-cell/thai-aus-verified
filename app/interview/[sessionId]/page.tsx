'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { InterviewSession } from '@/types'

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

export default function InterviewForm() {
  const params = useParams()
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : params.sessionId?.[0]
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    const load = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (error || !data) {
        setLoadError(true)
        return
      }

      const row = data as InterviewSession
      setSession(row)
      setAnswers(new Array(row.questions.length).fill(''))
    }

    void load()
  }, [sessionId])

  const handleSubmit = async () => {
    if (!session || !sessionId || answers.some((a) => a.trim().length < 5)) return
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('interview_sessions')
      .update({
        answers: session.questions.map((q, i) => ({
          question: q,
          answer: answers[i],
        })),
        status: 'completed',
      })
      .eq('id', sessionId)
    setSaving(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D1B3E] p-6">
        <div className="space-y-4 text-center">
          <div className="text-6xl">🙏</div>
          <h2 className="text-2xl font-bold text-white">ขอบคุณมากครับ!</h2>
          <p className="text-sm text-gray-300">
            ข้อมูลของคุณจะถูกนำไปแชร์ในชุมชนไทยซิดนีย์ครับ
          </p>
          <p className="text-xs text-[#D4A017]">Thai Sydney Verified Community</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="space-y-3 text-center">
          <div className="text-4xl">❌</div>
          <p className="text-gray-600">ไม่พบลิงก์สัมภาษณ์นี้ครับ</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-400">กำลังโหลด...</div>
      </div>
    )
  }

  if (session.status === 'completed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="space-y-3 text-center">
          <div className="text-4xl">✅</div>
          <p className="text-gray-600">คุณได้ตอบคำถามนี้แล้วครับ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="rounded-2xl bg-[#0D1B3E] p-6 text-center">
          <img src={LOGO_URL} alt="Thai-Aus Verified" className="mx-auto mb-3 w-14" />
          <h1 className="text-lg font-bold text-white">สัมภาษณ์ธุรกิจไทยซิดนีย์</h1>
          <p className="mt-1 text-sm text-gray-300">สำหรับ: {session.interviewee_name}</p>
          {session.business_name && (
            <p className="text-sm text-[#D4A017]">{session.business_name}</p>
          )}
        </div>

        <div className="space-y-6 rounded-2xl bg-white p-6 shadow">
          {session.questions.map((q, i) => (
            <div key={i}>
              <label className="mb-2 block text-sm font-semibold text-[#0D1B3E]">
                {i + 1}. {q}
              </label>
              <textarea
                value={answers[i]}
                onChange={(e) => {
                  const arr = [...answers]
                  arr[i] = e.target.value
                  setAnswers(arr)
                }}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B3E]"
                placeholder="พิมพ์คำตอบของคุณที่นี่..."
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || answers.some((a) => a.trim().length < 5)}
            className="w-full rounded-xl bg-[#0D1B3E] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a2f5e] disabled:opacity-40"
          >
            {saving ? 'กำลังส่ง...' : '✅ ส่งคำตอบ'}
          </button>
        </div>

        <p className="pb-4 text-center text-xs text-gray-400">
          Thai Sydney Verified Community · Powered by Chapter99 Solutions
        </p>
      </div>
    </div>
  )
}
