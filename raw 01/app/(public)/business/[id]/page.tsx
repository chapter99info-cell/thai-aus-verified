import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactButtons } from '@/components/business/ContactButtons'
import { Gallery } from '@/components/business/Gallery'
import { PremiumBadge, VerifiedBadge } from '@/components/business/PremiumBadge'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewList } from '@/components/reviews/ReviewList'
import { StarRating } from '@/components/reviews/StarRating'
import { CATEGORY_LABELS } from '@/lib/constants'
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
  const category = CATEGORY_LABELS[business.category]
  const isPremium = isPremiumProvider(business)

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, profiles(full_name)')
    .eq('provider_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-white">
      <div className="relative h-40 sm:h-52">
        {business.cover_image_url ? (
          <Image
            src={business.cover_image_url}
            alt={`ภาพปกธุรกิจ ${business.business_name}`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5282]" />
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="relative -mt-16 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:-mt-20">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
              {business.business_name}
            </h1>
            {business.is_verified && <VerifiedBadge />}
            {isPremium && <PremiumBadge />}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1e3a5f]/10 px-2.5 py-0.5 text-xs font-medium text-[#1e3a5f]">
              {category.emoji} {category.th}
            </span>
            <span className="text-sm text-slate-600">
              {business.state} · {business.suburb}
            </span>
          </div>

          <StarRating
            rating={Number(business.rating)}
            showAverage
            reviewCount={business.review_count}
            className="mt-4"
          />
        </div>

        <div className="mt-8">
          <ContactButtons business={business} />
        </div>

        {business.description && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">เกี่ยวกับเรา</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{business.description}</p>
          </section>
        )}

        <Gallery
          businessName={business.business_name}
          galleryImages={business.gallery_images ?? []}
          portfolioUrl={business.portfolio_url}
        />

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
