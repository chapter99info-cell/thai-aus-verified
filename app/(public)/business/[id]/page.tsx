import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BusinessProfileHeader } from '@/components/business/BusinessProfileHeader'
import { ContactButtons } from '@/components/business/ContactButtons'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewList } from '@/components/reviews/ReviewList'
import { StarRating } from '@/components/reviews/StarRating'
import { ensureHttpUrl } from '@/lib/contact'
import { isPremiumProvider } from '@/lib/subscription'
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
  const isPremium = isPremiumProvider(business)
  const galleryImages = (business.gallery_images ?? []).filter(Boolean)

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, profiles(full_name)')
    .eq('provider_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-white">
      <BusinessProfileHeader business={business} isPremium={isPremium} />

      <div className="mx-auto max-w-3xl px-4 pb-8 pt-4 sm:px-6">
        <StarRating
          rating={Number(business.rating)}
          showAverage
          reviewCount={business.review_count}
        />

        <div className="mt-8">
          <ContactButtons business={business} />
        </div>

        {galleryImages.length > 0 && (
          <section className="mt-10">
            <h3 className="text-lg font-semibold text-slate-900">ผลงาน / Gallery</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              {galleryImages.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={`ผลงาน ${business.business_name}`}
                  className="h-40 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </section>
        )}

        {business.description && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">เกี่ยวกับเรา</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{business.description}</p>
          </section>
        )}

        {business.portfolio_url?.trim() && (
          <a
            href={ensureHttpUrl(business.portfolio_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-14 items-center rounded-xl bg-purple-50 px-5 py-3 text-base font-medium text-purple-700 hover:bg-purple-100"
          >
            ดูผลงานเพิ่มเติม →
          </a>
        )}

        <section className="mt-10 border-t border-slate-200 pt-10">
          <h2 className="text-xl font-semibold text-slate-900">รีวิวจากลูกค้า</h2>
          <div className="mt-6">
            <ReviewList reviews={reviewsData ?? []} />
          </div>
          <div className="mt-8">
            {user ? (
              <ReviewForm providerId={id} />
            ) : (
              <div className="rounded-xl bg-[#1e3a5f] px-5 py-4 text-center">
                <Link
                  href="/login"
                  className="text-base font-medium text-white hover:underline"
                >
                  เข้าสู่ระบบเพื่อเขียนรีวิว
                </Link>
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 pb-6">
          <Link
            href="/directory"
            className="inline-flex min-h-14 items-center text-base font-medium text-[#1e3a5f] hover:underline"
          >
            ← กลับค้นหาธุรกิจ
          </Link>
        </div>
      </div>
    </div>
  )
}
