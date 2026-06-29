import type { ServiceCategory } from '@/types'
import { CATEGORY_EMOJI } from '@/lib/categories'

export type MarqueeBusiness = {
  id: string
  name: string
  emoji: string
  category?: string
}

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
}): MarqueeBusiness {
  const cat = (row.category ?? 'other') as ServiceCategory
  return {
    id: row.id,
    name: row.business_name,
    emoji: CATEGORY_EMOJI[cat] ?? '🌐',
    category: row.category ?? undefined,
  }
}

/** Use DB results when available; otherwise seed. Duplicate ×3 for infinite scroll. */
export function buildMarqueeTrack(data: MarqueeBusiness[]): MarqueeBusiness[] {
  const base = data.length > 0 ? data : SEED_BUSINESSES
  return [...base, ...base, ...base]
}
