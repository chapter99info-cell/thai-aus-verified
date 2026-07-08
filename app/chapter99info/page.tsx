import { redirect } from 'next/navigation'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin | Thai-Aus Verified',
}

export default async function Chapter99InfoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('providers')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <AdminPanel />
    </div>
  )
}
