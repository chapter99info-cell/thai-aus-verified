import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  AdminDashboard,
  type AdminDashboardData,
} from '@/components/admin/AdminDashboard'
import { ADMIN_COOKIE, verifyAdminCookie } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/admin'
import type { Profile, ServiceProvider } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin | Thai-Aus Verified',
}

type ProviderRow = ServiceProvider & {
  email?: string | null
  providers?: {
    email?: string | null
    business_name?: string | null
    phone?: string | null
  } | null
}

async function loadAdminData(): Promise<AdminDashboardData> {
  const service = createServiceClient()

  if (!service) {
    return {
      stats: {
        totalProfiles: 0,
        pendingVerification: 0,
        activeSubscribers: 0,
        openReports: 0,
      },
      pending: [],
      reports: [],
      subscribers: [],
    }
  }

  const [
    profilesRes,
    pendingRes,
    subscribersRes,
    reportsRes,
  ] = await Promise.all([
    service.from('providers').select('id', { count: 'exact', head: true }),
    service
      .from('providers')
      .select('*')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false }),
    service
      .from('providers')
      .select('*')
      .eq('subscription_status', 'premium')
      .order('created_at', { ascending: false }),
    service
      .from('reviews')
      .select('*, reviewer:reviewer_id(full_name, email)')
      .gt('report_count', 0)
      .or('status.is.null,status.eq.visible')
      .order('reported_at', { ascending: false }),
  ])

  const reports = (reportsRes.data ?? []) as AdminDashboardData['reports']
  const pending = ((pendingRes.data ?? []) as ProviderRow[]).map((row) => ({
    ...row,
    category: (row.job_category ?? row.category) as ServiceProvider['category'],
    providers: {
      email: row.email ?? null,
      business_name: row.business_name,
      phone: row.phone ?? null,
    },
  }))
  const subscribers = ((subscribersRes.data ?? []) as ProviderRow[]).map((row) => ({
    ...row,
    category: (row.job_category ?? row.category) as ServiceProvider['category'],
    providers: {
      email: row.email ?? null,
      business_name: row.business_name,
      phone: row.phone ?? null,
    },
  }))

  return {
    stats: {
      totalProfiles: profilesRes.count ?? 0,
      pendingVerification: pending.length,
      activeSubscribers: subscribers.length,
      openReports: reports.length,
    },
    pending,
    reports,
    subscribers,
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies()

  if (!verifyAdminCookie(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login')
  }

  const data = await loadAdminData()

  return <AdminDashboard initialData={data} />
}
