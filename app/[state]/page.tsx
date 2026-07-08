import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AU_STATES } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://thai-ausverified.com.au'

const STATE_BY_SLUG = Object.fromEntries(
  AU_STATES.map((state) => [state.toLowerCase(), state])
) as Record<string, (typeof AU_STATES)[number]>

interface PageProps {
  params: Promise<{ state: string }>
}

function resolveState(slug: string) {
  return STATE_BY_SLUG[slug.toLowerCase()] ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params
  const stateName = resolveState(slug)

  if (!stateName) {
    return { title: 'ไม่พบหน้า | Thai-Aus Verified' }
  }

  const canonicalSlug = slug.toLowerCase()

  return {
    title: `ช่างไทยใน ${stateName} | Thai-Aus Verified`,
    description: `ค้นหาช่างและสายอาชีพคนไทย ABN Verified ใน ${stateName} ออสเตรเลีย — ปลอดภัย โปร่งใส`,
    alternates: {
      canonical: `${SITE_URL}/${canonicalSlug}`,
    },
  }
}

export default async function StatePage({ params }: PageProps) {
  const { state: slug } = await params
  const stateName = resolveState(slug)

  if (!stateName) {
    notFound()
  }

  return (
    <div className="bg-[#F5F5F0]">
      <div className="bg-[#0D1B3E] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-white/60 hover:text-[#C9A84C]">
            ← กลับหน้าแรก
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">ช่างไทยใน {stateName}</h1>
          <p className="mt-2 max-w-2xl text-base text-white/70">
            ค้นหาช่างและสายอาชีพคนไทย ABN Verified ใน {stateName} ออสเตรเลีย — ปลอดภัย
            โปร่งใส ไม่มีสแกมเมอร์
          </p>
          <Link
            href={`/directory?state=${encodeURIComponent(stateName)}`}
            className="mt-6 inline-flex rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#0D1B3E] hover:bg-[#D4A017]"
          >
            ค้นหาธุรกิจใน {stateName}
          </Link>
        </div>
      </div>
    </div>
  )
}
