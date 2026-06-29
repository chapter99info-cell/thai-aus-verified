import OccupationCategories from '@/components/OccupationCategories'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
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
    <>
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
          <div className="py-16 text-center">
            <span className="text-6xl">✅</span>
            <h3 className="mt-4 text-xl font-bold text-slate-700">
              ขณะนี้ไม่มีการแจ้งเตือนภัย
            </h3>
            <p className="mt-2 text-slate-500">
              ชุมชนของเราปลอดภัยดีครับ — อัปเดตทุกสัปดาห์
            </p>
          </div>
        ) : (
          <ul className="mt-10 space-y-6">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="space-y-3 rounded-r-2xl border border-slate-200 border-l-4 border-l-red-500 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="text-lg font-bold leading-tight text-slate-900">
                      {alert.title}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {alert.category ?? 'ทั่วไป'} · {formatDateDDMMYYYY(alert.created_at)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 leading-relaxed text-slate-700">
                  {alert.description.split('\n').map((line, i) => {
                    const trimmed = line.trim()
                    if (!trimmed) return null
                    return (
                      <p key={i} className="leading-relaxed">
                        {trimmed}
                      </p>
                    )
                  })}
                </div>

                <div className="space-y-1 rounded-xl bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-700">⚡ สัญญาณอันตราย:</p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
                    <li>มีการขอโอนเงินก่อนเริ่มงาน</li>
                    <li>ไม่มี ABN หรือปฏิเสธให้ตรวจสอบ</li>
                    <li>ราคาถูกผิดปกติ</li>
                  </ul>
                </div>

                {alert.evidence_url && (
                  <a
                    href={alert.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#1e3a5f] hover:underline"
                  >
                    ดูหลักฐาน →
                  </a>
                )}

                <a
                  href="mailto:chapter99solutions@gmail.com?subject=แจ้งเตือนภัยเพิ่มเติม - Thai-Aus Verified"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1e3a5f] hover:underline"
                >
                  📧 แจ้งเพิ่มเติม →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <OccupationCategories />

      <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-slate-700">พบเห็นการโกง? แจ้งให้เราทราบ</p>
          <a
            href="mailto:chapter99solutions@gmail.com?subject=แจ้งเตือนภัย - Thai-Aus Verified"
            className="mt-4 inline-block rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2d5282]"
          >
            ส่งอีเมลแจ้งเตือน
          </a>
        </div>
      </div>
    </>
  )
}
