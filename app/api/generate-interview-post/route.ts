export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { InterviewAnswer } from '@/types'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from('providers')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { ok: true as const }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured', post: 'ไม่สามารถสร้างโพสต์ได้ — ยังไม่ได้ตั้งค่า API key' },
      { status: 503 }
    )
  }

  const { intervieweeName, businessName, answers } = (await req.json()) as {
    intervieweeName: string
    businessName?: string
    answers: InterviewAnswer[]
  }

  const qaText = (answers ?? [])
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join('\n\n')

  const prompt = `คุณคือนักเขียนคอนเทนต์มืออาชีพสำหรับกลุ่ม Facebook "Thai Sydney Verified Community | ชุมชนบริการสีขาว คนไทยในซิดนีย์"

ข้อมูลผู้ถูกสัมภาษณ์:
- ชื่อ: ${intervieweeName}
- ธุรกิจ: ${businessName || 'ไม่ระบุ'}

บทสัมภาษณ์:
${qaText}

กรุณาเขียนโพสต์ Facebook ภาษาไทย 1 โพสต์ที่:
- เริ่มต้นด้วยหัวข้อที่น่าสนใจ ดึงดูดให้อยากอ่านต่อ
- เล่าเรื่องราวธุรกิจแบบอบอุ่น เป็นมนุษย์ ไม่ใช่โฆษณา
- ความยาว 200-300 คำ พอดี
- ใช้ emoji 3-5 ตัวเท่านั้น
- ปิดท้ายด้วยการเชิญชวนให้คนในกลุ่มไปอุดหนุนหรือแชร์ต่อ
- ลงท้ายด้วย: #ThaiSydneyVerified #ธุรกิจไทยซิดนีย์ #ThaiAusVerified
- ห้ามใส่ heading หรือ markdown ใดๆ เขียนเป็น paragraph ธรรมชาติเหมือนคนเขียนเอง`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )
    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`)
    const data = await response.json()
    const post = data.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่สามารถสร้างโพสต์ได้'
    return NextResponse.json({ post })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { post: 'เกิดข้อผิดพลาดในการเชื่อมต่อระบบ AI กรุณาลองใหม่อีกครั้งครับ' },
      { status: 500 }
    )
  }
}
