import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewList } from '@/components/reviews/ReviewList'
import { StarRating } from '@/components/reviews/StarRating'
import { CATEGORY_LABELS } from '@/lib/constants'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ServiceProvider } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params

  if (!isSupabaseConfigured()) notFound()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('service_providers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const business = data as ServiceProvider
  const category = CATEGORY_LABELS[business.category]

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, profiles(full_name)')
    .eq('provider_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/directory" className="text-sm text-slate-500 hover:text-[#1e3a5f]">
          ← กลับไดเรกทอรี
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#1e3a5f]">{business.business_name}</h1>
              {business.is_verified && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                  ✅ Verified
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#1e3a5f]/10 px-2.5 py-0.5 text-xs font-medium text-[#1e3a5f]">
                {category.emoji} {category.th}
              </span>
              <span className="text-sm text-slate-600">
                {business.state} · {business.suburb}
              </span>
            </div>
          </div>
        </div>

        <StarRating
          rating={Number(business.rating)}
          showAverage
          reviewCount={business.review_count}
          className="mt-4"
        />

        {business.description && (
          <p className="mt-8 leading-relaxed text-slate-700">{business.description}</p>
        )}

        <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">ติดต่อ</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {business.phone && (
              <li className="text-slate-700">
                📞 <span className="font-medium">{business.phone}</span>
              </li>
            )}
            {business.line_id && (
              <li className="text-slate-700">
                💬 Line ID: <span className="font-medium">{business.line_id}</span>
              </li>
            )}
            {business.website && (
              <li>
                🌐{' '}
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1e3a5f] hover:underline"
                >
                  {business.website}
                </a>
              </li>
            )}
            {business.facebook_url && (
              <li>
                👥{' '}
                <a
                  href={business.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1e3a5f] hover:underline"
                >
                  Facebook
                </a>
              </li>
            )}
            {!business.phone && !business.line_id && !business.website && !business.facebook_url && (
              <li className="text-slate-500">ยังไม่มีข้อมูลติดต่อ</li>
            )}
          </ul>
        </section>

        <hr className="my-10 border-slate-200" />

        <section>
          <h2 className="text-xl font-semibold text-slate-900">รีวิวจากลูกค้า</h2>
          <div className="mt-6">
            <ReviewList reviews={reviewsData ?? []} />
          </div>
          <div className="mt-8">
            {user ? (
              <ReviewForm providerId={id} />
            ) : (
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Link href="/login" className="font-medium text-[#1e3a5f] hover:underline">
                  เข้าสู่ระบบเพื่อรีวิว
                </Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
