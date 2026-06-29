import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ศูนย์รวมลิงก์มีประโยชน์ | Thai-Aus Verified',
  description:
    'ทุกอย่างที่คนไทยในออสเตรเลียต้องการ — หางาน หาที่พัก วีซ่า และบริการ Verified ABN รวมไว้ที่เดียว',
}

type ExternalLink = {
  icon: string
  name: string
  description: string
  href: string
  badge?: string
}

const JOB_LINKS: ExternalLink[] = [
  {
    icon: '🔎',
    name: 'Seek.com.au',
    description: 'งานทุกประเภทในออสเตรเลีย',
    href: 'https://seek.com.au',
  },
  {
    icon: '📋',
    name: 'Indeed.com.au',
    description: 'ค้นหางานง่าย กรองตำแหน่งได้',
    href: 'https://au.indeed.com',
  },
  {
    icon: '🏪',
    name: 'Gumtree Jobs',
    description: 'งาน Part-time และงานท้องถิ่น',
    href: 'https://gumtree.com.au/s-jobs',
  },
  {
    icon: '👷',
    name: 'Jora.com',
    description: 'งานในออสเตรเลียหลายแสนตำแหน่ง',
    href: 'https://au.jora.com',
  },
  {
    icon: '🍜',
    name: 'Hospitality Jobs',
    description: 'งานร้านอาหาร โรงแรม บริการ',
    href: 'https://hospowork.com.au',
  },
  {
    icon: '🏠',
    name: 'Care Jobs',
    description: 'งาน Aged care, Childcare, NDIS',
    href: 'https://ethicaljobs.com.au',
  },
]

const HOUSING_LINKS: ExternalLink[] = [
  {
    icon: '🏘️',
    name: 'Domain.com.au',
    description: 'ซื้อ/เช่าบ้านทั่วออสเตรเลีย',
    href: 'https://domain.com.au',
  },
  {
    icon: '🤝',
    name: 'Flatmates.com.au',
    description: 'หาเพื่อนร่วมบ้าน Share house',
    href: 'https://flatmates.com.au',
  },
  {
    icon: '🏠',
    name: 'Realestate.com.au',
    description: 'บ้านและคอนโดให้เช่าทั่ว AU',
    href: 'https://realestate.com.au',
  },
  {
    icon: '📱',
    name: 'Facebook Marketplace',
    description: 'ห้องเช่าจากคนไทยในซิดนีย์',
    href: 'https://facebook.com/marketplace',
  },
  {
    icon: '🏨',
    name: 'Gumtree Rentals',
    description: 'ห้องพักราคาประหยัด',
    href: 'https://gumtree.com.au/s-real-estate',
  },
  {
    icon: '🏡',
    name: 'Airbnb',
    description: 'พักระยะสั้น เหมาะสำหรับคนใหม่',
    href: 'https://airbnb.com.au',
  },
]

const VISA_LINKS: ExternalLink[] = [
  {
    icon: '🛂',
    name: 'วีซ่าออสเตรเลีย',
    description: 'ตรวจสอบสถานะวีซ่าและสมัครออนไลน์',
    href: 'https://immi.homeaffairs.gov.au',
    badge: 'ราชการ 🏛️',
  },
  {
    icon: '⚖️',
    name: 'Fair Work',
    description: 'สิทธิแรงงาน ค่าแรงขั้นต่ำ',
    href: 'https://fairwork.gov.au',
    badge: 'ราชการ 🏛️',
  },
  {
    icon: '🔢',
    name: 'สมัคร ABN',
    description: 'จดทะเบียนธุรกิจกับรัฐบาลออสเตรเลีย',
    href: 'https://abr.business.gov.au',
    badge: 'ราชการ 🏛️',
  },
  {
    icon: '💰',
    name: 'ATO — ภาษี',
    description: 'ยื่นภาษี TFN Tax Return',
    href: 'https://ato.gov.au',
    badge: 'ราชการ 🏛️',
  },
  {
    icon: '🏥',
    name: 'Medicare',
    description: 'ระบบสุขภาพออสเตรเลีย',
    href: 'https://servicesaustralia.gov.au/medicare',
    badge: 'ราชการ 🏛️',
  },
  {
    icon: '🚔',
    name: 'Scamwatch',
    description: 'แจ้งเตือนภัยจากรัฐบาล',
    href: 'https://scamwatch.gov.au',
    badge: 'ราชการ 🏛️',
  },
]

function ExternalLinkCard({ link }: { link: ExternalLink }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {link.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[#1e3a5f]">{link.name}</h3>
            {link.badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {link.badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">{link.description}</p>
        </div>
      </div>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-fit items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        เปิดเว็บ ↗
      </a>
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
          ศูนย์รวมลิงก์มีประโยชน์
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          ทุกอย่างที่คนไทยในออสเตรเลียต้องการ — รวมไว้ที่เดียว
        </p>
      </div>

      {/* Section 1: Our Services */}
      <section className="bg-[#1e3a5f] px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold">🛡️ Thai-Aus Verified — บริการของเรา</h2>
          <p className="mt-2 text-white/80">เริ่มที่นี่ก่อนเลยครับ</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border-2 border-[#1e3a5f] bg-white p-6 text-slate-900">
              <span className="text-3xl">🔍</span>
              <h3 className="mt-3 text-lg font-bold text-[#1e3a5f]">ค้นหาธุรกิจไทย</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">
                ช่าง ร้านอาหาร นวด และอื่นๆ ที่ Verified ABN
              </p>
              <Link
                href="/directory"
                className="mt-4 inline-flex w-fit rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282]"
              >
                ค้นหาเลย
              </Link>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-[#1e3a5f] bg-white p-6 text-slate-900">
              <span className="text-3xl">✅</span>
              <h3 className="mt-3 text-lg font-bold text-[#1e3a5f]">ลงทะเบียนธุรกิจ</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">
                รับ Verified Badge ฟรี ใน 30 วินาที
              </p>
              <Link
                href="/register"
                className="mt-4 inline-flex w-fit rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282]"
              >
                ลงทะเบียนฟรี
              </Link>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-red-200 bg-red-50 p-6">
              <span className="text-3xl">⚠️</span>
              <h3 className="mt-3 text-lg font-bold text-red-800">แจ้งเตือนภัย Scam</h3>
              <p className="mt-2 flex-1 text-sm text-red-700">
                ตรวจสอบก่อนโอนเงิน ปลอดภัยไว้ก่อน
              </p>
              <Link
                href="/alerts"
                className="mt-4 inline-flex w-fit rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                ดูการแจ้งเตือน
              </Link>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
              <span className="text-3xl">💬</span>
              <h3 className="mt-3 text-lg font-bold text-blue-800">ชุมชน Facebook</h3>
              <p className="mt-2 flex-1 text-sm text-blue-700">
                เข้าร่วมกลุ่ม Thai Sydney Verified Community
              </p>
              <a
                href="https://facebook.com/groups/1631889741218502"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                เข้ากลุ่ม Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Jobs */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[#1e3a5f]">💼 หางานในออสเตรเลีย</h2>
          <p className="mt-2 text-sm text-slate-500">
            แนะนำให้เริ่มจาก Directory ของเราก่อน — ธุรกิจไทยที่ Verified น่าเชื่อถือกว่า
          </p>

          <div className="mt-6 rounded-2xl border-2 border-[#1e3a5f] bg-[#1e3a5f]/5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="rounded-full bg-[#C8A84B] px-3 py-1 text-xs font-bold text-[#1e3a5f]">
                  แนะนำ ⭐
                </span>
                <h3 className="mt-3 text-lg font-bold text-[#1e3a5f]">
                  🔍 หางานผ่าน Directory ของเรา
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  ธุรกิจไทยที่ Verified ประกาศรับสมัครงาน
                </p>
              </div>
              <Link
                href="/directory?category=jobs"
                className="inline-flex rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282]"
              >
                ดูประกาศงาน
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_LINKS.map((link) => (
              <ExternalLinkCard key={link.href} link={link} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Housing */}
      <section className="border-t border-slate-100 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[#1e3a5f]">🏠 หาที่พักในออสเตรเลีย</h2>
          <p className="mt-2 text-sm text-slate-500">
            ตรวจสอบเจ้าของห้องใน Directory ของเราก่อนจ่ายเงินมัดจำ
          </p>

          <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-900">
              ⚠️ ก่อนจ่ายเงินมัดจำ — ตรวจสอบเจ้าของห้องใน Directory ของเราก่อนนะครับ
            </p>
            <Link
              href="/directory"
              className="mt-4 inline-flex rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282]"
            >
              ตรวจสอบ ABN เจ้าของ
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOUSING_LINKS.map((link) => (
              <ExternalLinkCard key={link.href} link={link} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Visa & Legal */}
      <section className="border-t border-slate-100 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[#1e3a5f]">📋 วีซ่าและกฎหมายออสเตรเลีย</h2>
          <p className="mt-2 text-sm text-slate-500">
            ข้อมูลจากแหล่งราชการเท่านั้น ไม่มีโฆษณา
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VISA_LINKS.map((link) => (
              <ExternalLinkCard key={link.href} link={link} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="bg-[#1e3a5f] px-4 py-14 text-center text-white sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold">ยังไม่ได้ลงทะเบียนธุรกิจของคุณ?</h2>
          <p className="mt-3 text-white/85">รับ Verified Badge ฟรี ภายใน 30 วินาที</p>
          <Link
            href="/register"
            className="mt-6 inline-flex rounded-xl bg-white px-8 py-3 text-sm font-bold text-[#1e3a5f] hover:bg-slate-100"
          >
            ลงทะเบียนเลย
          </Link>
        </div>
      </section>
    </div>
  )
}
