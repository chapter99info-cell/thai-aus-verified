import type { ServiceCategory } from '@/types'

export const CATEGORY_ICON_BASE =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/Icon'

export const HOMEPAGE_CATEGORY_ICONS: {
  icon: string
  label: string
  category: ServiceCategory
}[] = [
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-oil-massage-50.png`,
    label: 'นวดแผนไทย',
    category: 'massage',
  },
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-restaurant-50.png`,
    label: 'ร้านอาหาร',
    category: 'restaurant',
  },
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-booking-50.png`,
    label: 'นัดหมาย / Booking',
    category: 'other',
  },
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-cleaning-a-surface-50.png`,
    label: 'ทำความสะอาด',
    category: 'other',
  },
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-taxi-50.png`,
    label: 'ขนส่ง / แท็กซี่',
    category: 'transport',
  },
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-hotel-bed-50.png`,
    label: 'ที่พัก',
    category: 'accommodation',
  },
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-visa-stamp-64.png`,
    label: 'วีซ่า / ราชการ',
    category: 'visa',
  },
  {
    icon: `${CATEGORY_ICON_BASE}/icons8-hire-me-50.png`,
    label: 'จ้างงาน / Tradesperson',
    category: 'tradesperson',
  },
]

export const CATEGORY_LABELS: Record<
  ServiceCategory,
  { emoji: string; th: string; en: string }
> = {
  accommodation: { emoji: '🏡', th: 'ที่พัก', en: 'Accommodation' },
  real_estate: { emoji: '🏠', th: 'อสังหาริมทรัพย์', en: 'Real Estate' },
  jobs: { emoji: '💼', th: 'หางาน', en: 'Jobs' },
  visa: { emoji: '📋', th: 'วีซ่า', en: 'Visa/Migration' },
  restaurant: { emoji: '🍜', th: 'ร้านอาหาร', en: 'Restaurant' },
  massage: { emoji: '💆', th: 'นวดและสปา', en: 'Massage & Spa' },
  transport: { emoji: '🚗', th: 'ขนส่ง', en: 'Transport' },
  tradesperson: { emoji: '🔧', th: 'ช่างฝีมือ', en: 'Tradesperson' },
  photography: { emoji: '📸', th: 'ช่างภาพ', en: 'Photography' },
  other: { emoji: '🌐', th: 'อื่นๆ', en: 'Other' },
}

export const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const

export const NAVY = '#0D1B3E'
export const NAVY_DARK = '#1B2A5E'
export const NAVY_MEDIUM = '#243B6E'
export const NAVY_HOVER = '#243B6E'
export const GOLD = '#C9A84C'
export const GOLD_WARM = '#D4A017'
export const GOLD_LIGHT = '#F0D060'
export const PAGE_BG = '#F5F5F0'
