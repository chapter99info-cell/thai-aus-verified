'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Check,
  Mail,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { InterviewAdminTab } from '@/components/admin/InterviewAdminTab'
import { CATEGORY_LABELS } from '@/lib/constants'
import { slugifyTitle } from '@/lib/articles'
import {
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
import type { Profile, ScamAlert, ServiceProvider } from '@/types'

type AdminTab = 'pending' | 'verified' | 'alerts' | 'members' | 'premium' | 'articles' | 'sales' | 'interviews'

type ProviderRow = ServiceProvider & {
  profiles: Pick<Profile, 'email' | 'full_name' | 'phone'> | null
}

const CATEGORY_FILTERS = [
  { key: 'massage', label: 'นวดแผนไทย', dot: 'bg-[#1e3a5f]' },
  { key: 'restaurant', label: 'ร้านอาหาร', dot: 'bg-blue-500' },
  { key: 'photography', label: 'ช่างภาพ', dot: 'bg-[#c9a84c]' },
  { key: 'accommodation', label: 'อสังหาริมทรัพย์', dot: 'bg-purple-500' },
] as const

const emptyAlertForm = {
  title: '',
  alert_type: 'other' as ScamAlertType,
  description: '',
  state: 'ไม่ระบุ',
  severity: 'warning' as ScamAlertSeverity,
  evidence_url: '',
  is_published: true,
}

const emptyArticleForm = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: 'legal',
  is_published: false,
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function buildSalesOfferMailto(businessName: string) {
  const subject = encodeURIComponent(`สนใจทำเว็บไซต์ - ${businessName}`)
  const body = encodeURIComponent(
    `สวัสดีครับ ${businessName} สนใจให้เราช่วยทำเว็บไซต์ไหมครับ?`
  )
  return `mailto:chapter99solutions@gmail.com?subject=${subject}&body=${body}`
}

function isSalesLead(provider: ServiceProvider) {
  const noWebsite = !provider.website?.trim()
  const noFacebook = !provider.facebook_url?.trim()
  return noWebsite && noFacebook
}

export function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('pending')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [pending, setPending] = useState<ProviderRow[]>([])
  const [verified, setVerified] = useState<ProviderRow[]>([])
  const [alerts, setAlerts] = useState<ScamAlert[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [members, setMembers] = useState<Profile[]>([])
  const [premium, setPremium] = useState<ProviderRow[]>([])
  const [salesLeads, setSalesLeads] = useState<ProviderRow[]>([])
  const [interviewCount, setInterviewCount] = useState(0)

  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isNewArticle, setIsNewArticle] = useState(false)
  const [isNewAlert, setIsNewAlert] = useState(false)

  const [alertForm, setAlertForm] = useState(emptyAlertForm)
  const [articleForm, setArticleForm] = useState(emptyArticleForm)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()

    const [pendingRes, verifiedRes, articlesRes, membersRes, premiumRes, salesRes, alertsApiRes, interviewsRes] =
      await Promise.all([
        supabase
          .from('service_providers')
          .select('*, profiles:profile_id(email, full_name, phone)')
          .eq('verification_status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('service_providers')
          .select('*, profiles:profile_id(email, full_name, phone)')
          .eq('is_verified', true)
          .order('created_at', { ascending: false }),
        supabase.from('articles').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase
          .from('service_providers')
          .select('*, profiles:profile_id(email, full_name, phone)')
          .eq('subscription_status', 'premium')
          .order('created_at', { ascending: false }),
        supabase
          .from('service_providers')
          .select('*, profiles:profile_id(email, full_name, phone)')
          .order('created_at', { ascending: false }),
        fetch('/api/admin/alerts'),
        supabase.from('interview_sessions').select('id', { count: 'exact', head: true }),
      ])

    const allProviders = (salesRes.data ?? []) as ProviderRow[]
    setSalesLeads(allProviders.filter(isSalesLead))

    setPending((pendingRes.data ?? []) as ProviderRow[])
    setVerified((verifiedRes.data ?? []) as ProviderRow[])
    setArticles((articlesRes.data ?? []) as Article[])
    setMembers((membersRes.data ?? []) as Profile[])
    setPremium((premiumRes.data ?? []) as ProviderRow[])

    if (alertsApiRes.ok) {
      const alertsData = (await alertsApiRes.json()) as ScamAlert[]
      setAlerts(Array.isArray(alertsData) ? alertsData : [])
    } else {
      setAlerts([])
    }
    setInterviewCount(interviewsRes.count ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const counts = useMemo(
    () => ({
      pending: pending.length,
      verified: verified.length,
      alerts: alerts.length,
      members: members.length,
      premium: premium.length,
      articles: articles.length,
      sales: salesLeads.length,
      interviews: interviewCount,
    }),
    [pending, verified, alerts, members, premium, articles, salesLeads, interviewCount]
  )

  const navItems: { id: AdminTab; icon: string; label: string; count: number }[] = [
    { id: 'pending', icon: '📥', label: 'รอการอนุมัติ', count: counts.pending },
    { id: 'verified', icon: '✅', label: 'ยืนยันแล้ว', count: counts.verified },
    { id: 'sales', icon: '💼', label: 'โอกาสขาย', count: counts.sales },
    { id: 'alerts', icon: '⚠️', label: 'Scam Alerts', count: counts.alerts },
    { id: 'members', icon: '👥', label: 'สมาชิก', count: counts.members },
    { id: 'premium', icon: '💎', label: 'Premium', count: counts.premium },
    { id: 'articles', icon: '📝', label: 'บทความ', count: counts.articles },
    { id: 'interviews', icon: '🎙️', label: 'สัมภาษณ์ธุรกิจ', count: counts.interviews },
  ]

  function switchTab(next: AdminTab) {
    setTab(next)
    setSelectedProviderId(null)
    setSelectedAlertId(null)
    setSelectedArticleId(null)
    setSelectedMemberId(null)
    setIsNewArticle(false)
    setIsNewAlert(false)
    setSearch('')
  }

  function filterProviders(list: ProviderRow[]) {
    return list.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.business_name.toLowerCase().includes(q) ||
        p.abn_number.includes(q) ||
        p.profiles?.full_name?.toLowerCase().includes(q) ||
        p.profiles?.email?.toLowerCase().includes(q)
      const matchCat = !categoryFilter || p.category === categoryFilter
      return matchSearch && matchCat
    })
  }

  const filteredPending = useMemo(() => filterProviders(pending), [pending, search, categoryFilter])
  const filteredVerified = useMemo(() => filterProviders(verified), [verified, search, categoryFilter])
  const filteredPremium = useMemo(() => filterProviders(premium), [premium, search, categoryFilter])

  const filteredAlerts = useMemo(() => {
    const q = search.toLowerCase()
    return alerts.filter(
      (a) =>
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    )
  }, [alerts, search])

  const filteredArticles = useMemo(() => {
    const q = search.toLowerCase()
    return articles.filter(
      (a) => !q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    )
  }, [articles, search])

  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase()
    return members.filter(
      (m) =>
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    )
  }, [members, search])

  const filteredSalesLeads = useMemo(() => {
    const q = search.toLowerCase()
    return salesLeads.filter((p) => {
      const matchSearch =
        !q ||
        p.business_name.toLowerCase().includes(q) ||
        p.abn_number.includes(q) ||
        p.suburb.toLowerCase().includes(q) ||
        p.profiles?.email?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
      const matchCat = !categoryFilter || p.category === categoryFilter
      return matchSearch && matchCat
    })
  }, [salesLeads, search, categoryFilter])

  const selectedProvider = useMemo(() => {
    const all = [...pending, ...verified, ...premium]
    return all.find((p) => p.id === selectedProviderId) ?? null
  }, [selectedProviderId, pending, verified, premium])

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) ?? null
  const selectedArticle = articles.find((a) => a.id === selectedArticleId) ?? null
  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null

  async function handleApprove(providerId: string, action: 'approve' | 'reject') {
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_id: providerId, action }),
    })
    if (res.ok) {
      setSelectedProviderId(null)
      loadData()
    }
  }

  async function toggleAlertPublish(id: string, is_published: boolean) {
    await fetch('/api/admin/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_published }),
    })
    loadData()
  }

  async function handleDeleteAlert(id: string) {
    if (!window.confirm('ลบ Scam Alert นี้?')) return
    await fetch(`/api/admin/alerts?id=${id}`, { method: 'DELETE' })
    setSelectedAlertId(null)
    loadData()
  }

  async function handleSaveAlert(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: alertForm.title,
        description: alertForm.description,
        category: getAlertTypeLabel(alertForm.alert_type),
        alert_type: alertForm.alert_type,
        severity: alertForm.severity,
        evidence_url: alertForm.evidence_url || null,
        state: alertForm.state,
        is_published: alertForm.is_published,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setIsNewAlert(false)
      setAlertForm(emptyAlertForm)
      loadData()
    }
  }

  async function handleSaveArticle(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    if (isNewArticle || !selectedArticleId) {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...articleForm, tags: [] }),
      })
      setSaving(false)
      if (res.ok) {
        setIsNewArticle(false)
        setArticleForm(emptyArticleForm)
        loadData()
      }
      return
    }

    await fetch('/api/admin/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedArticleId, ...articleForm }),
    })
    setSaving(false)
    loadData()
  }

  function openArticle(article: Article) {
    setIsNewArticle(false)
    setSelectedArticleId(article.id)
    setArticleForm({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      category: article.category,
      is_published: article.is_published,
    })
  }

  function startNewArticle() {
    setIsNewArticle(true)
    setSelectedArticleId(null)
    setArticleForm(emptyArticleForm)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] text-[#1e3a5f]">
        กำลังโหลด...
      </div>
    )
  }

  return (
    <div
      className="grid min-h-screen bg-[#f8f9fc]"
      style={{ gridTemplateColumns: tab === 'sales' || tab === 'interviews' ? '200px 1fr' : '200px 1fr 1.2fr' }}
    >
      {/* Sidebar */}
      <aside className="flex flex-col border-r border-[rgba(30,58,95,0.08)] bg-[#f8f9fc] p-3">
        <button
          type="button"
          onClick={() => switchTab('pending')}
          className="flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#1e3a5f] py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(30,58,95,0.06)]"
        >
          <Sparkles size={14} />
          อนุมัติธุรกิจ
        </button>

        <nav className="mt-4 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTab(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                tab === item.id
                  ? 'bg-[rgba(30,58,95,0.08)] font-semibold text-[#1e3a5f]'
                  : 'text-[rgba(30,58,95,0.55)] hover:bg-[rgba(30,58,95,0.04)]'
              }`}
            >
              <span>
                {item.icon} {item.label}
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  tab === item.id && item.id === 'pending'
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-[rgba(30,58,95,0.08)] text-[#1e3a5f]'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-6">
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-[rgba(30,58,95,0.35)]">
            หมวดหมู่
          </p>
          <div className="mt-2 space-y-1">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() =>
                  setCategoryFilter((c) => (c === cat.key ? null : cat.key))
                }
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                  categoryFilter === cat.key
                    ? 'bg-[rgba(30,58,95,0.08)] text-[#1e3a5f]'
                    : 'text-[rgba(30,58,95,0.55)] hover:bg-[rgba(30,58,95,0.04)]'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${cat.dot}`} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {tab === 'interviews' ? (
        <InterviewAdminTab />
      ) : tab === 'sales' ? (
        <section className="overflow-auto bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#1e3a5f]">โอกาสขาย — ไม่มีเว็บไซต์ / Facebook</h2>
              <p className="mt-1 text-sm text-[rgba(30,58,95,0.55)]">
                พบ {filteredSalesLeads.length} ธุรกิจที่ยังไม่มี website และ facebook_url
              </p>
            </div>
            <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(30,58,95,0.35)]"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาธุรกิจ..."
                className="w-full rounded-xl bg-[rgba(30,58,95,0.05)] py-2.5 pl-9 pr-3 text-sm text-[#1e3a5f] placeholder:text-[rgba(30,58,95,0.35)] outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[rgba(30,58,95,0.08)]">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="bg-[#f8f9fc] text-xs font-bold uppercase tracking-wide text-[rgba(30,58,95,0.55)]">
                <tr>
                  <th className="px-4 py-3">ชื่อธุรกิจ</th>
                  <th className="px-4 py-3">ประเภท</th>
                  <th className="px-4 py-3">Suburb</th>
                  <th className="px-4 py-3">ABN</th>
                  <th className="px-4 py-3">ติดต่อ</th>
                  <th className="px-4 py-3">สถานะ</th>
                  <th className="px-4 py-3">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[rgba(30,58,95,0.45)]">
                      ไม่พบโอกาสขายในหมวดนี้
                    </td>
                  </tr>
                ) : (
                  filteredSalesLeads.map((lead) => {
                    const cat = CATEGORY_LABELS[lead.category]
                    const contactEmail = lead.profiles?.email
                    const contactPhone = lead.phone || lead.profiles?.phone
                    const contactParts = [contactPhone, contactEmail].filter(Boolean)

                    return (
                      <tr
                        key={lead.id}
                        className="border-t border-[rgba(30,58,95,0.08)] hover:bg-[#f8f9fc]"
                      >
                        <td className="px-4 py-3 font-semibold text-[#1e3a5f]">
                          {lead.business_name}
                        </td>
                        <td className="px-4 py-3 text-[rgba(30,58,95,0.7)]">
                          {cat?.th ?? lead.category}
                        </td>
                        <td className="px-4 py-3 text-[rgba(30,58,95,0.7)]">
                          {lead.suburb}, {lead.state}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[rgba(30,58,95,0.7)]">
                          {lead.abn_number}
                        </td>
                        <td className="px-4 py-3 text-xs text-[rgba(30,58,95,0.7)]">
                          {contactParts.length > 0 ? contactParts.join(' · ') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
                            ไม่มีเว็บไซต์
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={buildSalesOfferMailto(lead.business_name)}
                            className="inline-flex rounded-lg bg-[#1e3a5f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2d5282]"
                          >
                            ส่ง offer
                          </a>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <>
      {/* List panel */}
      <section className="flex flex-col border-r border-[rgba(30,58,95,0.08)] bg-white">
        <div className="border-b border-[rgba(30,58,95,0.08)] p-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(30,58,95,0.35)]"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาธุรกิจ..."
              className="w-full rounded-xl bg-[rgba(30,58,95,0.05)] py-2.5 pl-9 pr-3 text-sm text-[#1e3a5f] placeholder:text-[rgba(30,58,95,0.35)] outline-none"
            />
          </div>
          {tab === 'articles' && (
            <button
              type="button"
              onClick={startNewArticle}
              className="mt-2 w-full rounded-[10px] border border-[rgba(30,58,95,0.12)] py-2 text-sm font-semibold text-[#1e3a5f] hover:bg-[#f8f9fc]"
            >
              + เพิ่มบทความใหม่
            </button>
          )}
          {tab === 'alerts' && (
            <button
              type="button"
              onClick={() => {
                setIsNewAlert(true)
                setSelectedAlertId(null)
                setAlertForm(emptyAlertForm)
              }}
              className="mt-2 w-full rounded-[10px] border border-[rgba(30,58,95,0.12)] py-2 text-sm font-semibold text-[#1e3a5f] hover:bg-[#f8f9fc]"
            >
              + แจ้งเตือนภัยใหม่
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {(tab === 'pending' || tab === 'verified' || tab === 'premium') &&
            (tab === 'pending' ? filteredPending : tab === 'verified' ? filteredVerified : filteredPremium).map(
              (p) => {
                const isActive = selectedProviderId === p.id
                const isUnread = p.verification_status === 'pending'
                const cat = CATEGORY_LABELS[p.category]

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProviderId(p.id)
                      setSelectedAlertId(null)
                      setSelectedArticleId(null)
                      setSelectedMemberId(null)
                    }}
                    className={`w-full border-b border-[rgba(30,58,95,0.08)] px-4 py-3 text-left transition-colors ${
                      isActive ? 'bg-[#edf2fa]' : 'hover:bg-[#f8f9fc]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate ${isUnread ? 'font-bold text-[#1e3a5f]' : 'font-medium text-[#1e3a5f]'}`}
                      >
                        {isUnread && (
                          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        {p.business_name}
                      </span>
                      <span className="shrink-0 text-[11px] text-[rgba(30,58,95,0.4)]">
                        {formatTime(p.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[rgba(30,58,95,0.6)]">
                      ABN {p.abn_number} · {p.state}
                    </p>
                    <p className="mt-0.5 text-xs text-[rgba(30,58,95,0.4)]">
                      {cat?.th ?? p.category} · {p.verification_status}
                    </p>
                  </button>
                )
              }
            )}

          {tab === 'alerts' &&
            filteredAlerts.map((alert) => {
              const severity = getSeverityMeta(alert.severity)

              return (
                <div
                  key={alert.id}
                  className={`border-b border-[rgba(30,58,95,0.08)] ${
                    selectedAlertId === alert.id ? 'bg-[#edf2fa]' : 'hover:bg-[#f8f9fc]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAlertId(alert.id)
                      setIsNewAlert(false)
                      setSelectedProviderId(null)
                    }}
                    className="w-full px-4 py-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[#1e3a5f]">{alert.title}</h4>
                      <time className="shrink-0 text-[11px] text-[rgba(30,58,95,0.4)]">
                        {formatDateDDMMYYYY(alert.created_at)}
                      </time>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[rgba(30,58,95,0.6)]">
                      {alert.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${severity.badgeClass}`}
                      >
                        {severity.label.replace(/^🟡 |^🟠 |^🔴 /, '')}
                      </span>
                      {alert.state && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                          {alert.state}
                        </span>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center justify-between px-4 pb-3">
                    <span className="text-[11px] text-[rgba(30,58,95,0.4)]">
                      {alert.category || getAlertTypeLabel(alert.alert_type)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAlertPublish(alert.id, !alert.is_published)
                      }}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        alert.is_published
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {alert.is_published ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>
              )
            })}

          {tab === 'articles' &&
            filteredArticles.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => openArticle(article)}
                className={`w-full border-b border-[rgba(30,58,95,0.08)] px-4 py-3 text-left transition-colors ${
                  selectedArticleId === article.id ? 'bg-[#edf2fa]' : 'hover:bg-[#f8f9fc]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-[#1e3a5f]">{article.title}</span>
                  <span className="shrink-0 text-[11px] text-[rgba(30,58,95,0.4)]">
                    {formatTime(article.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[rgba(30,58,95,0.6)]">{article.category}</p>
                <p className="mt-0.5 text-xs text-[rgba(30,58,95,0.4)]">
                  {article.is_published ? 'Published' : 'Draft'}
                </p>
              </button>
            ))}

          {tab === 'members' &&
            filteredMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  setSelectedMemberId(member.id)
                  setSelectedProviderId(null)
                }}
                className={`w-full border-b border-[rgba(30,58,95,0.08)] px-4 py-3 text-left transition-colors ${
                  selectedMemberId === member.id ? 'bg-[#edf2fa]' : 'hover:bg-[#f8f9fc]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-[#1e3a5f]">{member.full_name}</span>
                  <span className="shrink-0 text-[11px] text-[rgba(30,58,95,0.4)]">
                    {formatTime(member.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[rgba(30,58,95,0.6)]">{member.email}</p>
                <p className="mt-0.5 text-xs text-[rgba(30,58,95,0.4)]">{member.role}</p>
              </button>
            ))}
        </div>
      </section>

      {/* Reader panel */}
      <section className="flex flex-col overflow-y-auto bg-white">
        {/* Business reader */}
        {selectedProvider && (tab === 'pending' || tab === 'verified' || tab === 'premium') && (
          <ProviderReader
            provider={selectedProvider}
            onApprove={() => handleApprove(selectedProvider.id, 'approve')}
            onReject={() => handleApprove(selectedProvider.id, 'reject')}
          />
        )}

        {/* Scam alert reader / create */}
        {(selectedAlert || isNewAlert) && tab === 'alerts' && (
          <div className="flex flex-col p-5">
            {isNewAlert ? (
              <form onSubmit={handleSaveAlert} className="space-y-4">
                <h2 className="text-lg font-bold text-[#1e3a5f]">แจ้งเตือนภัยใหม่</h2>
                <input
                  required
                  placeholder="ชื่อธุรกิจ/บุคคล"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  className="w-full rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
                />
                <select
                  value={alertForm.alert_type}
                  onChange={(e) =>
                    setAlertForm({ ...alertForm, alert_type: e.target.value as ScamAlertType })
                  }
                  className="w-full rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
                >
                  {SCAM_ALERT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <textarea
                  required
                  rows={4}
                  placeholder="รายละเอียด"
                  value={alertForm.description}
                  onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
                  className="w-full rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
                />
                <select
                  value={alertForm.state}
                  onChange={(e) => setAlertForm({ ...alertForm, state: e.target.value })}
                  className="w-full rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
                >
                  {SCAM_ALERT_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-3">
                  {SCAM_ALERT_SEVERITIES.map((s) => (
                    <label key={s.value} className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        checked={alertForm.severity === s.value}
                        onChange={() => setAlertForm({ ...alertForm, severity: s.value })}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
                <input
                  placeholder="หลักฐาน URL"
                  value={alertForm.evidence_url}
                  onChange={(e) => setAlertForm({ ...alertForm, evidence_url: e.target.value })}
                  className="w-full rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={alertForm.is_published}
                    onChange={(e) => setAlertForm({ ...alertForm, is_published: e.target.checked })}
                  />
                  เผยแพร่ทันที
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-[10px] bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white"
                >
                  {saving ? 'กำลังบันทึก...' : 'เผยแพร่ Scam Alert'}
                </button>
              </form>
            ) : selectedAlert ? (
              <>
                <ReaderToolbar
                  onDelete={() => handleDeleteAlert(selectedAlert.id)}
                  showApprove={false}
                />
                <h2 className="mt-4 text-lg font-bold text-[#1e3a5f]">{selectedAlert.title}</h2>
                <p className="mt-2 text-sm text-[rgba(30,58,95,0.6)]">
                  {getAlertTypeLabel(selectedAlert.alert_type)} · {selectedAlert.state} ·{' '}
                  {getSeverityMeta(selectedAlert.severity).label}
                </p>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[rgba(30,58,95,0.7)]">
                  {selectedAlert.description}
                </p>
                {selectedAlert.evidence_url && (
                  <a
                    href={selectedAlert.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-[#1e3a5f] underline"
                  >
                    ดูหลักฐาน
                  </a>
                )}
                <button
                  type="button"
                  onClick={() =>
                    toggleAlertPublish(selectedAlert.id, !selectedAlert.is_published)
                  }
                  className={`mt-6 w-full rounded-[10px] py-2.5 text-sm font-semibold ${
                    selectedAlert.is_published
                      ? 'border border-[rgba(30,58,95,0.12)] text-[#1e3a5f]'
                      : 'bg-[#1e3a5f] text-white'
                  }`}
                >
                  {selectedAlert.is_published ? 'ยกเลิกการเผยแพร่' : 'เผยแพร่'}
                </button>
              </>
            ) : null}
          </div>
        )}

        {/* Article reader / edit */}
        {(selectedArticle || isNewArticle) && tab === 'articles' && (
          <form onSubmit={handleSaveArticle} className="flex flex-col p-5">
            <h2 className="text-lg font-bold text-[#1e3a5f]">
              {isNewArticle ? 'บทความใหม่' : 'แก้ไขบทความ'}
            </h2>
            <label className="mt-4 text-xs font-medium text-[rgba(30,58,95,0.5)]">หัวข้อ</label>
            <input
              required
              value={articleForm.title}
              onChange={(e) =>
                setArticleForm({
                  ...articleForm,
                  title: e.target.value,
                  slug: isNewArticle ? slugifyTitle(e.target.value) : articleForm.slug,
                })
              }
              className="mt-1 rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
            />
            <label className="mt-3 text-xs font-medium text-[rgba(30,58,95,0.5)]">Slug</label>
            <input
              required
              value={articleForm.slug}
              onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
              className="mt-1 rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
            />
            <label className="mt-3 text-xs font-medium text-[rgba(30,58,95,0.5)]">สรุป</label>
            <textarea
              required
              rows={2}
              value={articleForm.summary}
              onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
              className="mt-1 rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
            />
            <label className="mt-3 text-xs font-medium text-[rgba(30,58,95,0.5)]">เนื้อหา</label>
            <textarea
              required
              rows={10}
              value={articleForm.content}
              onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
              className="mt-1 rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 font-mono text-sm"
            />
            <label className="mt-3 text-xs font-medium text-[rgba(30,58,95,0.5)]">หมวดหมู่</label>
            <select
              value={articleForm.category}
              onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
              className="mt-1 rounded-xl border border-[rgba(30,58,95,0.08)] px-3 py-2 text-sm"
            >
              <option value="legal">กฎหมาย</option>
              <option value="tax">ภาษี</option>
              <option value="insurance">ประกัน</option>
            </select>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={articleForm.is_published}
                onChange={(e) => setArticleForm({ ...articleForm, is_published: e.target.checked })}
              />
              เผยแพร่
            </label>
            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-[10px] bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white"
            >
              {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
            </button>
          </form>
        )}

        {/* Member reader */}
        {selectedMember && tab === 'members' && (
          <div className="p-5">
            <h2 className="text-lg font-bold text-[#1e3a5f]">{selectedMember.full_name}</h2>
            <p className="mt-2 text-sm text-[rgba(30,58,95,0.6)]">{selectedMember.email}</p>
            <p className="mt-1 text-sm text-[rgba(30,58,95,0.6)]">
              บทบาท: {selectedMember.role}
            </p>
            {selectedMember.phone && (
              <p className="mt-1 text-sm text-[rgba(30,58,95,0.6)]">โทร: {selectedMember.phone}</p>
            )}
            <p className="mt-4 text-xs text-[rgba(30,58,95,0.4)]">
              สมัครเมื่อ {formatDateDDMMYYYY(selectedMember.created_at)}
            </p>
            <a
              href={`mailto:${selectedMember.email}`}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white"
            >
              <Mail size={16} />
              ส่งอีเมล
            </a>
          </div>
        )}

        {/* Empty state */}
        {!selectedProvider &&
          !selectedAlert &&
          !isNewAlert &&
          !selectedArticle &&
          !isNewArticle &&
          !selectedMember && (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-[rgba(30,58,95,0.4)]">
              เลือกรายการจากรายการด้านซ้ายเพื่อดูรายละเอียด
            </div>
          )}
      </section>
        </>
      )}
    </div>
  )
}

function ReaderToolbar({
  onApprove,
  onReject,
  onEmail,
  onDelete,
  showApprove = true,
}: {
  onApprove?: () => void
  onReject?: () => void
  onEmail?: () => void
  onDelete?: () => void
  showApprove?: boolean
}) {
  const btnClass =
    'flex h-8 w-8 items-center justify-center rounded-lg text-[#1e3a5f] transition-colors hover:bg-[rgba(30,58,95,0.07)]'

  return (
    <div className="flex gap-1 border-b border-[rgba(30,58,95,0.08)] pb-3">
      {showApprove && onApprove && (
        <button type="button" onClick={onApprove} className={btnClass} title="อนุมัติ">
          <Check size={16} className="text-green-600" />
        </button>
      )}
      {showApprove && onReject && (
        <button type="button" onClick={onReject} className={btnClass} title="ปฏิเสธ">
          <X size={16} className="text-red-600" />
        </button>
      )}
      {onEmail && (
        <button type="button" onClick={onEmail} className={btnClass} title="อีเมล">
          <Mail size={16} />
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} className={btnClass} title="ลบ">
          <Trash2 size={16} className="text-red-500" />
        </button>
      )}
    </div>
  )
}

function ProviderReader({
  provider,
  onApprove,
  onReject,
}: {
  provider: ProviderRow
  onApprove: () => void
  onReject: () => void
}) {
  const profile = provider.profiles
  const initial = (profile?.full_name || provider.business_name).charAt(0).toUpperCase()
  const cat = CATEGORY_LABELS[provider.category]

  return (
    <div className="p-5">
      <ReaderToolbar
        onApprove={onApprove}
        onReject={onReject}
        onEmail={() => {
          if (profile?.email) window.location.href = `mailto:${profile.email}`
        }}
        onDelete={onReject}
      />

      <h2 className="mt-4 text-lg font-bold text-[#1e3a5f]">{provider.business_name}</h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">
          {initial}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#1e3a5f]">
              {profile?.full_name ?? 'ไม่ระบุชื่อ'}
            </span>
            {provider.is_verified && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                ABN Active
              </span>
            )}
          </div>
          <p className="text-xs text-[rgba(30,58,95,0.5)]">
            {profile?.email} · {formatTime(provider.created_at)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-blue-200/40 bg-[#f0f5ff] p-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-sm font-bold text-[#1e3a5f]">ตรวจสอบ ABN โดยระบบ</span>
        </div>
        <p className="mt-2 text-sm text-[rgba(30,58,95,0.7)]">
          ABN {provider.abn_number} — Active · Sole Trader · {provider.state}
        </p>
        <p className="mt-2 text-sm font-medium text-green-600">ไม่พบประวัติ Scam Alert</p>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-[rgba(30,58,95,0.5)]">ชื่อธุรกิจ</dt>
          <dd className="text-[#1e3a5f]">{provider.business_name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-[rgba(30,58,95,0.5)]">ประเภท</dt>
          <dd className="text-[#1e3a5f]">{cat?.th ?? provider.category}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-[rgba(30,58,95,0.5)]">ที่อยู่</dt>
          <dd className="text-[#1e3a5f]">
            {[provider.address, provider.suburb, provider.state].filter(Boolean).join(', ')}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-[rgba(30,58,95,0.5)]">ติดต่อ</dt>
          <dd className="text-[#1e3a5f]">
            {provider.phone || profile?.phone || '—'}
            {provider.website && (
              <>
                {' '}
                ·{' '}
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="underline">
                  {provider.website}
                </a>
              </>
            )}
          </dd>
        </div>
        {provider.subscription_status === 'premium' && (
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 text-[rgba(30,58,95,0.5)]">Premium</dt>
            <dd className="font-semibold text-[#c9a84c]">💎 Active</dd>
          </div>
        )}
      </dl>

      {provider.verification_status === 'pending' && (
        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onApprove}
            className="w-full rounded-[10px] bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white"
          >
            ✅ อนุมัติธุรกิจ
          </button>
          <button
            type="button"
            onClick={onReject}
            className="w-full rounded-[10px] border border-red-300 py-2.5 text-sm font-semibold text-red-600"
          >
            ❌ ปฏิเสธ
          </button>
        </div>
      )}
    </div>
  )
}
