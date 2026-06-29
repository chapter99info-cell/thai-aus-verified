import type { ServiceCategory } from '@/types'
import { CATEGORY_EMOJI } from '@/lib/categories'

export type MarqueeBusiness = {
  id: string
  name: string
  emoji: string
  category?: string
  logo_url?: string | null
}

export const FALLBACK_BUSINESSES: MarqueeBusiness[] = [
  { id: 'f1', name: 'Thai Garlic Restaurant', emoji: '🍜', logo_url: null },
  { id: 'f2', name: 'Mira Thai Massage', emoji: '💆', logo_url: null },
  { id: 'f3', name: 'Jasmine Massage & Spa', emoji: '💆', logo_url: null },
  { id: 'f4', name: 'Koala Wellness & Spa', emoji: '🧘', logo_url: null },
]

export const SEED_BUSINESSES: MarqueeBusiness[] = [
  { id: 'seed-1', name: 'ช่างไฟฟ้าไทย', category: 'ช่างฝีมือ', emoji: '🔧' },
  { id: 'seed-2', name: 'Thai Express Transport', category: 'ขนส่ง', emoji: '🚗' },
  { id: 'seed-3', name: 'Sydney Thai Kitchen', category: 'ร้านอาหาร', emoji: '🍜' },
  { id: 'seed-4', name: 'Thai Visa Assist', category: 'วีซ่า', emoji: '📋' },
  { id: 'seed-5', name: 'Mira Thai Massage', category: 'นวดและสปา', emoji: '💆' },
  { id: 'seed-6', name: 'Thai Real Estate AU', category: 'อสังหาฯ', emoji: '🏠' },
  { id: 'seed-7', name: 'BKK Photography', category: 'ช่างภาพ', emoji: '📸' },
  { id: 'seed-8', name: 'Thai Cleaning Pro', category: 'ช่างฝีมือ', emoji: '🧹' },
]

export function mapProviderToMarquee(row: {
  id: string
  business_name: string
  category: string | null
  profile_image_url?: string | null
}): MarqueeBusiness {
  const cat = (row.category ?? 'other') as ServiceCategory
  return {
    id: row.id,
    name: row.business_name,
    emoji: CATEGORY_EMOJI[cat] ?? '🌐',
    category: row.category ?? undefined,
    logo_url: row.profile_image_url ?? null,
  }
}

/** Merge Supabase rows with fallbacks when too few verified businesses. */
export function mergeMarqueeData(data: MarqueeBusiness[]): MarqueeBusiness[] {
  if (data.length >= 2) return data

  const existingNames = new Set(data.map((item) => item.name.toLowerCase()))
  const fallbacks = FALLBACK_BUSINESSES.filter(
    (item) => !existingNames.has(item.name.toLowerCase())
  )

  const merged = [...data, ...fallbacks]
  return merged.length > 0 ? merged : SEED_BUSINESSES
}

/** Quadruple merged list so -50% translate loop is seamless. */
export function buildMarqueeTrack(data: MarqueeBusiness[]): MarqueeBusiness[] {
  const merged = mergeMarqueeData(data)
  return [...merged, ...merged, ...merged, ...merged]
}
