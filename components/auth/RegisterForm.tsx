'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { AU_STATES, CATEGORY_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import type { AustralianState, ServiceCategory } from '@/types'

export function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [registerBusiness, setRegisterBusiness] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState<ServiceCategory>('restaurant')
  const [abn, setAbn] = useState('')
  const [state, setState] = useState<AustralianState>('NSW')
  const [suburb, setSuburb] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const user = data.user
    if (!user) {
      setError('ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่')
      setLoading(false)
      return
    }

    if (phone) {
      await supabase.from('profiles').update({ phone }).eq('id', user.id)
    }

    if (registerBusiness && data.session) {
      const { error: bizError } = await supabase.from('service_providers').insert({
        profile_id: user.id,
        business_name: businessName,
        category,
        abn_number: abn,
        state,
        suburb,
        description,
        verification_status: 'pending',
        is_verified: false,
      })

      if (bizError) {
        setError('สร้างบัญชีสำเร็จ แต่ลงทะเบียนธุรกิจไม่สำเร็จ: ' + bizError.message)
        setLoading(false)
        return
      }
    }

    if (!data.session) {
      setSuccess('ลงทะเบียนสำเร็จ! กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ')
      setLoading(false)
      return
    }

    setSuccess('ลงทะเบียนสำเร็จ!')
    router.push('/dashboard?registered=1')
    router.refresh()
  }

  const selectClass =
    'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <Input
        id="fullName"
        label="ชื่อ-นามสกุล"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        id="email"
        type="email"
        label="อีเมล"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        type="password"
        label="รหัสผ่าน"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <Input
        id="phone"
        type="tel"
        label="เบอร์โทร (ไม่บังคับ)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          checked={registerBusiness}
          onChange={(e) => setRegisterBusiness(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#1e3a5f]"
        />
        <span className="text-sm text-slate-700">ฉันต้องการลงทะเบียนธุรกิจด้วย</span>
      </label>

      {registerBusiness && (
        <div className="space-y-4 rounded-xl border border-[#1e3a5f]/20 bg-slate-50 p-5">
          <h3 className="font-semibold text-[#1e3a5f]">ข้อมูลธุรกิจ</h3>
          <Input
            id="businessName"
            label="ชื่อธุรกิจ"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required={registerBusiness}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">ประเภท</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className={selectClass}
              required={registerBusiness}
            >
              {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat].th}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="abn"
            label="ABN"
            value={abn}
            onChange={(e) => setAbn(e.target.value)}
            required={registerBusiness}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">รัฐ</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value as AustralianState)}
                className={selectClass}
                required={registerBusiness}
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
              required={registerBusiness}
            />
          </div>
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
              คำอธิบาย
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={selectClass}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#1e3a5f] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d5282] disabled:opacity-50"
      >
        {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
      </button>

      <p className="text-center text-sm text-slate-600">
        มีบัญชีแล้ว?{' '}
        <Link href="/login" className="font-medium text-[#1e3a5f] hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  )
}
