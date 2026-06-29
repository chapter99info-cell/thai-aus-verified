import { CATEGORY_ICON_BASE } from '@/lib/constants'

const LOGO_PLACEHOLDER =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

export type MarqueeBusiness = {
  id: string
  business_name: string
  logo_url: string | null
  state?: string | null
}

export const MARQUEE_FALLBACK: MarqueeBusiness[] = [
  {
    id: 'seed-mira',
    business_name: 'Mira Thai Massage',
    logo_url: `${CATEGORY_ICON_BASE}/icons8-oil-massage-50.png`,
    state: 'NSW',
  },
  {
    id: 'seed-garlic',
    business_name: 'Thai Garlic Rest.',
    logo_url: `${CATEGORY_ICON_BASE}/icons8-restaurant-50.png`,
    state: 'NSW',
  },
  {
    id: 'seed-photo',
    business_name: 'Chapter99 Photo',
    logo_url: LOGO_PLACEHOLDER,
    state: 'SYD',
  },
  {
    id: 'seed-jasmine',
    business_name: 'Jasmine Massage',
    logo_url: `${CATEGORY_ICON_BASE}/icons8-oil-massage-50.png`,
    state: 'VIC',
  },
]

export function mergeMarqueeBusinesses(data: MarqueeBusiness[]): MarqueeBusiness[] {
  if (data.length >= 4) return data

  const needed = 4 - data.length
  const seeds = MARQUEE_FALLBACK.filter(
    (seed) => !data.some((item) => item.business_name === seed.business_name)
  )

  return [...data, ...seeds.slice(0, needed)]
}
