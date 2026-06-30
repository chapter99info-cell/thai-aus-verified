'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import OccupationCategories from '@/components/OccupationCategories'
import { CATEGORY_ICON_BASE } from '@/lib/constants'
import type { MarqueeBusiness } from '@/lib/marquee-businesses'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4'

const LOGO_PLACEHOLDER =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

const TESTIMONIALS = [
  {
    quote: 'ลูกค้าเชื่อถือมากขึ้นเมื่อเห็น Verified Badge บน Directory',
    name: 'คุณมิรา',
    role: 'เจ้าของร้านนวด',
    company: 'MIRA MASSAGE',
    color: 'bg-[#051A24]',
  },
  {
    quote: 'ระบบ ABN อัตโนมัติทำให้ลงทะเบียนได้ในไม่กี่นาที',
    name: 'คุณสมชาย',
    role: 'ร้านอาหารไทย',
    company: 'THAI GARLIC',
    color: 'bg-[#c9a84c]',
  },
  {
    quote: 'ชุมชนไทยในออส finally มีที่ที่ปลอดภัยจริงๆ',
    name: 'คุณนิด',
    role: 'ผู้ประกอบการ',
    company: 'CHAPTER99',
    color: 'bg-[#1e3a5f]',
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
      <p className="truncate text-xs font-semibold text-[#051A24]">{business.name}</p>
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
  const statVerified = verifiedCount > 0 ? String(verifiedCount) : '30'
  const statStates = stateCount > 0 ? String(stateCount) : '8'

  return (
    <div id="premium-home" className="overflow-x-hidden bg-white pb-28">
      {alertTitle && (
        <div className="border-b border-amber-200/60 bg-amber-50/80 px-4 py-2.5 text-center text-sm text-amber-900">
          ⚠️ {alertTitle} —{' '}
          <Link href="/alerts" className="font-medium underline">
            ดูทั้งหมด
          </Link>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
          src={HERO_VIDEO}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/88 to-white/98" />

        <div className="relative mx-auto max-w-[600px] px-4 pb-16 pt-20 text-center sm:px-6">
          <FadeIn delay={0.1}>
            <p className="font-mono text-[11px] uppercase tracking-[1.5px] text-[rgba(5,26,36,0.4)]">
              ตรวจสอบ ABN · เชื่อถือได้ · ทั่วออสเตรเลีย
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1
              className="mt-6 text-[clamp(40px,5.5vw,66px)] font-extrabold leading-none tracking-[-2px] text-[#0D212C]"
              style={{ fontWeight: 800 }}
            >
              ค้นหาธุรกิจไทย
              <br />
              <span className="font-playfair italic font-bold">ที่เชื่อถือได้</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mx-auto mt-6 max-w-[420px] text-[15px] leading-[1.7] text-[rgba(5,26,36,0.5)]">
              ไดเรกทอรีธุรกิจไทยที่ผ่านการยืนยัน ABN จากรัฐบาลออสเตรเลีย ปลอดภัย โปร่งใส
              เชื่อถือได้ในทุกรัฐ
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/directory"
                className="btn-navy-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              >
                🔍 ค้นหาธุรกิจ
              </Link>
              <Link
                href="/register"
                className="btn-navy-secondary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              >
                ลงทะเบียนธุรกิจของคุณ →
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-10 flex items-center justify-center gap-0 divide-x divide-[rgba(5,26,36,0.12)]">
              {[
                { value: statVerified, label: 'ยืนยัน ABN' },
                { value: statStates, label: 'รัฐ & เขต' },
                { value: 'A$9', label: 'Premium/เดือน' },
              ].map((stat) => (
                <div key={stat.label} className="px-6 text-center">
                  <p className="font-playfair text-[26px] text-[#051A24]">{stat.value}</p>
                  <p className="mt-1 text-xs text-[rgba(5,26,36,0.45)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

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
            className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-tight tracking-[-1px] text-[#0D212C]"
            style={{ fontWeight: 800 }}
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
                className="cursor-default text-[15px] font-bold text-[rgba(5,26,36,0.35)] transition-colors hover:text-[#051A24]"
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
          <div className="rounded-[28px] bg-[#051A24] p-7 md:col-span-2">
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

      {/* Testimonials */}
      <section className="border-t border-[rgba(5,26,36,0.06)] bg-[#f9fafb] py-16">
        <FadeIn className="mx-auto max-w-[1100px] px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-extrabold text-[#0D212C]" style={{ fontWeight: 800 }}>
              เสียงจากชุมชน
              <span className="font-playfair italic font-bold">ธุรกิจไทย</span>
            </h2>
            <p className="text-sm text-[#c9a84c]">★★★★★ 5.0 · Community Reviews</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-[24px] border border-[rgba(5,26,36,0.09)] bg-white p-6 transition-transform hover:-translate-y-1"
              >
                <p className="text-sm italic leading-relaxed text-[rgba(5,26,36,0.65)]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}>
                    {t.name.charAt(2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#051A24]">{t.name}</p>
                    <p className="text-xs text-[rgba(5,26,36,0.45)]">{t.role}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#051A24]">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* CTA Band */}
      <FadeIn className="mx-auto max-w-[1100px] px-6 pb-16">
        <div className="relative overflow-hidden rounded-[36px] bg-[#051A24] p-10 md:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-tight text-white" style={{ fontWeight: 800 }}>
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
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#051A24]"
              >
                ลงทะเบียนฟรี
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                ดูแผน Premium
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Homepage Footer */}
      <footer className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 border-t border-[rgba(5,26,36,0.08)] px-6 py-8 sm:flex-row">
        <span className="font-playfair text-[18px] font-bold text-[#051A24]">Thai-Aus Verified</span>
        <nav className="flex flex-wrap justify-center gap-4 text-xs text-[rgba(5,26,36,0.45)]">
          <Link href="/directory" className="hover:text-[#051A24]">
            ค้นหา
          </Link>
          <Link href="/pricing" className="hover:text-[#051A24]">
            ราคา
          </Link>
          <Link href="/alerts" className="hover:text-[#051A24]">
            แจ้งเตือนภัย
          </Link>
          <Link href="/terms" className="hover:text-[#051A24]">
            เงื่อนไข
          </Link>
        </nav>
        <p className="text-xs text-[rgba(5,26,36,0.45)]">
          © 2026 Thai-Aus Verified · Powered by Chapter99 Solutions
        </p>
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
    <div className="rounded-[28px] border border-[rgba(5,26,36,0.09)] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(5,26,36,0.08)]">
      {icon && <img src={icon} alt="" width={32} height={32} className="mb-3 h-8 w-8" />}
      <h3 className="text-base font-bold text-[#051A24]">{title}</h3>
      {desc && <p className="mt-1 text-sm text-[rgba(5,26,36,0.5)]">{desc}</p>}
      <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs ${tagClass}`}>{tag}</span>
    </div>
  )
}
