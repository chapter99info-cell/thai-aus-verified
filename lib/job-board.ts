import { lineHref, telHref } from '@/lib/contact'
import { JOB_ACTIVE_DAYS } from '@/lib/mvp-constants'
import type { JobBoardBusinessType, JobPostingWithBusiness } from '@/types/job-board'

export function isVerifiedOwnerRole(role: string | null | undefined): boolean {
  return role === 'verified_owner'
}

export function jobContactHref(contactInfo: string): string {
  const trimmed = contactInfo.trim()
  const lower = trimmed.toLowerCase()

  if (lower.includes('line') || trimmed.includes('@') || lower.startsWith('http')) {
    const lineId = trimmed
      .replace(/^https?:\/\/line\.me\/ti\/p\/~?/i, '')
      .replace(/^line\s*:?\s*/i, '')
      .replace(/^@/, '')
      .trim()
    return lineHref(lineId)
  }

  const phoneLike = /^[\d\s+\-()]+$/.test(trimmed)
  if (trimmed.startsWith('0') || phoneLike) {
    return telHref(trimmed)
  }

  return telHref(trimmed)
}

export function daysSincePosted(createdAt: string): number {
  const diff = Date.now() - new Date(createdAt).getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export function formatDaysAgoThai(createdAt: string): string {
  const days = daysSincePosted(createdAt)
  if (days === 0) return 'วันนี้'
  return `${days} วันที่แล้ว`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

export function businessTypeBadge(type: JobBoardBusinessType): {
  label: string
  emoji: string
} {
  if (type === 'restaurant') {
    return { label: 'ร้านอาหาร', emoji: '🍜' }
  }
  return { label: 'ร้านนวด', emoji: '💆' }
}

export function activeJobsCutoffIso(): string {
  return new Date(Date.now() - JOB_ACTIVE_DAYS * 24 * 60 * 60 * 1000).toISOString()
}

export function parsePageParam(value: string | undefined, fallback = 1): number {
  const parsed = parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

export function totalPages(totalCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalCount / pageSize))
}

export type JobPostingRow = JobPostingWithBusiness
