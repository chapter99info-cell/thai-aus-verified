'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const CARD_VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
]

const CARD_DETAILS = [
  { number: 'นวดแผนไทย · Remedial Massage', name: 'THAI MASSAGE', cvv: 'NSW' },
  { number: 'ร้านอาหารไทย · Thai Restaurant', name: 'THAI RESTAURANT', cvv: 'VIC' },
  { number: 'ช่างภาพ · Photography', name: 'PHOTOGRAPHER', cvv: 'QLD' },
  { number: 'ทำความสะอาด · Cleaning', name: 'CLEANING SERVICE', cvv: 'WA' },
  { number: 'อสังหาริมทรัพย์ · Real Estate', name: 'REAL ESTATE', cvv: 'SA' },
]

const CARD_COLORS = ['#1e3a5f', '#2a4f7c', '#c9a84c', '#3d6fa3', '#122540']

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

const NUM_CARDS = CARD_VIDEOS.length
const ANGLE_STEP = 360 / NUM_CARDS
const AUTO_ROTATE_SPEED = 0.06
const FRICTION = 0.95
const DRAG_SENSITIVITY = 0.35

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

function CarouselCard({ index, rotation, radius }: { index: number; rotation: number; radius: number }) {
  const details = CARD_DETAILS[index]
  const color = CARD_COLORS[index]
  const cardAngle = index * ANGLE_STEP
  const relativeAngle = ((cardAngle + rotation) % 360 + 360) % 360
  const distFromFront = relativeAngle > 180 ? relativeAngle - 360 : relativeAngle
  const opacity = Math.max(0.35, 1 - (Math.abs(distFromFront) / 180) * 0.65)
  const scale = Math.max(0.78, 1 - (Math.abs(distFromFront) / 180) * 0.22)
  const zIndex = Math.round(100 - Math.abs(distFromFront))

  return (
    <div
      className="absolute left-1/2 top-1/2 h-[200px] w-[320px] cursor-grab active:cursor-grabbing sm:h-[214px] sm:w-[340px]"
      style={{
        transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale})`,
        transformStyle: 'preserve-3d',
        opacity,
        zIndex,
      }}
    >
      <div
        className="relative h-full w-full rounded-2xl shadow-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={CARD_VIDEOS[index]}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${color}dd 0%, ${color}88 50%, ${color}cc 100%)`,
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <MetallicChip id={index} />
              <div className="flex flex-col items-end gap-2">
                <img src={LOGO_URL} alt="Thai-Aus Verified" className="h-10 w-10 object-contain" />
                <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-bold text-white">
                  ✓ Verified
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
                Thai-Aus Verified
              </p>
              <p className="mt-1 text-sm font-bold tracking-widest text-white sm:text-base">
                {details.name}
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: `linear-gradient(160deg, ${color} 0%, ${CARD_COLORS[(index + 1) % NUM_CARDS]} 100%)`,
          }}
        >
          <div className="flex h-full flex-col justify-between p-5 sm:p-6">
            <div className="h-8 w-12 rounded bg-white/10" />
            <div>
              <p className="font-mono text-xs tracking-wider text-white/50">CATEGORY</p>
              <p className="mt-1 text-sm font-semibold leading-snug text-white sm:text-base">
                {details.number}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Member</p>
                <p className="mt-0.5 text-xs font-medium text-white sm:text-sm">
                  Thai-Aus Verified Community
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-white/50">State</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-white">{details.cvv}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OccupationCategories() {
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(420)
  const rotationRef = useRef(0)
  const velocityRef = useRef(0)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateRadius = useCallback(() => {
    const w = window.innerWidth
    setRadius(w < 640 ? 280 : w < 1024 ? 360 : 420)
  }, [])

  useEffect(() => {
    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [updateRadius])

  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  useEffect(() => {
    const animate = () => {
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.01) {
          velocityRef.current *= FRICTION
          rotationRef.current += velocityRef.current
        } else {
          velocityRef.current = 0
          rotationRef.current += AUTO_ROTATE_SPEED
        }
        setRotation(rotationRef.current)
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const onPointerDown = (clientX: number) => {
    isDraggingRef.current = true
    startXRef.current = clientX
    velocityRef.current = 0
  }

  const onPointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return
    const deltaX = clientX - startXRef.current
    startXRef.current = clientX
    const delta = deltaX * DRAG_SENSITIVITY
    velocityRef.current = delta
    rotationRef.current += delta
    setRotation(rotationRef.current)
  }

  const onPointerUp = () => {
    isDraggingRef.current = false
  }

  return (
    <section className="w-full bg-black">
      <div className="bg-black py-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/30">
          อาชีพยอดฮิตของคนไทยในออสเตรเลีย
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          ค้นหาตามประเภทธุรกิจ
        </h2>
      </div>

      <div
        ref={containerRef}
        className="relative h-[380px] w-full max-h-[500px] bg-black sm:h-[500px]"
        style={{ touchAction: 'none' }}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
        onTouchEnd={onPointerUp}
      >
        <div
          className="flex h-full items-center justify-center"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
        >
          <div
            className="relative"
            style={{
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotation}deg)`,
            }}
          >
            {Array.from({ length: NUM_CARDS }).map((_, index) => (
              <CarouselCard key={index} index={index} rotation={rotation} radius={radius} />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-2">
          {CARD_DETAILS.map((card, i) => {
            const cardAngle = i * ANGLE_STEP
            const relativeAngle = ((cardAngle + rotation) % 360 + 360) % 360
            const isActive = relativeAngle < ANGLE_STEP / 2 || relativeAngle > 360 - ANGLE_STEP / 2
            return (
              <button
                key={card.name}
                type="button"
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                }`}
                aria-label={card.name}
                onClick={() => {
                  const target = -i * ANGLE_STEP
                  rotationRef.current = target
                  velocityRef.current = 0
                  setRotation(target)
                }}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { OccupationCategories }
