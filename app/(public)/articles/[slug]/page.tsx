import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleCategoryBadge } from '@/components/articles/ArticleCategoryBadge'
import { ArticleContent, ArticleDisclaimer } from '@/components/articles/ArticleContent'
import { getCategoryLabel } from '@/lib/articles'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { formatDateDDMMYYYY } from '@/lib/utils'
import type { Article, ArticleListItem } from '@/types/articles'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  return (data as Article | null) ?? null
}

async function getRelatedArticles(category: string, slug: string): Promise<ArticleListItem[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, summary, category, tags, target_occupation, created_at')
    .eq('is_published', true)
    .eq('category', category)
    .neq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(3)

  return (data ?? []) as ArticleListItem[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'ไม่พบบทความ | Thai-Aus Verified' }
  }

  return {
    title: `${article.title} | Knowledge Hub`,
    description: article.summary,
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  const related = await getRelatedArticles(article.category, article.slug)

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/pricing"
        className="text-sm text-[rgba(5,26,36,0.45)] transition-colors hover:text-[#051A24]"
      >
        ← กลับไป Knowledge Hub
      </Link>

      <ArticleDisclaimer />

      <ArticleCategoryBadge category={article.category} />

      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#051A24] md:text-4xl">
        {article.title}
      </h1>

      <p className="mt-3 text-sm text-[rgba(5,26,36,0.45)]">
        อัปเดต {formatDateDDMMYYYY(article.updated_at || article.created_at)}
      </p>

      <p className="mt-6 text-base leading-relaxed text-[rgba(5,26,36,0.6)]">{article.summary}</p>

      <div className="mt-8 border-t border-[rgba(5,26,36,0.08)] pt-8">
        <ArticleContent content={article.content} />
      </div>

      {article.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[rgba(5,26,36,0.04)] px-3 py-1 text-xs text-[rgba(5,26,36,0.45)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <ArticleDisclaimer />
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-[rgba(5,26,36,0.08)] pt-10">
          <h2 className="text-xl font-bold text-[#051A24]">บทความที่เกี่ยวข้อง</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/articles/${item.slug}`}
                className="rounded-2xl border border-[rgba(5,26,36,0.08)] p-5 transition-colors hover:border-[rgba(5,26,36,0.2)] hover:shadow-md"
              >
                <span className="text-xs font-bold text-[rgba(5,26,36,0.45)]">
                  {getCategoryLabel(item.category)}
                </span>
                <h3 className="mt-2 font-bold text-[#051A24]">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[rgba(5,26,36,0.5)]">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
