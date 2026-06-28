'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

const CARD_VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
]

const CARD_DETAILS = [
  {
    number: 'นวดแผนไทย · Remedial Massage',
    name: 'THAI MASSAGE',
    cvv: 'NSW',
    isPremium: true,
  },
  {
    number: 'ร้านอาหารไทย · Thai Restaurant',
    name: 'THAI RESTAURANT',
    cvv: 'VIC',
    isPremium: true,
  },
  {
    number: 'ช่างภาพ · Photography',
    name: 'PHOTOGRAPHER',
    cvv: 'QLD',
    isPremium: false,
  },
  {
    number: 'ทำความสะอาด · Cleaning Service',
    name: 'CLEANING',
    cvv: 'WA',
    isPremium: false,
  },
  {
    number: 'อสังหาริมทรัพย์ · Real Estate',
    name: 'REAL ESTATE',
    cvv: 'SA',
    isPremium: true,
  },
]

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

const NUM_CARDS = CARD_VIDEOS.length
const GAP = 32
const AUTO_SPEED = 0.004
const FRICTION = 0.92

interface CardMetrics {
  cardW: number
  cardH: number
}

function MetallicChip({ id }: { id: number }) {
  const gradId = `chipGold-${id}`
  return (
    <svg className="h-9 w-12" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="36" rx="5" fill={`url(#${gradId})`} />
      <rect x="8" y="6" width="32" height="24" rx="2" stroke="#b8860b" strokeWidth="0.5" fill="none" />
      <line x1="16" y1="6" x2="16" y2="30" stroke="#b8860b" strokeWidth="0.5" />
      <line x1="24" y1="6" x2="24" y2="30" stroke="#b8860b" strokeWidth="0.5" />
      <line x1="32" y1="6" x2="32" y2="30" stroke="#b8860b" strokeWidth="0.5" />
      <line x1="8" y1="14" x2="40" y2="14" stroke="#b8860b" strokeWidth="0.5" />
      <line x1="8" y1="22" x2="40" y2="22" stroke="#b8860b" strokeWidth="0.5" />
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8c547" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="1" stopColor="#a8860b" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function CardFaces({ index }: { index: number }) {
  const details = CARD_DETAILS[index]
  const [isFlipped, setIsFlipped] = useState(false)

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  return (
    <div
      className="relative h-full w-full cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.6s ease',
      }}
      onClick={toggleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') toggleFlip()
      }}
    >
      {/* Front */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl"
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full rounded-[16px] object-cover"
          src={CARD_VIDEOS[index]}
        />
        {details.isPremium && (
          <div
            className="absolute inset-0 rounded-[16px]"
            style={{
              background:
                'linear-gradient(135deg, rgba(201,168,76,0.6) 0%, transparent 50%, rgba(201,168,76,0.3) 100%)',
            }}
          />
        )}
        <div
          className="absolute inset-0 rounded-[16px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        <div className="absolute left-4 top-4 z-20">
          <MetallicChip id={index} />
        </div>

        <div className="absolute right-4 top-4 z-20">
          <img
            src={LOGO_URL}
            className="h-10 w-10 rounded-full bg-white/10 object-contain p-1"
            alt="Thai-Aus Verified"
          />
        </div>

        <div className="absolute right-4 bottom-4 z-20">
          {details.isPremium ? (
            <span
              className="rounded-full px-2 py-1 text-[10px] font-bold text-black"
              style={{ background: 'linear-gradient(90deg,#FFD700,#FFA500)' }}
            >
              ⭐ PREMIUM
            </span>
          ) : (
            <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold text-white">
              ✓ Verified
            </span>
          )}
        </div>

        <div className="absolute bottom-5 left-5 z-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
            Thai-Aus Verified
          </p>
          <p className="mt-1 text-sm font-bold tracking-widest text-white sm:text-base">
            {details.name}
          </p>
        </div>
      </div>

      {/* Back */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ filter: 'blur(16px)', transform: 'scale(1.15)' }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={CARD_VIDEOS[index]}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(30,58,95,0.85) 0%, rgba(0,0,0,0.75) 100%)' }}
        />
        <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
          <div className="h-8 w-12 rounded bg-white/10" />
          <div>
            <div className="font-mono text-[11px] font-medium tracking-[0.12em] text-white sm:text-[13px]">
              {details.number}
            </div>
            <div className="mt-1 font-mono text-[8px] tracking-wide text-white/60 sm:text-[10px]">
              THAI-AUS VERIFIED · {details.cvv}
            </div>
            <div className="font-mono text-[8px] tracking-wide text-white/40 sm:text-[10px]">
              {details.isPremium ? '⭐ PREMIUM A$9/MONTH' : '✓ FREE MEMBER'}
            </div>
          </div>
          <Link
            href="/pricing"
            className="text-center text-[10px] font-medium text-white/70 underline hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            ดูแผนราคา →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OccupationCategories({
  hero = false,
  showScrollHint = false,
  showGradient = true,
}: {
  hero?: boolean
  showScrollHint?: boolean
  showGradient?: boolean
} = {}) {
  const [metrics, setMetrics] = useState<CardMetrics>({ cardW: 320, cardH: 201 })
  const [activeIndex, setActiveIndex] = useState(0)
  const metricsRef = useRef(metrics)
  const progress = useRef(0)
  const velocity = useRef(0)
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const lastActive = useRef(0)
  const cardEls = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const updateMetrics = useCallback(() => {
    const w = window.innerWidth
    const cardW = Math.min(420, Math.max(280, w * 0.3))
    const next = { cardW, cardH: Math.round(cardW / 1.5925) }
    metricsRef.current = next
    setMetrics(next)
  }, [])

  useEffect(() => {
    metricsRef.current = metrics
  }, [metrics])

  const renderLoop = useCallback(() => {
    const { cardW } = metricsRef.current
    const maxTiltX = 12
    const maxTiltY = 18

    if (!isDragging.current) {
      velocity.current *= FRICTION
      progress.current += velocity.current
      if (Math.abs(velocity.current) < 0.002) {
        progress.current += AUTO_SPEED
      }
    }

    while (progress.current < 0) progress.current += NUM_CARDS
    while (progress.current >= NUM_CARDS) progress.current -= NUM_CARDS

    const rounded = Math.round(progress.current) % NUM_CARDS
    if (rounded !== lastActive.current) {
      lastActive.current = rounded
      setActiveIndex(rounded)
    }

    cardEls.current.forEach((card, i) => {
      if (!card) return

      let offset = i - progress.current
      if (offset > NUM_CARDS / 2) offset -= NUM_CARDS
      if (offset < -NUM_CARDS / 2) offset += NUM_CARDS

      const targetX = cardW + GAP
      const x = offset * targetX
      const dist = Math.abs(offset)
      const z = -dist * 100
      const rotY = offset * -22

      const centerFactor = Math.max(0, 1 - dist)
      const activeTiltX = mouse.current.x * maxTiltX * centerFactor
      const activeTiltY = -mouse.current.y * maxTiltY * centerFactor
      const totalRotX = activeTiltX
      const totalRotY = rotY + activeTiltY

      card.style.transform = `translateX(${x.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateY(${totalRotY.toFixed(2)}deg) rotateX(${totalRotX.toFixed(2)}deg) rotateZ(0deg)`
      card.style.opacity = String(Math.max(0.35, 1 - dist * 0.22))
      card.style.zIndex = String(Math.round(100 - dist * 15))
    })

    rafRef.current = requestAnimationFrame(renderLoop)
  }, [])

  useEffect(() => {
    updateMetrics()
    window.addEventListener('resize', updateMetrics)
    rafRef.current = requestAnimationFrame(renderLoop)

    return () => {
      window.removeEventListener('resize', updateMetrics)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [updateMetrics, renderLoop])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    container.addEventListener('mousemove', onMouseMove)
    return () => container.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    let touchStartX = 0

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
    }

    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        progress.current += diff > 0 ? 1 : -1
        velocity.current = diff > 0 ? 0.08 : -0.08
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const onPointerDown = (clientX: number) => {
    isDragging.current = true
    lastX.current = clientX
    velocity.current = 0
  }

  const onPointerMove = (clientX: number) => {
    if (!isDragging.current) return
    const delta = clientX - lastX.current
    lastX.current = clientX
    const { cardW } = metricsRef.current
    const step = cardW + GAP
    progress.current -= delta / step
    velocity.current = (-delta / step) * 0.35
  }

  const onPointerUp = () => {
    isDragging.current = false
  }

  return (
    <section className="w-full">
      {!hero && (
        <div className="bg-white py-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1e3a5f]/30">
            อาชีพยอดฮิตของคนไทยในออสเตรเลีย
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#1e3a5f] md:text-4xl">
            ค้นหาตามประเภท<em className="font-playfair not-italic">ธุรกิจ</em>
          </h2>
          <p className="mt-2 text-sm text-[#1e3a5f]/40">
            สมาชิก Premium
            <span className="font-bold text-yellow-500"> ⭐ A$9/เดือน</span> — กดบัตรเพื่อดูแผนราคา
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative w-full bg-black"
        style={{ height: '520px', touchAction: 'pan-y' }}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
        >
          <div
            className="relative"
            style={{
              width: metrics.cardW,
              height: metrics.cardH,
              transformStyle: 'preserve-3d',
            }}
          >
            {Array.from({ length: NUM_CARDS }).map((_, index) => (
              <div
                key={index}
                ref={(el) => {
                  cardEls.current[index] = el
                }}
                className="absolute left-1/2 top-1/2 cursor-grab active:cursor-grabbing"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                }}
              >
                <CardFaces index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center gap-2">
          {CARD_DETAILS.map((card, i) => (
              <button
                key={card.name}
                type="button"
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                }`}
                aria-label={card.name}
                onClick={() => {
                  progress.current = i
                  velocity.current = 0
                  lastActive.current = i
                  setActiveIndex(i)
                }}
              />
            ))}
        </div>

        {showScrollHint && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2">
            <span className="text-xs font-medium text-white/50">เลื่อนลงเพื่อค้นหา</span>
            <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {showGradient && <div className="h-10 bg-gradient-to-b from-black to-white" />}
    </section>
  )
}

export { OccupationCategories }
