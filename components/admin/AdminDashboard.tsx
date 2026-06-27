'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import type { ScamAlert, ServiceProvider } from '@/types'

type Tab = 'pending' | 'verified' | 'alerts'

export function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('pending')
  const [pending, setPending] = useState<ServiceProvider[]>([])
  const [verified, setVerified] = useState<ServiceProvider[]>([])
  const [alerts, setAlerts] = useState<ScamAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [newAlert, setNewAlert] = useState({ title: '', description: '', category: '' })

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/')
      return
    }

    const [pendingRes, verifiedRes, alertsRes] = await Promise.all([
      supabase
        .from('service_providers')
        .select('*')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false }),
      supabase
        .from('service_providers')
        .select('*')
        .eq('is_verified', true)
        .order('created_at', { ascending: false }),
      supabase.from('scam_alerts').select('*').order('created_at', { ascending: false }),
    ])

    setPending((pendingRes.data ?? []) as ServiceProvider[])
    setVerified((verifiedRes.data ?? []) as ServiceProvider[])
    setAlerts((alertsRes.data ?? []) as ScamAlert[])
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleApprove(providerId: string, action: 'approve' | 'reject') {
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_id: providerId, action }),
    })
    if (res.ok) loadData()
  }

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlert),
    })
    if (res.ok) {
      setNewAlert({ title: '', description: '', category: '' })
      loadData()
    }
  }

  async function togglePublish(id: string, is_published: boolean) {
    await fetch('/api/admin/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_published }),
    })
    loadData()
  }

  if (loading) {
    return <p className="text-slate-600">กำลังโหลด...</p>
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: `รอการอนุมัติ (${pending.length})` },
    { id: 'verified', label: `ธุรกิจที่อนุมัติแล้ว (${verified.length})` },
    { id: 'alerts', label: 'Scam Alerts' },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'border-b-2 border-[#1e3a5f] text-[#1e3a5f]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'pending' && (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <p className="text-slate-500">ไม่มีรายการรออนุมัติ</p>
            ) : (
              pending.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-slate-900">{p.business_name}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {CATEGORY_LABELS[p.category]?.th} · ABN: {p.abn_number}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {p.suburb}, {p.state}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(p.id, 'approve')}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      อนุมัติ ✅
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(p.id, 'reject')}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      ปฏิเสธ ❌
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'verified' && (
          <div className="space-y-3">
            {verified.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{p.business_name}</p>
                  <p className="text-xs text-slate-500">
                    {CATEGORY_LABELS[p.category]?.th} · ⭐ {Number(p.rating).toFixed(1)}
                  </p>
                </div>
                <span className="text-xs text-green-700">✅ Verified</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'alerts' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateAlert} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">สร้างแจ้งเตือนภัยใหม่</h3>
              <input
                type="text"
                placeholder="หัวข้อ"
                value={newAlert.title}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                required
                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="หมวดหมู่"
                value={newAlert.category}
                onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                placeholder="รายละเอียด"
                value={newAlert.description}
                onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                required
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="mt-3 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white"
              >
                สร้าง (draft)
              </button>
            </form>

            <ul className="space-y-3">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-500">{alert.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePublish(alert.id, !alert.is_published)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      alert.is_published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {alert.is_published ? 'Published' : 'Publish'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
