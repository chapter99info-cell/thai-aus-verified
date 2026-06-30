import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { JobCard, JobsEmptyState, JobsPagination } from '@/components/jobs/JobBoardParts'
import { MvpErrorState } from '@/components/mvp/MvpStates'
import { GoldButton } from '@/components/mvp/MvpButtons'
import {
  activeJobsCutoffIso,
  parsePageParam,
  totalPages,
} from '@/lib/job-board'
import { JOB_PAGE_SIZE } from '@/lib/mvp-constants'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { JobPostingWithBusiness } from '@/types/job-board'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'หางาน | Thai-Aus Verified',
  description: 'ประกาศรับสมัครงานจากร้านไทยที่ผ่านการ Verify ในออสเตรเลีย',
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parsePageParam(params.page)
  const from = (page - 1) * JOB_PAGE_SIZE
  const to = from + JOB_PAGE_SIZE - 1

  if (!isSupabaseConfigured()) {
    return (
      <PageShell>
        <MvpErrorState
          title="ไม่สามารถโหลดประกาศงานได้"
          message="ระบบยังไม่ได้ตั้งค่า กรุณาลองใหม่ภายหลัง"
          actionHref="/"
          actionLabel="กลับหน้าแรก"
        />
      </PageShell>
    )
  }

  const supabase = await createClient()
  await supabase.rpc('expire_old_jobs')

  const cutoff = activeJobsCutoffIso()

  const { data, error, count } = await supabase
    .from('job_postings')
    .select('*, businesses(*)', { count: 'exact' })
    .eq('is_active', true)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return (
      <PageShell>
        <MvpErrorState
          title="โหลดประกาศงานไม่สำเร็จ"
          message="เกิดข้อผิดพลาดชั่วคราว กรุณากดรีเฟรชหรือลองใหม่อีกครั้ง"
          actionHref="/jobs"
          actionLabel="ลองใหม่"
        />
      </PageShell>
    )
  }

  const jobs = (data ?? []) as JobPostingWithBusiness[]
  const pages = totalPages(count ?? 0, JOB_PAGE_SIZE)

  return (
    <PageShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-[22px] font-bold text-[#0D1B3E]">
            <Briefcase className="h-7 w-7 text-[#D4A017]" aria-hidden />
            ประกาศหางาน
          </h1>
          <p className="mt-1 text-base text-[#0D1B3E]">จากร้านไทยที่ผ่านการ Verify — แสดงผล 14 วัน</p>
        </div>
        <GoldButton href="/jobs/post" className="sm:w-auto sm:min-w-[220px]">
          📢 โพสต์งาน
        </GoldButton>
      </div>

      {jobs.length === 0 ? (
        <JobsEmptyState />
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <JobsPagination page={page} totalPages={pages} basePath="/jobs" />
        </>
      )}
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  )
}
