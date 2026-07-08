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
  profiles: Pick<Profile, 'email' | 'full_name' | 'phone'> | null
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
    service.from('profiles').select('id', { count: 'exact', head: true }),
    service
      .from('service_providers')
      .select('*, profiles:profile_id(email, full_name, phone)')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false }),
    service
      .from('service_providers')
      .select('*, profiles:profile_id(email, full_name, phone)')
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

  return {
    stats: {
      totalProfiles: profilesRes.count ?? 0,
      pendingVerification: pendingRes.data?.length ?? 0,
      activeSubscribers: subscribersRes.data?.length ?? 0,
      openReports: reports.length,
    },
    pending: (pendingRes.data ?? []) as ProviderRow[],
    reports,
    subscribers: (subscribersRes.data ?? []) as ProviderRow[],
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
