'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { AU_STATES, CATEGORY_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import type { AustralianState, ServiceCategory } from '@/types'

type AbnResult = {
  valid: boolean
  businessName?: string
  abn?: string
  state?: string
  error?: string
  apiDown?: boolean
}

const STEPS = ['ตรวจสอบ ABN', 'ข้อมูลธุรกิจ', 'สร้างบัญชี']

function isDuplicateEmailError(error: { message?: string; status?: number | undefined }): boolean {
  const msg = (error.message ?? '').toLowerCase()
  return (
    error.status === 422 ||
    msg.includes('already registered') ||
    msg.includes('already exists') ||
    msg.includes('user already')
  )
}

function mapState(code?: string): AustralianState {
  const valid = AU_STATES as readonly string[]
  if (code && valid.includes(code)) return code as AustralianState
  return 'NSW'
}

export function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [abnInput, setAbnInput] = useState('')
  const [abnResult, setAbnResult] = useState<AbnResult | null>(null)
  const [abnConfirmed, setAbnConfirmed] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState<ServiceCategory>('restaurant')
  const [state, setState] = useState<AustralianState>('NSW')
  const [suburb, setSuburb] = useState('')
  const [phone, setPhone] = useState('')
  const [lineId, setLineId] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const selectClass =
    'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]'

  async function handleVerifyAbn() {
    setError('')
    setAbnResult(null)
    setAbnConfirmed(false)
    setVerifying(true)

    try {
      const res = await fetch('/api/abn/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abn: abnInput }),
      })
      const data: AbnResult = await res.json()
      setAbnResult(data)

      if (data.apiDown || data.error) {
        setError(data.error ?? '')
      }

      if (data.valid && data.businessName) {
        setBusinessName(data.businessName)
        setState(mapState(data.state))
      }
    } catch {
      setError(
        'ระบบตรวจสอบ ABN ของรัฐบาลกำลังปรับปรุงชั่วคราว กรุณาลองใหม่ในอีก 15 นาที ABN ของคุณไม่มีปัญหาใดๆ ครับ'
      )
    } finally {
      setVerifying(false)
    }
  }

  function goToStep2() {
    if (!abnResult?.valid || !abnConfirmed) return
    setStep(2)
    setError('')
  }

  function goToStep3() {
    if (!businessName.trim() || !suburb.trim()) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    setError('')
    setStep(3)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termsAccepted) {
      setError('กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนลงทะเบียน')
      return
    }
    setError('')
    setShowLoginPrompt(false)
    setLoading(true)

    const supabase = createClient()
    const cleanAbn = abnResult?.abn ?? abnInput.replace(/\s/g, '')

    async function completeRegistration(userId: string) {
      await supabase
        .from('profiles')
        .update({
          phone,
          line_id: lineId || null,
          whatsapp: whatsapp || null,
          tiktok_url: tiktokUrl || null,
          role: 'verified_business',
          full_name: businessName,
        })
        .eq('id', userId)

      const { data: existingProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('profile_id', userId)
        .maybeSingle()

      if (existingProvider) {
        router.push('/dashboard?registered=1')
        router.refresh()
        return
      }

      const { error: bizError } = await supabase.from('service_providers').insert({
        profile_id: userId,
        business_name: businessName,
        category,
        abn_number: cleanAbn,
        state,
        suburb,
        phone: phone || null,
        line_id: lineId || null,
        facebook_url: facebookUrl || null,
        instagram_url: instagramUrl || null,
        tiktok_url: tiktokUrl || null,
        whatsapp: whatsapp || null,
        website: websiteUrl || null,
        is_verified: true,
        verification_status: 'approved',
        verified_at: new Date().toISOString(),
        subscription_status: 'free',
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
      })

      if (bizError) {
        setError('สร้างบัญชีสำเร็จ แต่ลงทะเบียนธุรกิจไม่สำเร็จ: ' + bizError.message)
        setLoading(false)
        return
      }

      router.push('/dashboard?registered=1')
      router.refresh()
    }

    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser()

    if (sessionUser?.email?.toLowerCase() === email.trim().toLowerCase()) {
      await completeRegistration(sessionUser.id)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: businessName },
      },
    })

    if (signUpError) {
      if (isDuplicateEmailError(signUpError)) {
        setError('อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ')
        setShowLoginPrompt(true)
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    const user = data.user
    if (!user) {
      setError('ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่')
      setLoading(false)
      return
    }

    if (user.identities?.length === 0) {
      setError('อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ')
      setShowLoginPrompt(true)
      setLoading(false)
      return
    }

    if (data.session) {
      await completeRegistration(user.id)
      return
    }

    setError('ลงทะเบียนสำเร็จ! กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ')
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        ⚠️ กรุณากรอกเฉพาะ ABN เท่านั้น ห้ามกรอก TFN (Tax File Number) โดยเด็ดขาด
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const num = i + 1
          const active = step === num
          const done = step > num
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? 'bg-green-600 text-white'
                    : active
                      ? 'bg-[#1e3a5f] text-white'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                {done ? <CheckCircle2 size={16} /> : num}
              </div>
              <span className={`text-center text-xs ${active ? 'font-medium text-[#1e3a5f]' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#1e3a5f] transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          {showLoginPrompt && (
            <Link
              href="/login"
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d5282]"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Input
            id="abn"
            label="หมายเลข ABN (11 หลัก)"
            value={abnInput}
            onChange={(e) => setAbnInput(e.target.value)}
            placeholder="12 345 678 901"
            required
          />

          <button
            type="button"
            onClick={handleVerifyAbn}
            disabled={verifying || !abnInput.trim()}
            className="w-full rounded-lg bg-[#1e3a5f] py-3 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50"
          >
            {verifying ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ ABN'}
          </button>

          {abnResult?.valid && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-800">✅ ABN ใช้งานได้ (Active)</p>
              <p className="mt-1 text-sm text-green-700">{abnResult.businessName}</p>
              <p className="mt-1 text-xs text-green-600">ABN: {abnResult.abn}</p>
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={abnConfirmed}
                  onChange={(e) => setAbnConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1e3a5f]"
                />
                <span className="text-sm text-green-800">
                  ยืนยันว่านี่คือธุรกิจของฉันและข้อมูลถูกต้อง
                </span>
              </label>
              <button
                type="button"
                onClick={goToStep2}
                disabled={!abnConfirmed}
                className="mt-4 w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                ดำเนินการต่อ
              </button>
            </div>
          )}

          {abnResult && !abnResult.valid && (
            <div
              className={`rounded-xl border p-4 text-sm ${
                abnResult.apiDown
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {abnResult.apiDown ? '⚠️ ' : '❌ '}
              {abnResult.error}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Input
            id="businessName"
            label="ชื่อธุรกิจ"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">ประเภทธุรกิจ</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className={selectClass}
              required
            >
              {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat].th}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">รัฐ</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value as AustralianState)}
                className={selectClass}
                required
              >
                {AU_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          <Input
            id="suburb"
            label="Suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            required
          />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-[#1e3a5f]">ช่องทางติดต่อ</p>
            <p className="text-xs text-slate-500">
              กรอกอย่างน้อย 1 ช่องทางติดต่อ เพื่อให้ลูกค้าสามารถติดต่อคุณได้
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-[#1e3a5f]/10 p-3">
              <span className="text-xl">📞</span>
              <input
                type="tel"
                placeholder="เบอร์โทร (04xx xxx xxx)"
                className="flex-1 text-sm outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1e3a5f]/10 p-3">
              <span className="text-xl">💚</span>
              <input
                placeholder="Line ID"
                className="flex-1 text-sm outline-none"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1e3a5f]/10 p-3">
              <span className="text-xl">📘</span>
              <input
                placeholder="Facebook URL หรือ username"
                className="flex-1 text-sm outline-none"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1e3a5f]/10 p-3">
              <span className="text-xl">📸</span>
              <input
                placeholder="Instagram @username"
                className="flex-1 text-sm outline-none"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1e3a5f]/10 p-3">
              <span className="text-xl">🎵</span>
              <input
                placeholder="TikTok @username"
                className="flex-1 text-sm outline-none"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1e3a5f]/10 p-3">
              <span className="text-xl">💬</span>
              <input
                type="tel"
                placeholder="WhatsApp เบอร์ (04xx xxx xxx)"
                className="flex-1 text-sm outline-none"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#1e3a5f]/10 p-3">
              <span className="text-xl">🌐</span>
              <input
                placeholder="เว็บไซต์ https://..."
                className="flex-1 text-sm outline-none"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ย้อนกลับ
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className="flex-1 rounded-lg bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282]"
            >
              ดำเนินการต่อ
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{businessName}</p>
            <p>
              {CATEGORY_LABELS[category].th} · {suburb}, {state}
            </p>
            <p className="mt-1">ABN: {abnResult?.abn ?? abnInput.replace(/\s/g, '')}</p>
          </div>

          <Input
            id="email"
            type="email"
            label="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <PasswordInput
            id="password"
            label="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-[#1e3a5f]"
              required
            />
            <span className="text-sm text-slate-700">
              ฉันยอมรับ{' '}
              <Link href="/terms" className="font-medium text-[#1e3a5f] hover:underline" target="_blank">
                ข้อกำหนดและเงื่อนไข
              </Link>{' '}
              และ{' '}
              <Link
                href="/privacy-policy"
                className="font-medium text-[#1e3a5f] hover:underline"
                target="_blank"
              >
                นโยบายความเป็นส่วนตัว
              </Link>{' '}
              ของ Thai-Aus Verified Community รวมถึงยินยอมให้แสดงข้อมูลธุรกิจและช่องทางติดต่อในหน้า Directory
              สาธารณะ
            </span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ย้อนกลับ
            </button>
            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="flex-1 rounded-lg bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50"
            >
              {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนธุรกิจ'}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-slate-600">
        มีบัญชีแล้ว?{' '}
        <Link href="/login" className="font-medium text-[#1e3a5f] hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  )
}
