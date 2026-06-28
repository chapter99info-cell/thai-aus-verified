'use client'

import { useCallback, useEffect, useState } from 'react'
import { CATEGORY_LABELS } from '@/lib/constants'
import { slugifyTitle } from '@/lib/articles'
import {
  getAlertTypeBadgeClass,
  getAlertTypeLabel,
  getSeverityMeta,
  SCAM_ALERT_SEVERITIES,
  SCAM_ALERT_STATES,
  SCAM_ALERT_TYPES,
  type ScamAlertSeverity,
  type ScamAlertType,
} from '@/lib/scam-alerts'
import { createClient } from '@/lib/supabase/client'
import { formatDateDDMMYYYY } from '@/lib/utils'
import type { Article } from '@/types/articles'
import type { ScamAlert, ServiceProvider } from '@/types'

type Tab = 'pending' | 'verified' | 'alerts' | 'articles'

const ARTICLE_CATEGORIES = [
  { value: 'legal', label: '⚖️ กฎหมาย' },
  { value: 'tax', label: '💰 ภาษี' },
  { value: 'insurance', label: '🛡️ ประกัน' },
]

const TARGET_OCCUPATIONS = [
  { value: 'all', label: 'ทุกอาชีพ' },
  { value: 'massage', label: 'ร้านนวด' },
  { value: 'restaurant', label: 'ร้านอาหาร' },
  { value: 'photographer', label: 'ช่างภาพ' },
  { value: 'tradie', label: 'ช่าง / Tradie' },
]

const emptyArticleForm = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: 'legal',
  tags: '',
  target_occupation: 'all',
}

const emptyAlertForm = {
  title: '',
  alert_type: 'other' as ScamAlertType,
  description: '',
  state: 'ไม่ระบุ',
  severity: 'warning' as ScamAlertSeverity,
  evidence_url: '',
  is_published: true,
}

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('pending')
  const [pending, setPending] = useState<ServiceProvider[]>([])
  const [verified, setVerified] = useState<ServiceProvider[]>([])
  const [alerts, setAlerts] = useState<ScamAlert[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [alertForm, setAlertForm] = useState(emptyAlertForm)
  const [alertSaving, setAlertSaving] = useState(false)
  const [alertToast, setAlertToast] = useState('')
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [articleForm, setArticleForm] = useState(emptyArticleForm)
  const [articleSaving, setArticleSaving] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()

    const [pendingRes, verifiedRes, alertsRes, articlesRes] = await Promise.all([
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
      supabase.from('articles').select('*').order('created_at', { ascending: false }),
    ])

    setPending((pendingRes.data ?? []) as ServiceProvider[])
    setVerified((verifiedRes.data ?? []) as ServiceProvider[])
    setAlerts((alertsRes.data ?? []) as ScamAlert[])
    setArticles((articlesRes.data ?? []) as Article[])
    setLoading(false)
  }, [])

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
    setAlertSaving(true)

    const res = await fetch('/api/admin/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertForm),
    })

    setAlertSaving(false)

    if (res.ok) {
      setAlertForm(emptyAlertForm)
      setShowAlertForm(false)
      setAlertToast('✅ เผยแพร่ Scam Alert แล้ว')
      window.setTimeout(() => setAlertToast(''), 3000)
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

  async function handleDeleteAlert(id: string, title: string) {
    if (!window.confirm(`ลบ Scam Alert "${title}" ใช่หรือไม่?`)) return

    const res = await fetch(`/api/admin/alerts?id=${id}`, { method: 'DELETE' })
    if (res.ok) loadData()
  }

  async function handleCreateArticle(e: React.FormEvent) {
    e.preventDefault()
    setArticleSaving(true)

    const tags = articleForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...articleForm,
        tags,
        is_published: false,
      }),
    })

    setArticleSaving(false)

    if (res.ok) {
      setArticleForm(emptyArticleForm)
      setShowArticleModal(false)
      loadData()
    }
  }

  async function toggleArticlePublish(id: string, is_published: boolean) {
    await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_published }),
    })
    loadData()
  }

  function handleArticleTitleChange(title: string) {
    setArticleForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || slugifyTitle(title),
    }))
  }

  if (loading) {
    return <p className="text-slate-600">กำลังโหลด...</p>
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: `รอการอนุมัติ (${pending.length})` },
    { id: 'verified', label: `ธุรกิจที่ยืนยันแล้ว (${verified.length})` },
    { id: 'alerts', label: 'จัดการ Scam Alerts' },
    { id: 'articles', label: 'จัดการบทความ' },
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
                    {CATEGORY_LABELS[p.category]?.th} · ABN: {p.abn_number} · {p.state}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    ลงทะเบียน: {formatDateDDMMYYYY(p.created_at)}
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
            {verified.length === 0 ? (
              <p className="text-slate-500">ยังไม่มีธุรกิจที่ยืนยันแล้ว</p>
            ) : (
              verified.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{p.business_name}</p>
                    <p className="text-xs text-slate-500">
                      {CATEGORY_LABELS[p.category]?.th} · ⭐ {Number(p.rating).toFixed(1)} (
                      {p.review_count} รีวิว)
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatDateDDMMYYYY(p.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'alerts' && (
          <div className="space-y-6">
            {alertToast && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                {alertToast}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Scam Alerts ทั้งหมด {alerts.length} รายการ
              </p>
              <button
                type="button"
                onClick={() => setShowAlertForm((v) => !v)}
                className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d5282]"
              >
                {showAlertForm ? 'ปิดฟอร์ม' : 'แจ้งเตือนภัยใหม่'}
              </button>
            </div>

            {showAlertForm && (
              <form
                onSubmit={handleCreateAlert}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">สร้าง Scam Alert ใหม่</h3>

                <label className="mt-4 block text-sm font-medium text-slate-700">
                  ชื่อธุรกิจ/บุคคล *
                </label>
                <input
                  type="text"
                  placeholder="เช่น ร้าน XYZ หรือ นาย ABC"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />

                <label className="mt-4 block text-sm font-medium text-slate-700">
                  ประเภทการโกง *
                </label>
                <select
                  value={alertForm.alert_type}
                  onChange={(e) =>
                    setAlertForm({ ...alertForm, alert_type: e.target.value as ScamAlertType })
                  }
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {SCAM_ALERT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <label className="mt-4 block text-sm font-medium text-slate-700">
                  รายละเอียด *
                </label>
                <textarea
                  placeholder="อธิบายสิ่งที่เกิดขึ้น วันที่ สถานที่..."
                  value={alertForm.description}
                  onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
                  required
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />

                <label className="mt-4 block text-sm font-medium text-slate-700">
                  รัฐที่เกิดเหตุ
                </label>
                <select
                  value={alertForm.state}
                  onChange={(e) => setAlertForm({ ...alertForm, state: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {SCAM_ALERT_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                <fieldset className="mt-4">
                  <legend className="text-sm font-medium text-slate-700">ระดับความรุนแรง</legend>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {SCAM_ALERT_SEVERITIES.map((sev) => (
                      <label key={sev.value} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="severity"
                          value={sev.value}
                          checked={alertForm.severity === sev.value}
                          onChange={() => setAlertForm({ ...alertForm, severity: sev.value })}
                          className="accent-[#1e3a5f]"
                        />
                        {sev.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="mt-4 block text-sm font-medium text-slate-700">
                  หลักฐาน URL (ไม่บังคับ)
                </label>
                <input
                  type="url"
                  placeholder="ลิงก์ screenshot หรือหลักฐาน (ถ้ามี)"
                  value={alertForm.evidence_url}
                  onChange={(e) => setAlertForm({ ...alertForm, evidence_url: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />

                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={alertForm.is_published}
                    onChange={(e) =>
                      setAlertForm({ ...alertForm, is_published: e.target.checked })
                    }
                    className="rounded accent-[#1e3a5f]"
                  />
                  เผยแพร่ทันที
                </label>

                <button
                  type="submit"
                  disabled={alertSaving}
                  className="mt-6 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5282] disabled:opacity-50"
                >
                  {alertSaving ? 'กำลังบันทึก...' : 'เผยแพร่ Scam Alert'}
                </button>
              </form>
            )}

            <div className="space-y-4">
              {alerts.length === 0 ? (
                <p className="text-slate-500">ยังไม่มี Scam Alert</p>
              ) : (
                alerts.map((alert) => {
                  const severity = getSeverityMeta(alert.severity)
                  const typeKey = alert.alert_type ?? 'other'

                  return (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getAlertTypeBadgeClass(typeKey)}`}
                            >
                              {getAlertTypeLabel(typeKey)}
                            </span>
                            {alert.state && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                {alert.state}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                              <span className={`h-2.5 w-2.5 rounded-full ${severity.dotClass}`} />
                              {severity.label.replace(/^🟡 |^🟠 |^🔴 /, '')}
                            </span>
                          </div>
                          <h4 className="mt-3 font-bold text-slate-900">{alert.title}</h4>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                            {alert.description}
                          </p>
                          {alert.evidence_url && (
                            <a
                              href={alert.evidence_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-xs text-[#1e3a5f] hover:underline"
                            >
                              ดูหลักฐาน →
                            </a>
                          )}
                          <p className="mt-2 text-xs text-slate-400">
                            {formatDateDDMMYYYY(alert.created_at)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => togglePublish(alert.id, !alert.is_published)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              alert.is_published
                                ? 'bg-green-50 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {alert.is_published ? 'Published' : 'Draft'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAlert(alert.id, alert.title)}
                            className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {tab === 'articles' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                บทความทั้งหมด {articles.length} รายการ (เผยแพร่ {articles.filter((a) => a.is_published).length})
              </p>
              <button
                type="button"
                onClick={() => setShowArticleModal(true)}
                className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d5282]"
              >
                เพิ่มบทความใหม่
              </button>
            </div>

            <ul className="space-y-3">
              {articles.length === 0 ? (
                <li className="text-slate-500">ยังไม่มีบทความ — รัน migration 005 ใน Supabase หรือเพิ่มบทความใหม่</li>
              ) : (
                articles.map((article) => (
                  <li
                    key={article.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{article.title}</p>
                      <p className="text-xs text-slate-500">
                        {article.category} · /articles/{article.slug} ·{' '}
                        {formatDateDDMMYYYY(article.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1e3a5f] hover:underline"
                      >
                        ดู
                      </a>
                      <button
                        type="button"
                        onClick={() => toggleArticlePublish(article.id, !article.is_published)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          article.is_published
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {article.is_published ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>

            {showArticleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <form
                  onSubmit={handleCreateArticle}
                  className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">เพิ่มบทความใหม่</h3>
                    <button
                      type="button"
                      onClick={() => setShowArticleModal(false)}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">หัวข้อ</label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => handleArticleTitleChange(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />

                  <label className="mt-3 block text-sm font-medium text-slate-700">Slug (URL)</label>
                  <input
                    type="text"
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />

                  <label className="mt-3 block text-sm font-medium text-slate-700">สรุป</label>
                  <textarea
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                    required
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />

                  <label className="mt-3 block text-sm font-medium text-slate-700">เนื้อหา</label>
                  <textarea
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    required
                    rows={8}
                    placeholder="ใช้ **หัวข้อ** และ - รายการ"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                  />

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">หมวดหมู่</label>
                      <select
                        value={articleForm.category}
                        onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        {ARTICLE_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">กลุ่มเป้าหมาย</label>
                      <select
                        value={articleForm.target_occupation}
                        onChange={(e) =>
                          setArticleForm({ ...articleForm, target_occupation: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        {TARGET_OCCUPATIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="mt-3 block text-sm font-medium text-slate-700">
                    Tags (คั่นด้วย comma)
                  </label>
                  <input
                    type="text"
                    value={articleForm.tags}
                    onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                    placeholder="ABN, ภาษี, เริ่มต้นธุรกิจ"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />

                  <div className="mt-6 flex gap-2">
                    <button
                      type="submit"
                      disabled={articleSaving}
                      className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d5282] disabled:opacity-50"
                    >
                      {articleSaving ? 'กำลังบันทึก...' : 'บันทึกเป็น Draft'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowArticleModal(false)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
