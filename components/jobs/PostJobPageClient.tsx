'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Store } from 'lucide-react'
import { PostJobBlocked } from '@/components/jobs/PostJobBlocked'
import { PostJobForm } from '@/components/jobs/PostJobForm'
import { PageLoading } from '@/components/mvp/PageLoading'
import { createClient } from '@/lib/supabase/client'
import type { JobBoardBusiness } from '@/types/job-board'

type ViewState = 'loading' | 'form' | 'not_verified' | 'no_business'

export default function PostJobPageClient() {
  const router = useRouter()
  const [view, setView] = useState<ViewState>('loading')
  const [business, setBusiness] = useState<JobBoardBusiness | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: provider } = await supabase
        .from('providers')
        .select('is_verified')
        .eq('id', user.id)
        .single()

      if (provider?.is_verified !== true) {
        setView('not_verified')
        return
      }

      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_verified', true)
        .maybeSingle()

      if (!businessData) {
        setView('no_business')
        return
      }

      setBusiness(businessData as JobBoardBusiness)
      setView('form')
    }

    void load()
  }, [router])

  if (view === 'loading') {
    return <PageLoading message="กำลังโหลด..." />
  }

  if (view === 'not_verified') {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <PostJobBlocked variant="not_verified" />
      </div>
    )
  }

  if (view === 'no_business') {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <PostJobBlocked variant="no_business" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-[#D4A017] bg-white p-8 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#D4A017]" aria-hidden />
          <p className="mt-4 text-base font-semibold text-[#0D1B3E]">กำลังโหลดข้อมูลร้าน...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg">
        <h1 className="flex items-center gap-2 text-[22px] font-bold text-[#0D1B3E]">
          <Store className="h-7 w-7 text-[#D4A017]" aria-hidden />
          📢 โพสต์ประกาศงาน
        </h1>
        <p className="mt-2 text-base text-[#0D1B3E]">กรอกข้อมูลด้านล่าง — ประกาศจะแสดง 14 วัน</p>
        <div className="mt-6">
          <PostJobForm business={business} />
        </div>
      </div>
    </div>
  )
}
