import type { ArticleCategory } from '@/types/articles'

const ICON_BASE =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/'

export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    legal: 'Blogs/icons8-law-64.png',
    tax: 'Blogs/icons8-tax-50.png',
    insurance: 'Blogs/icons8-insurance-48.png',
  }
  return ICON_BASE + (map[category] || 'Icon/icons8-hire-me-50.png')
}

export function getCategoryLabel(category: ArticleCategory | string): string {
  switch (category) {
    case 'tax':
      return 'ภาษี'
    case 'legal':
      return 'กฎหมาย'
    case 'insurance':
      return 'ประกัน'
    default:
      return category
  }
}

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return slug || `article-${Date.now()}`
}
