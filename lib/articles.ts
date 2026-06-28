import type { ArticleCategory } from '@/types/articles'

export function getCategoryLabel(category: ArticleCategory): string {
  switch (category) {
    case 'tax':
      return '💰 ภาษี'
    case 'legal':
      return '⚖️ กฎหมาย'
    case 'insurance':
      return '🛡️ ประกัน'
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
