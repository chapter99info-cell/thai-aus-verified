'use client'

import { useCallback, useEffect, useState } from 'react'
import { QUESTION_POOL } from '@/lib/interview'
import { createClient } from '@/lib/supabase/client'
import type { InterviewSession } from '@/types'

export function InterviewAdminTab() {
  const [intervieweeName, setIntervieweeName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [generatedLink, setGeneratedLink] = useState('')
  const [interviews, setInterviews] = useState<InterviewSession[]>([])
  const [aiPost, setAiPost] = useState('')
  const [generatingPost, setGeneratingPost] = useState(false)

  const loadInterviews = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('interview_sessions')
      .select('*')
      .order('created_at', { ascending: false })
    setInterviews((data as InterviewSession[]) ?? [])
  }, [])

  useEffect(() => {
    void loadInterviews()
  }, [loadInterviews])

  async function handleCreateLink() {
    if (!intervieweeName || selectedQuestions.length === 0) return
    const supabase = createClient()
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        interviewee_name: intervieweeName,
        business_name: businessName || null,
        questions: selectedQuestions,
        status: 'pending',
      })
      .select()
      .single()

    if (error || !data) {
      alert('ไม่สามารถสร้างลิงก์ได้ กรุณาลองใหม่อีกครั้งครับ')
      return
    }

    const link = `${window.location.origin}/interview/${data.id}`
    setGeneratedLink(link)
    setIntervieweeName('')
    setBusinessName('')
    setSelectedQuestions([])
    void loadInterviews()
  }

  async function handleGeneratePost(iv: InterviewSession) {
    setGeneratingPost(true)
    try {
      const res = await fetch('/api/generate-interview-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intervieweeName: iv.interviewee_name,
          businessName: iv.business_name,
          answers: iv.answers,
        }),
      })
      const json = await res.json()
      setAiPost(json.post ?? 'ไม่สามารถสร้างโพสต์ได้')
    } catch {
      setAiPost('ไม่สามารถสร้างโพสต์ได้')
    } finally {
      setGeneratingPost(false)
    }
  }

  function copyText(text: string, message: string) {
    void navigator.clipboard.writeText(text)
    alert(message)
  }

  return (
    <section className="overflow-auto bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#0D1B3E]">🎙️ สัมภาษณ์ธุรกิจ</h2>
          <p className="mt-1 text-sm text-[rgba(30,58,95,0.55)]">
            สร้างลิงก์สัมภาษณ์ส่งให้เจ้าของธุรกิจ และเรียบเรียงโพสต์ Facebook
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-gray-50 p-5">
          <h3 className="font-bold text-[#0D1B3E]">🎙️ สร้างลิงก์สัมภาษณ์ใหม่</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">ชื่อผู้ถูกสัมภาษณ์</label>
              <input
                value={intervieweeName}
                onChange={(e) => setIntervieweeName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="เช่น คุณสมศรี"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">ชื่อธุรกิจ (ถ้ามี)</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="เช่น Mira Thai Massage"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500">
              เลือกคำถาม (แนะนำ 4-5 ข้อ)
            </label>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {QUESTION_POOL.map((q, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border bg-white p-2 hover:border-blue-400"
                >
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuestions([...selectedQuestions, q])
                      } else {
                        setSelectedQuestions(selectedQuestions.filter((x) => x !== q))
                      }
                    }}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-gray-700">{q}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateLink}
            disabled={!intervieweeName || selectedQuestions.length === 0}
            className="w-full rounded-xl bg-[#0D1B3E] py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            🔗 สร้างลิงก์สัมภาษณ์
          </button>

          {generatedLink && (
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
              <span className="flex-1 truncate text-xs text-blue-700">{generatedLink}</span>
              <button
                type="button"
                onClick={() => copyText(generatedLink, 'คัดลอกแล้วครับ!')}
                className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white"
              >
                📋 Copy
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-[#0D1B3E]">📋 รายการสัมภาษณ์ทั้งหมด</h3>
          {interviews.length === 0 && (
            <p className="text-sm text-gray-400">ยังไม่มีรายการสัมภาษณ์</p>
          )}
          {interviews.map((iv) => (
            <div key={iv.id} className="space-y-3 rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{iv.interviewee_name}</p>
                  {iv.business_name && (
                    <p className="text-xs text-gray-500">{iv.business_name}</p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    iv.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {iv.status === 'completed' ? '✅ ตอบแล้ว' : '⏳ รอตอบ'}
                </span>
              </div>

              {iv.status === 'completed' && iv.answers?.length > 0 && (
                <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                  {iv.answers.map((a, i) => (
                    <div key={i}>
                      <p className="text-xs font-semibold text-gray-600">Q: {a.question}</p>
                      <p className="mt-0.5 text-xs text-gray-800">A: {a.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {iv.status === 'completed' && (
                <button
                  type="button"
                  onClick={() => handleGeneratePost(iv)}
                  disabled={generatingPost}
                  className="w-full rounded-lg bg-[#D4A017] py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60"
                >
                  {generatingPost ? '✨ กำลังเรียบเรียง...' : '✨ ให้ AI เรียบเรียงโพสต์ Facebook'}
                </button>
              )}
            </div>
          ))}
        </div>

        {aiPost && (
          <div className="space-y-3 rounded-2xl border-2 border-[#D4A017] bg-white p-5">
            <h3 className="font-bold text-[#0D1B3E]">✨ โพสต์พร้อมใช้งาน</h3>
            <textarea
              value={aiPost}
              onChange={(e) => setAiPost(e.target.value)}
              rows={12}
              className="w-full rounded-xl border bg-gray-50 p-3 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() =>
                copyText(aiPost, 'คัดลอกแล้ว! ไปวางใน Facebook ได้เลยครับ 🎉')
              }
              className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              📋 คัดลอกโพสต์ → วางใน Facebook Group
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
