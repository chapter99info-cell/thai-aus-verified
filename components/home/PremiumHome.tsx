'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import OccupationCategories from '@/components/OccupationCategories'
import { CATEGORY_ICON_BASE } from '@/lib/constants'
import type { MarqueeBusiness } from '@/lib/marquee-businesses'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4'

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: '📝',
    title: 'ลงทะเบียน',
    desc: 'กรอกข้อมูลและ ABN ของคุณ',
  },
  {
    step: 2,
    icon: '✅',
    title: 'ยืนยัน ABN',
    desc: 'ทีมงานตรวจสอบกับรัฐบาลออสฯ ภายใน 48 ชม.',
  },
  {
    step: 3,
    icon: '🏆',
    title: 'รับป้าย Verified',
    desc: 'โปรไฟล์ขึ้น directory ทันที',
  },
]

const JOB_CATEGORIES = [
  { emoji: '📸', label: 'Photography/Video' },
  { emoji: '🧹', label: 'Cleaning/Housekeeping' },
  { emoji: '💆', label: 'Thai Massage/Spa' },
  { emoji: '🔨', label: 'Tradie/Handyman' },
  { emoji: '🍜', label: 'Food/Catering' },
  { emoji: '🚗', label: 'Transport/Delivery' },
  { emoji: '💄', label: 'Tattoo/Beauty' },
  { emoji: '🏠', label: 'Real Estate Agent' },
  { emoji: '📚', label: 'Tutoring/Translation' },
  { emoji: '➕', label: 'Other' },
]

const FAQ_ITEMS = [
  {
    q: 'ABN คืออะไร ต่างจาก TFN ยังไง?',
    a: 'ABN (Australian Business Number) คือเลข 11 หลัก สำหรับธุรกิจ ส่วน TFN เป็นเลขส่วนตัวห้ามแชร์',
  },
  {
    q: 'ใช้เวลานานแค่ไหนในการได้ป้าย Verified?',
    a: 'ทีมงานตรวจสอบภายใน 48 ชั่วโมง วันทำการ',
  },
  {
    q: 'ฟรีจริงไหม?',
    a: 'ฟรี 100% สำหรับช่างและสายอาชีพทั่วไป มีค่าบริการเฉพาะแพ็กเกจโฆษณาธุรกิจ $10/เดือน',
  },
  {
    q: 'ถ้าโดนรีพอร์ตจะเกิดอะไรขึ้น?',
    a: 'ทีมงานจะตรวจสอบ ถ้าผิดจริงจะได้รับ Strike ครบ 3 ครั้งจะถูก Blacklist ถาวร',
  },
  {
    q: 'ลงทะเบียนแล้วโปรไฟล์จะขึ้นที่ไหน?',
    a: 'ขึ้นในหน้า directory ของรัฐที่เลือก เช่น thai-ausverified.com.au/nsw',
  },
]

const TESTIMONIALS = [
  {
    quote: 'ลูกค้าเชื่อถือมากขึ้นเมื่อเห็น Verified Badge บน Directory',
    name: 'คุณมิรา',
    role: 'เจ้าของร้านนวด',
    company: 'MIRA MASSAGE',
    color: 'bg-[#1B2A5E]',
  },
  {
    quote: 'ระบบ ABN อัตโนมัติทำให้ลงทะเบียนได้ในไม่กี่นาที',
    name: 'คุณสมชาย',
    role: 'ร้านอาหารไทย',
    company: 'THAI GARLIC',
    color: 'bg-[#C9A84C]',
  },
  {
    quote: 'ชุมชนไทยในออส finally มีที่ที่ปลอดภัยจริงๆ',
    name: 'คุณนิด',
    role: 'ผู้ประกอบการ',
    company: 'CHAPTER99',
    color: 'bg-[#243B6E]',
  },
]

interface PremiumHomeProps {
  verifiedCount: number
  stateCount: number
  alertTitle?: string
  marqueeBusinesses: MarqueeBusiness[]
  categoryCounts?: Record<string, number>
}

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? undefined : 0,
        animation: visible ? `fadeInUp 0.7s ease ${delay}s forwards` : undefined,
      }}
    >
      {children}
    </div>
  )
}

function MarqueeCard({ business }: { business: MarqueeBusiness }) {
  const isFallback =
    business.id.startsWith('seed-') ||
    business.id === 'f1' ||
    business.id === 'f2' ||
    business.id === 'f3' ||
    business.id === 'f4'
  const href = isFallback ? '/directory' : `/business/${business.id}`

  return (
    <Link
      href={href}
      className="inline-flex h-[68px] min-w-[180px] shrink-0 items-center gap-2.5 rounded-full border border-[rgba(5,26,36,0.1)] bg-white px-4 shadow-[0_2px_8px_rgba(5,26,36,0.04)] transition-shadow hover:border-[rgba(5,26,36,0.2)] hover:shadow-[0_6px_16px_rgba(5,26,36,0.08)]"
    >
      {business.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={business.logo_url}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="text-xl">{business.emoji}</span>
      )}
      <p className="truncate text-xs font-semibold text-[#0D1B3E]">{business.name}</p>
    </Link>
  )
}

export function PremiumHome({
  verifiedCount,
  stateCount,
  alertTitle,
  marqueeBusinesses,
  categoryCounts,
}: PremiumHomeProps) {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const statVerified = verifiedCount > 0 ? String(verifiedCount) : '30'
  const statStates = stateCount > 0 ? String(stateCount) : '8'

  return (
    <div id="premium-home" className="overflow-x-hidden bg-[#F5F5F0] pb-28">
      {alertTitle && (
        <div className="border-b border-amber-200/60 bg-amber-50/80 px-4 py-2.5 text-center text-sm text-amber-900">
          ⚠️ {alertTitle} —{' '}
          <Link href="/alerts" className="font-medium underline">
            ดูทั้งหมด
          </Link>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1B3E]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
          src={HERO_VIDEO}
        />
        <div className="absolute inset-0 bg-[#0D1B3E]/75" />

        <div className="relative mx-auto max-w-[600px] px-4 pb-16 pt-20 text-center sm:px-6">
          <FadeIn delay={0.1}>
            <p className="inline-block rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/20 px-4 py-1.5 text-sm font-medium text-[#C9A84C]">
              ตรวจสอบ ABN · เชื่อถือได้ · ทั่วออสเตรเลีย
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="mt-6 text-[clamp(40px,5.5vw,66px)] font-bold leading-none tracking-[-2px] text-white">
              ค้นหาธุรกิจไทย
              <br />
              <span className="font-playfair italic font-bold text-[#F0D060]">ที่เชื่อถือได้</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mx-auto mt-6 max-w-[420px] text-base leading-relaxed text-white/70">
              ไดเรกทอรีธุรกิจไทยที่ผ่านการยืนยัน ABN จากรัฐบาลออสเตรเลีย ปลอดภัย โปร่งใส
              เชื่อถือได้ในทุกรัฐ
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/directory"
                className="inline-flex items-center justify-center rounded-full bg-[#C9A84C] px-6 py-3 text-base font-bold text-[#0D1B3E] transition-colors hover:bg-[#D4A017]"
              >
                🔍 ค้นหาธุรกิจ
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-[#C9A84C] bg-[#1B2A5E] px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[#243B6E]"
              >
                ลงทะเบียนธุรกิจของคุณ →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/20"
              >
                ดูแผน Premium
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-10 rounded-2xl bg-[#1B2A5E]/80 px-4 py-6 backdrop-blur">
              <div className="flex items-center justify-center gap-0 divide-x divide-white/20">
                {[
                  { value: statVerified, label: 'ยืนยัน ABN' },
                  { value: statStates, label: 'รัฐ & เขต' },
                  { value: 'A$9', label: 'Premium/เดือน' },
                ].map((stat) => (
                  <div key={stat.label} className="px-6 text-center">
                    <p className="font-playfair text-[26px] font-bold text-[#C9A84C]">{stat.value}</p>
                    <p className="mt-1 text-xs text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <FadeIn className="mx-auto max-w-[1100px] px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#0D1B3E]">How It Works</h2>
          <p className="mt-2 text-sm text-[#243B6E]/70">ลงทะเบียน ยืนยัน ABN รับป้าย Verified — ง่ายๆ 3 ขั้นตอน</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((item, index) => (
            <div
              key={item.step}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A84C] text-lg font-bold text-[#0D1B3E]">
                {item.step}
              </div>
              <p className="mt-4 text-3xl" aria-hidden>
                {item.icon}
              </p>
              <h3 className="mt-3 text-lg font-bold text-[#0D1B3E]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#243B6E]/80">{item.desc}</p>
              {index < HOW_IT_WORKS.length - 1 && (
                <span className="mt-4 hidden text-[#C9A84C] md:inline" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Job Categories */}
      <FadeIn className="mx-auto max-w-[1100px] px-6 pb-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#0D1B3E]">Job Categories</h2>
          <p className="mt-2 text-sm text-[#243B6E]/70">เลือกสายอาชีพของคุณแล้วเริ่มลงทะเบียน</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => router.push('/register/professional')}
              className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 text-center transition-colors hover:border-[#C9A84C] hover:shadow-[0_8px_24px_rgba(201,168,76,0.12)] sm:p-5"
            >
              <span className="text-3xl sm:text-4xl" aria-hidden>
                {cat.emoji}
              </span>
              <span className="mt-3 text-xs font-semibold leading-snug text-[#0D1B3E] sm:text-sm">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Marquee */}
      <section className="pt-12">
        <p className="mb-4 text-center text-[10px] uppercase tracking-[2px] text-[rgba(5,26,36,0.25)]">
          ธุรกิจที่จดทะเบียนกับ Chapter99 Solutions
        </p>
        <div className="marquee-mask w-full overflow-hidden">
          <div className="animate-marquee flex gap-6 whitespace-nowrap px-3">
            {marqueeBusinesses.map((biz, i) => (
              <MarqueeCard key={`${biz.id}-${i}`} business={biz} />
            ))}
          </div>
        </div>
      </section>

      <OccupationCategories initialCounts={categoryCounts} />

      {/* Quote */}
      <FadeIn className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="font-playfair text-[48px] leading-none text-[rgba(5,26,36,0.15)]">&ldquo;</span>
          <p
            className="text-[clamp(28px,3.5vw,42px)] font-bold leading-tight tracking-[-1px] text-[#0D1B3E]"
          >
            ชุมชนไทยในออสเตรเลียต้องการ
            <br />
            <span className="font-playfair italic font-bold">พื้นที่ที่เชื่อถือได้</span>
            <br />
            ของตัวเอง
          </p>
          <p className="mt-6 text-[13px] italic text-[rgba(5,26,36,0.45)]">
            — แสน, Founder · Chapter99 Solutions
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {['Chapter99', 'Trip2Talk', 'Thai-Aus Verified'].map((brand) => (
              <span
                key={brand}
                className="cursor-default text-[15px] font-bold text-[#243B6E]/50 transition-colors hover:text-[#0D1B3E]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Bento Grid */}
      <FadeIn className="mx-auto max-w-[1100px] px-6 pb-16">
        <div className="grid auto-rows-auto grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-[28px] bg-[#1B2A5E] p-7 md:col-span-2">
            <img
              src={`${CATEGORY_ICON_BASE}/icons8-visa-stamp-64.png`}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 invert"
            />
            <h3 className="mt-4 text-xl font-bold text-white">ยืนยัน ABN อัตโนมัติใน 30 วินาที</h3>
            <p className="mt-2 text-sm text-white/50">เชื่อมต่อ API รัฐบาลออสเตรเลีย ตรวจสอบสถานะ Active ทันที</p>
            <p className="font-playfair mt-6 text-[28px] text-white">A$0 / ฟรี</p>
            <span className="mt-4 inline-block rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
              Government API
            </span>
          </div>

          <BentoCard
            icon={`${CATEGORY_ICON_BASE}/icons8-hire-me-50.png`}
            title="⚠️ Scam Alert"
            tag="Community Safety"
          />
          <BentoCard title="🔍 ค้นหาแบ่งตามรัฐ" tag="8 States" />
          <BentoCard
            title="💎 Premium Membership"
            desc="A$9/เดือน"
            tag="A$9/เดือน"
            tagClass="bg-green-600 text-white"
          />
          <BentoCard
            icon={`${CATEGORY_ICON_BASE}/icons8-booking-50.png`}
            title="🌐 เว็บไซต์ธุรกิจ"
            tag="Chapter99 · A$199 setup"
          />
        </div>
      </FadeIn>

      {/* Why Verified Matters */}
      <FadeIn className="mx-auto max-w-[1100px] px-6 pb-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#0D1B3E]">Why Verified Matters</h2>
          <p className="mt-2 text-sm text-[#243B6E]/70">ทำไมชุมชนไทยในออสต้องการระบบที่ตรวจสอบได้</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-red-700">ปัญหาที่พบบ่อย</h3>
            <ul className="mt-5 space-y-4">
              {[
                'ไม่รู้ว่าช่างมีตัวตนจริงไหม',
                'ABN ปลอม หนีหายหลังรับเงิน',
                'ไม่มีการการันตีคุณภาพ',
                'โดนโกงแล้วไม่มีทางติดตาม',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-red-800/90">
                  <span aria-hidden>❌</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#0D1B3E] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[#C9A84C]">ทางออกของ Thai-Aus Verified</h3>
            <ul className="mt-5 space-y-4">
              {[
                'ทุกคนยืนยัน ABN กับรัฐบาลออสฯ',
                'มีโปรไฟล์ถาวรพร้อมประวัติ',
                'ระบบ Report + 3 Strikes',
                'ชุมชนช่วยกันดูแล',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/90">
                  <span aria-hidden>✅</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>

      {/* Testimonials */}
      <section className="border-t border-gray-200 bg-[#F5F5F0] py-16">
        <FadeIn className="mx-auto max-w-[1100px] px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-bold text-[#0D1B3E]">
              เสียงจากชุมชน
              <span className="font-playfair italic font-bold">ธุรกิจไทย</span>
            </h2>
            <p className="text-sm text-[#C9A84C]">★★★★★ 5.0 · Community Reviews</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-[24px] border border-gray-100 bg-white p-6 transition-transform hover:-translate-y-1"
              >
                <p className="text-sm italic leading-relaxed text-[#243B6E]/80">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}>
                    {t.name.charAt(2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0D1B3E]">{t.name}</p>
                    <p className="text-xs text-[#243B6E]/60">{t.role}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#0D1B3E]">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* CTA Band */}
      <FadeIn className="mx-auto max-w-[1100px] px-6 pb-16">
        <div className="relative overflow-hidden rounded-[36px] bg-[#1B2A5E] p-10 md:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-bold leading-tight text-white">
                ลงทะเบียนธุรกิจ
                <br />
                <span className="font-playfair italic font-bold">ของคุณวันนี้</span>
              </h2>
              <p className="mt-4 max-w-md text-sm text-white/50">
                รับ Verified Badge ขึ้น Directory ทันที เริ่มต้นฟรี ไม่ต้องใช้บัตรเครดิต
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#0D1B3E] hover:bg-[#D4A017]"
              >
                ลงทะเบียนฟรี
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
              >
                ดูแผน Premium
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* FAQ */}
      <FadeIn className="mx-auto max-w-[760px] px-6 pb-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#0D1B3E]">คำถามที่พบบ่อย</h2>
          <p className="mt-2 text-sm text-[#243B6E]/70">FAQ — Thai-Aus Verified Community</p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-[#0D1B3E] sm:text-base">{item.q}</span>
                  <span
                    className={`shrink-0 text-lg font-bold text-[#C9A84C] transition-transform ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-sm leading-relaxed text-[#243B6E]/80">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </FadeIn>

      {/* Homepage Footer */}
      <footer className="bg-[#0D1B3E] px-6 py-8 text-white/60">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-playfair text-xl font-bold text-[#C9A84C]">Thai-Aus Verified</span>
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
          <Link href="/directory" className="hover:text-[#C9A84C]">
            ค้นหา
          </Link>
          <Link href="/pricing" className="hover:text-[#C9A84C]">
            ราคา
          </Link>
          <Link href="/alerts" className="hover:text-[#C9A84C]">
            แจ้งเตือนภัย
          </Link>
          <Link href="/terms" className="hover:text-[#C9A84C]">
            เงื่อนไข
          </Link>
        </nav>
        <p className="text-xs text-white/60">
          © 2026 Thai-Aus Verified ·{' '}
          <span className="text-[#C9A84C]">Powered by Chapter99 Solutions</span>
        </p>
        </div>
      </footer>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-5 left-1/2 z-50 hidden -translate-x-1/2 md:block">
        <div className="flex items-center gap-1 rounded-full border border-[rgba(5,26,36,0.1)] bg-white/92 px-2 py-2 shadow-[0_8px_32px_rgba(5,26,36,0.12),0_2px_8px_rgba(5,26,36,0.06)] backdrop-blur-xl">
          <Link
            href="/"
            className="font-playfair flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(5,26,36,0.12)] text-[16px] font-bold text-[#051A24] shadow-sm"
          >
            T
          </Link>
          {[
            { href: '/directory', label: 'ค้นหา' },
            { href: '/pricing', label: 'ราคา' },
            { href: '/alerts', label: 'แจ้งเตือนภัย' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-[12px] text-[rgba(5,26,36,0.55)] transition-colors hover:bg-[#f9fafb] hover:text-[#051A24]"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/register" className="btn-navy-primary ml-1 rounded-full px-4 py-2 text-[12px] font-semibold">
            ลงทะเบียนฟรี
          </Link>
        </div>
      </div>
    </div>
  )
}

function BentoCard({
  icon,
  title,
  desc,
  tag,
  tagClass = 'border border-[rgba(5,26,36,0.12)] text-[rgba(5,26,36,0.55)]',
}: {
  icon?: string
  title: string
  desc?: string
  tag: string
  tagClass?: string
}) {
  return (
    <div className="rounded-[28px] border border-gray-100 bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#C9A84C] hover:shadow-[0_12px_32px_rgba(201,168,76,0.1)]">
      {icon && (
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D1B3E]">
          <img src={icon} alt="" width={24} height={24} className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-bold text-[#0D1B3E]">{title}</h3>
      {desc && <p className="mt-1 text-sm text-[#243B6E]/70">{desc}</p>}
      <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs ${tagClass}`}>{tag}</span>
    </div>
  )
}
