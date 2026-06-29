import type { ServiceCategory } from '@/types'
import { CATEGORY_LABELS } from '@/lib/constants'

export type CategoryBadge = {
  text: string
  className: string
}

export type DirectoryCategory = {
  emoji: string
  label: string
  category: ServiceCategory
  badge?: CategoryBadge
}

/** Exact display order for homepage + directory category grids */
export const DIRECTORY_CATEGORIES: DirectoryCategory[] = [
  {
    emoji: '🔧',
    label: 'ช่างฝีมือ',
    category: 'tradesperson',
    badge: { text: '🔥 ต้องการสูง', className: 'bg-red-100 text-red-700' },
  },
  {
    emoji: '🏠',
    label: 'อสังหาริมทรัพย์',
    category: 'real_estate',
    badge: { text: '⭐ ABN Required', className: 'bg-blue-100 text-blue-700' },
  },
  {
    emoji: '🚗',
    label: 'ขนส่ง',
    category: 'transport',
    badge: { text: '🚗 Popular', className: 'bg-green-100 text-green-700' },
  },
  { emoji: '📋', label: 'วีซ่า', category: 'visa' },
  { emoji: '🍜', label: 'ร้านอาหาร', category: 'restaurant' },
  { emoji: '💆', label: 'นวดและสปา', category: 'massage' },
  { emoji: '📸', label: 'ช่างภาพ', category: 'photography' },
  { emoji: '🏡', label: 'ที่พัก', category: 'accommodation' },
  { emoji: '💼', label: 'หางาน', category: 'jobs' },
  { emoji: '🌐', label: 'อื่นๆ', category: 'other' },
]

export const CATEGORY_EMOJI: Record<ServiceCategory, string> = {
  tradesperson: '🔧',
  real_estate: '🏠',
  transport: '🚗',
  visa: '📋',
  restaurant: '🍜',
  massage: '💆',
  photography: '📸',
  accommodation: '🏡',
  jobs: '💼',
  other: '🌐',
}

export function buildCategoryCounts(
  rows: { category: string | null }[] | null
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows ?? []) {
    if (row.category) {
      counts[row.category] = (counts[row.category] ?? 0) + 1
    }
  }
  return counts
}

/** Map URL slugs / Thai labels → DB category (English slug). */
const CATEGORY_URL_ALIASES: Record<string, ServiceCategory> = {
  photography: 'photography',
  massage: 'massage',
  restaurant: 'restaurant',
  construction: 'tradesperson',
  tradesperson: 'tradesperson',
  realestate: 'real_estate',
  real_estate: 'real_estate',
  delivery: 'transport',
  transport: 'transport',
  visa: 'visa',
  accommodation: 'accommodation',
  jobs: 'jobs',
  other: 'other',
  ช่างภาพ: 'photography',
  นวดและสปา: 'massage',
  'นวดแผนไทย': 'massage',
  ร้านอาหาร: 'restaurant',
  ช่างฝีมือ: 'tradesperson',
  อสังหาริมทรัพย์: 'real_estate',
  อสังหาฯ: 'real_estate',
  ขนส่ง: 'transport',
  วีซ่า: 'visa',
  ที่พัก: 'accommodation',
  หางาน: 'jobs',
  อื่นๆ: 'other',
}

export function resolveCategoryFromQuery(param: string): ServiceCategory | '' {
  const key = param.trim()
  if (!key) return ''

  const alias = CATEGORY_URL_ALIASES[key]
  if (alias) return alias

  if (key in CATEGORY_LABELS) return key as ServiceCategory

  return ''
}

export function getCategoryThaiLabel(category: ServiceCategory): string {
  return CATEGORY_LABELS[category].th
}
