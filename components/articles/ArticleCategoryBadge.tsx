import { getCategoryIcon, getCategoryLabel } from '@/lib/articles'
import type { ArticleCategory } from '@/types/articles'

interface ArticleCategoryBadgeProps {
  category: ArticleCategory | string
  className?: string
}

export function ArticleCategoryBadge({ category, className = 'mb-4' }: ArticleCategoryBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={getCategoryIcon(category)}
        alt={category}
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
      <span className="rounded-full bg-[rgba(5,26,36,0.06)] px-3 py-1 text-xs font-bold text-[rgba(5,26,36,0.5)]">
        {getCategoryLabel(category)}
      </span>
    </div>
  )
}
