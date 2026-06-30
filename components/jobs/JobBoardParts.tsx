import Link from 'next/link'
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import {
  businessTypeBadge,
  formatDaysAgoThai,
  jobContactHref,
  truncateText,
} from '@/lib/job-board'
import type { JobPostingWithBusiness } from '@/types/job-board'
import { GoldButton } from '@/components/mvp/MvpButtons'

export function JobCard({ job }: { job: JobPostingWithBusiness }) {
  const business = job.businesses
  const badge = businessTypeBadge(business.business_type)

  return (
    <article className="rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-5 shadow-sm">
      <span className="inline-block rounded-full bg-[#0D1B3E] px-3 py-1 text-sm font-semibold text-[#D4A017]">
        {badge.emoji} {badge.label}
      </span>
      <h2 className="mt-3 text-lg font-semibold text-[#0D1B3E]">{business.business_name}</h2>

      <div className="mt-4 space-y-2">
        <p className="text-base text-[#0D1B3E]">
          <span className="font-semibold">ตำแหน่ง:</span>{' '}
          <span className="text-xl font-bold">{job.job_title}</span>
        </p>
        <p className="text-base leading-relaxed text-[#0D1B3E]">
          <span className="font-semibold">รายละเอียด:</span>{' '}
          {truncateText(job.description, 120)}
        </p>
      </div>

      <p className="mt-4 text-base text-[#0D1B3E]">📅 {formatDaysAgoThai(job.created_at)}</p>

      <a
        href={jobContactHref(job.contact_info)}
        className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] text-base font-semibold text-[#0D1B3E] transition-opacity hover:opacity-90"
      >
        <Phone className="h-5 w-5" aria-hidden />
        📞 ติดต่อร้านค้า — {job.contact_info}
      </a>
    </article>
  )
}

export function JobsPagination({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null

  const buildHref = (targetPage: number) => {
    const [path, query = ''] = basePath.split('?')
    const params = new URLSearchParams(query)
    params.set('page', String(targetPage))
    const qs = params.toString()
    return qs ? `${path}?${qs}` : `${path}?page=${targetPage}`
  }

  const prevHref = page > 1 ? buildHref(page - 1) : null
  const nextHref = page < totalPages ? buildHref(page + 1) : null

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#0D1B3E] bg-white text-base font-semibold text-[#0D1B3E] sm:flex-none sm:px-6"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
          ← หน้าก่อน
        </Link>
      ) : (
        <span className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl border-2 border-[#0D1B3E]/20 text-base font-semibold text-[#0D1B3E]/40 sm:flex-none sm:px-6">
          ← หน้าก่อน
        </span>
      )}

      <p className="text-center text-base font-semibold text-[#0D1B3E] sm:min-w-[140px]">
        หน้า {page} จาก {totalPages}
      </p>

      {nextHref ? (
        <Link
          href={nextHref}
          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#0D1B3E] text-base font-semibold text-white sm:flex-none sm:px-6"
        >
          หน้าถัดไป →
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Link>
      ) : (
        <span className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-[#0D1B3E]/20 text-base font-semibold text-white/70 sm:flex-none sm:px-6">
          หน้าถัดไป →
        </span>
      )}
    </div>
  )
}

export function JobsEmptyState() {
  return (
    <div className="rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-8 text-center">
      <div className="text-5xl" aria-hidden>
        📋
      </div>
      <h2 className="mt-4 text-[22px] font-bold text-[#0D1B3E]">ยังไม่มีประกาศงานในขณะนี้</h2>
      <div className="mt-6">
        <GoldButton href="/jobs/post">โพสต์ประกาศงานฟรี →</GoldButton>
      </div>
    </div>
  )
}
