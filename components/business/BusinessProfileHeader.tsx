import Image from 'next/image'
import { PremiumBadge, VerifiedBadge } from '@/components/business/PremiumBadge'
import { CATEGORY_LABELS } from '@/lib/constants'
import { getBusinessInitial } from '@/lib/utils'
import type { ServiceProvider } from '@/types'

type Props = {
  business: ServiceProvider
  isPremium: boolean
}

export function BusinessProfileHeader({ business, isPremium }: Props) {
  const category = CATEGORY_LABELS[business.category]
  const initial = getBusinessInitial(business.business_name)
  const hasCover = Boolean(business.cover_image_url?.trim())
  const hasProfileImage = Boolean(business.profile_image_url?.trim())

  return (
    <>
      {hasCover ? (
        <div className="relative h-48 w-full md:h-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={business.cover_image_url!}
            alt="cover"
            className="h-full w-full rounded-b-2xl object-cover"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-b-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2d5282] md:h-72">
          <span className="text-8xl font-bold text-white opacity-20">{initial}</span>
        </div>
      )}

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative -mt-10 flex items-end gap-4 pb-2 sm:-mt-12">
          {hasProfileImage ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md">
              <Image
                src={business.profile_image_url!}
                alt={business.business_name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#1e3a5f] text-2xl font-bold text-white shadow-md"
              aria-hidden
            >
              {initial}
            </div>
          )}

          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
                {business.business_name}
              </h1>
              {business.is_verified && <VerifiedBadge />}
              {isPremium && <PremiumBadge />}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#1e3a5f]/10 px-2.5 py-0.5 text-xs font-medium text-[#1e3a5f]">
                {category.emoji} {category.th}
              </span>
              <span className="text-sm text-slate-600">
                {business.state} · {business.suburb}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
