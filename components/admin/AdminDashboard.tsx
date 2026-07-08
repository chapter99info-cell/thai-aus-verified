'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatDateDDMMYYYY } from '@/lib/utils'
import type { Profile, Review, ServiceProvider } from '@/types'

type ProviderRow = ServiceProvider & {
  providers: Pick<Profile, 'email' | 'business_name' | 'phone'> | null
}

type ReportRow = Review & {
  reviewer: Pick<Profile, 'full_name' | 'email'> | null
}

export interface AdminDashboardData {
  stats: {
    totalProfiles: number
    pendingVerification: number
    activeSubscribers: number
    openReports: number
  }
  pending: ProviderRow[]
  reports: ReportRow[]
  subscribers: ProviderRow[]
}

export function AdminDashboard({ initialData }: { initialData: AdminDashboardData }) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function refreshPage() {
    router.refresh()
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  async function handleVerification(providerId: string, action: 'approve' | 'reject') {
    setBusyId(providerId)
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_id: providerId, action }),
    })
    setBusyId(null)

    if (res.ok) {
      setData((prev) => ({
        ...prev,
        pending: prev.pending.filter((p) => p.id !== providerId),
        stats: {
          ...prev.stats,
          pendingVerification: Math.max(0, prev.stats.pendingVerification - 1),
        },
      }))
      await refreshPage()
    }
  }

  async function handleReport(reviewId: string, action: 'strike' | 'dismiss') {
    setBusyId(reviewId)
    const res = await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: reviewId, action }),
    })
    setBusyId(null)

    if (res.ok) {
      setData((prev) => ({
        ...prev,
        reports: prev.reports.filter((r) => r.id !== reviewId),
        stats: {
          ...prev.stats,
          openReports: Math.max(0, prev.stats.openReports - 1),
        },
      }))
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <header className="border-b border-[#C9A84C]/20 bg-[#0D1B3E]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-xl font-bold text-[#C9A84C]">Admin Dashboard</h1>
            <p className="text-sm text-white/60">Thai-Aus Verified Community</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#C9A84C]/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#C9A84C]/10"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total profiles', value: data.stats.totalProfiles },
            { label: 'Pending verification', value: data.stats.pendingVerification },
            { label: 'Active subscribers', value: data.stats.activeSubscribers },
            { label: 'Open reports', value: data.stats.openReports },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-[#243B6E]/70">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-[#C9A84C]">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0D1B3E]">Pending verification</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[#243B6E]/70">
                  <th className="px-3 py-2 font-semibold">Business</th>
                  <th className="px-3 py-2 font-semibold">Category</th>
                  <th className="px-3 py-2 font-semibold">Contact</th>
                  <th className="px-3 py-2 font-semibold">Submitted</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.pending.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-[#243B6E]/50">
                      ไม่มีรายการรอตรวจสอบ
                    </td>
                  </tr>
                ) : (
                  data.pending.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50">
                      <td className="px-3 py-3 font-medium text-[#0D1B3E]">
                        {row.business_name}
                      </td>
                      <td className="px-3 py-3 text-[#243B6E]">
                        {CATEGORY_LABELS[row.category]?.th ?? row.category}
                      </td>
                      <td className="px-3 py-3 text-[#243B6E]">
                        {row.providers?.email ?? '—'}
                      </td>
                      <td className="px-3 py-3 text-[#243B6E]">
                        {formatDateDDMMYYYY(row.created_at)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => handleVerification(row.id, 'approve')}
                            className="rounded-lg bg-[#C9A84C] px-3 py-1.5 text-xs font-bold text-[#0D1B3E] hover:bg-[#D4A017] disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => handleVerification(row.id, 'reject')}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0D1B3E]">Reports</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[#243B6E]/70">
                  <th className="px-3 py-2 font-semibold">Reviewer</th>
                  <th className="px-3 py-2 font-semibold">Rating</th>
                  <th className="px-3 py-2 font-semibold">Comment</th>
                  <th className="px-3 py-2 font-semibold">Reports</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-[#243B6E]/50">
                      ไม่มีรายงานที่เปิดอยู่
                    </td>
                  </tr>
                ) : (
                  data.reports.map((review) => (
                    <tr key={review.id} className="border-b border-gray-50">
                      <td className="px-3 py-3 text-[#0D1B3E]">
                        {review.reviewer?.full_name ?? review.reviewer?.email ?? '—'}
                      </td>
                      <td className="px-3 py-3 text-[#243B6E]">{review.rating}★</td>
                      <td className="max-w-xs truncate px-3 py-3 text-[#243B6E]">
                        {review.comment}
                      </td>
                      <td className="px-3 py-3 font-semibold text-[#C9A84C]">
                        {review.report_count ?? 0}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busyId === review.id}
                            onClick={() => handleReport(review.id, 'strike')}
                            className="rounded-lg bg-[#0D1B3E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#243B6E] disabled:opacity-50"
                          >
                            Strike
                          </button>
                          <button
                            type="button"
                            disabled={busyId === review.id}
                            onClick={() => handleReport(review.id, 'dismiss')}
                            className="rounded-lg border border-[#C9A84C] px-3 py-1.5 text-xs font-semibold text-[#8B6914] hover:bg-[#C9A84C]/10 disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0D1B3E]">Subscribers</h2>
          <p className="mt-1 text-sm text-[#243B6E]/60">Premium members (read-only)</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[#243B6E]/70">
                  <th className="px-3 py-2 font-semibold">Business</th>
                  <th className="px-3 py-2 font-semibold">Email</th>
                  <th className="px-3 py-2 font-semibold">State</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-[#243B6E]/50">
                      ยังไม่มีสมาชิก Premium
                    </td>
                  </tr>
                ) : (
                  data.subscribers.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50">
                      <td className="px-3 py-3 font-medium text-[#0D1B3E]">
                        {row.business_name}
                      </td>
                      <td className="px-3 py-3 text-[#243B6E]">{row.providers?.email ?? '—'}</td>
                      <td className="px-3 py-3 text-[#243B6E]">{row.state ?? '—'}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[#C9A84C]/10 px-2 py-0.5 text-xs font-semibold text-[#8B6914]">
                          {row.subscription_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
