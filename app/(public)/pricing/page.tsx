import { KnowledgeHub } from '@/components/pricing/KnowledgeHub'
import { PricingCards } from '@/components/pricing/PricingCards'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ArticleListItem } from '@/types/articles'

export const dynamic = 'force-dynamic'

async function getArticles(): Promise<ArticleListItem[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, summary, category, tags, target_occupation, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (data ?? []) as ArticleListItem[]
}

export default async function PricingPage() {
  const articles = await getArticles()

  return (
    <>
      <div className="bg-[#F5F5F0]">
        <PricingCards />
      </div>
      <KnowledgeHub articles={articles} />
    </>
  )
}
