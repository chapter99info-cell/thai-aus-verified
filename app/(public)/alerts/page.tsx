import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { getSeverityMeta } from '@/lib/scam-alerts'
import { formatDateDDMMYYYY } from '@/lib/utils'
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
      .select(
        'id, title, description, category, severity, state, evidence_url, created_at'
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    alerts = (data ?? []) as ScamAlert[]
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-5">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">
          ⚠️ แจ้งเตือนภัย — Scam Alerts
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          ข้อมูลเตือนภัยสำหรับชุมชนคนไทยในออสเตรเลีย
        </p>
      </div>

      {alerts.length === 0 ? (
        <p className="mt-10 text-center text-slate-600">ขณะนี้ไม่มีการแจ้งเตือนภัย ✅</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {alerts.map((alert) => {
            const severity = getSeverityMeta(alert.severity)

            return (
              <li
                key={alert.id}
                className="rounded-xl border border-slate-200 border-l-4 border-l-amber-500 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-[#1e3a5f]">{alert.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {alert.category && (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        {alert.category}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${severity.badgeClass}`}
                    >
                      {severity.label.replace(/^🟡 |^🟠 |^🔴 /, '')}
                    </span>
                    {alert.state && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        {alert.state}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{alert.description}</p>
                {alert.evidence_url && (
                  <a
                    href={alert.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-[#1e3a5f] underline"
                  >
                    ดูหลักฐาน
                  </a>
                )}
                <time className="mt-4 block text-xs text-slate-500">
                  {formatDateDDMMYYYY(alert.created_at)}
                </time>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-slate-700">พบเห็นการโกง? แจ้งให้เราทราบ</p>
        <a
          href="mailto:chapter99solutions@gmail.com?subject=แจ้งเตือนภัย - Thai-Aus Verified"
          className="mt-4 inline-block rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
        >
          ส่งอีเมลแจ้งเตือน
        </a>
      </div>
    </div>
  )
}
