'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'

const CATEGORIES = [
  {
    name: 'นวดแผนไทย',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4',
    buttonText: 'ค้นหาร้านนวด',
    link: '/directory?category=นวดแผนไทย',
  },
  {
    name: 'ร้านอาหาร',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
    buttonText: 'ค้นหาร้านอาหาร',
    link: '/directory?category=ร้านอาหาร',
  },
  {
    name: 'ช่างภาพ & บริการ',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4',
    buttonText: 'ค้นหาบริการ',
    link: '/directory?category=ช่างภาพ',
  },
] as const

interface OccupationCategoriesProps {
  variant?: 'full' | 'alerts'
  eyebrow?: string
  title?: React.ReactNode
  limit?: number
  showDefaultEyebrow?: boolean
}

function CategoryCard({
  name,
  video,
  buttonText,
  link,
  index,
  isVisible,
  compact,
}: (typeof CATEGORIES)[number] & {
  index: number
  isVisible: boolean
  compact?: boolean
}) {
  return (
    <div
      className={`group relative flex min-h-[400px] flex-col items-start justify-between overflow-hidden p-6 sm:min-h-[500px] sm:p-8 md:min-h-[750px] md:p-12 ${
        compact ? '!min-h-[300px] md:!min-h-[300px]' : ''
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
        transition: `opacity 1000ms ease-out, transform 1000ms ease-out`,
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={video}
      />
      <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/20" />

      <h2
        className="relative z-10 font-medium text-white transition-transform duration-500 group-hover:-translate-y-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
        style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
      >
        {name}
      </h2>

      <Link
        href={link}
        className="btn-primary relative z-10 mt-auto rounded-full bg-white px-8 py-3 text-sm font-bold text-[#1e3a5f] transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        {buttonText}
      </Link>
    </div>
  )
}

export function OccupationCategories({
  variant = 'full',
  eyebrow,
  title = (
    <>
      ค้นหาตามประเภท<span className="font-playfair italic">ธุรกิจ</span>
    </>
  ),
  limit,
  showDefaultEyebrow = true,
}: OccupationCategoriesProps) {
  const { ref, isVisible } = useInView(0.1)
  const isAlerts = variant === 'alerts'
  const cards = CATEGORIES.slice(0, limit ?? (isAlerts ? 2 : 3))
  const eyebrowText =
    eyebrow ?? (showDefaultEyebrow ? 'อาชีพยอดฮิตของคนไทยในออสเตรเลีย' : undefined)

  return (
    <section
      ref={ref}
      className={`w-full bg-white ${variant === 'full' ? 'min-h-screen' : ''}`}
    >
      <div className="px-6 py-12 text-center">
        {eyebrowText ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[rgba(30,58,95,0.3)]">
            {eyebrowText}
          </p>
        ) : null}
        <h2 className="text-3xl font-bold tracking-tight text-[#1e3a5f] md:text-5xl">{title}</h2>
      </div>

      <div
        className={`grid grid-cols-1 ${isAlerts ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}
      >
        {cards.map((cat, index) => (
          <CategoryCard
            key={cat.name}
            {...cat}
            index={index}
            isVisible={isVisible}
            compact={isAlerts}
          />
        ))}
      </div>
    </section>
  )
}
