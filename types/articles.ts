export type ArticleCategory = 'legal' | 'tax' | 'insurance' | string

export type ArticleTargetOccupation =
  | 'all'
  | 'massage'
  | 'restaurant'
  | 'photographer'
  | 'tradie'

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: ArticleCategory
  tags: string[]
  target_occupation: ArticleTargetOccupation
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ArticleListItem {
  id: string
  title: string
  slug: string
  summary: string
  category: ArticleCategory
  tags: string[]
  target_occupation: ArticleTargetOccupation
  created_at: string
}
