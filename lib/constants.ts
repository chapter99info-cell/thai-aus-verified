import type { ServiceCategory } from '@/types'

export const CATEGORY_LABELS: Record<
  ServiceCategory,
  { emoji: string; th: string; en: string }
> = {
  accommodation: { emoji: '🏠', th: 'ที่พัก', en: 'Accommodation' },
  jobs: { emoji: '💼', th: 'หางาน', en: 'Jobs' },
  visa: { emoji: '📋', th: 'วีซ่า', en: 'Visa/Migration' },
  restaurant: { emoji: '🍜', th: 'ร้านอาหาร', en: 'Restaurant' },
  massage: { emoji: '💆', th: 'นวดและสปา', en: 'Massage & Spa' },
  transport: { emoji: '🚗', th: 'รับส่ง', en: 'Transport' },
  tradesperson: { emoji: '🔧', th: 'ช่างฝีมือ', en: 'Tradesperson' },
  photography: { emoji: '📷', th: 'ช่างภาพ', en: 'Photography' },
  other: { emoji: '📌', th: 'อื่นๆ', en: 'Other' },
}

export const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const

export const NAVY = '#1e3a5f'
export const NAVY_HOVER = '#2d5282'
