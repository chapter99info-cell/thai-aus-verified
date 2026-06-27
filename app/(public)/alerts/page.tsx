import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ScamAlert } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'แจ้งเตือนภัย | Thai-Aus Verified',
}

export default async function AlertsPage() {
  let alerts: ScamAlert[] = []

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('scam_alerts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    alerts = (data ?? []) as ScamAlert[]
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-amber-200 bg-[#fef3c7] px-6 py-4">
        <h1 className="text-2xl font-bold text-amber-900">⚠️ แจ้งเตือนภัย</h1>
        <p className="mt-2 text-sm text-amber-800">
          ข้อมูลเตือนภัยสำหรับชุมชนคนไทยในออสเตรเลีย
        </p>
      </div>

      {alerts.length === 0 ? (
        <p className="mt-10 text-center text-slate-600">ขณะนี้ไม่มีการแจ้งเตือนภัย</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">{alert.title}</h2>
                {alert.category && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    {alert.category}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{alert.description}</p>
              <time className="mt-4 block text-xs text-slate-500">
                {new Date(alert.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-slate-700">พบเห็นการโกง? แจ้งให้เราทราบ</p>
        <a
          href="mailto:chapter99solutions@gmail.com?subject=แจ้งเตือนภัย - Thai-Aus Verified"
          className="mt-3 inline-block font-medium text-[#1e3a5f] hover:underline"
        >
          chapter99solutions@gmail.com
        </a>
      </div>
    </div>
  )
}
