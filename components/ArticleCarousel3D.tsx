'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { getCategoryLabel } from '@/lib/articles'
import type { ArticleListItem } from '@/types/articles'

interface ArticleCarousel3DProps {
  articles: ArticleListItem[]
}

function getWrappedOffset(index: number, activeIndex: number, total: number): number {
  let offset = index - activeIndex
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total
  return offset
}

function getCardTransform(offset: number, isMobile: boolean): CSSProperties {
  const xScale = isMobile ? 0.55 : 1
  const zScale = isMobile ? 0.85 : 1

  if (offset === 0) {
    return {
      transform: 'scale(1) rotateY(0deg) translateX(0px) translateZ(0px)',
      zIndex: 10,
      opacity: 1,
    }
  }

  if (offset === -1) {
    return {
      transform: `scale(0.85) rotateY(20deg) translateX(${-280 * xScale}px) translateZ(${-120 * zScale}px)`,
      zIndex: 5,
      opacity: 0.88,
    }
  }

  if (offset === 1) {
    return {
      transform: `scale(0.85) rotateY(-20deg) translateX(${280 * xScale}px) translateZ(${-120 * zScale}px)`,
      zIndex: 5,
      opacity: 0.88,
    }
  }

  if (offset === -2) {
    return {
      transform: `scale(0.7) rotateY(35deg) translateX(${-500 * xScale}px) translateZ(${-250 * zScale}px)`,
      zIndex: 1,
      opacity: 0.5,
    }
  }

  if (offset === 2) {
    return {
      transform: `scale(0.7) rotateY(-35deg) translateX(${500 * xScale}px) translateZ(${-250 * zScale}px)`,
      zIndex: 1,
      opacity: 0.5,
    }
  }

  return {
    transform: 'scale(0.5) rotateY(0deg) translateX(0px) translateZ(-400px)',
    zIndex: 0,
    opacity: 0,
    pointerEvents: 'none',
  }
}

export function ArticleCarousel3D({ articles }: ArticleCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dragStart = useRef<number | null>(null)
  const dragDelta = useRef(0)

  const total = articles.length

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total)
  }, [total])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (isPaused || total <= 1) return
    const timer = window.setInterval(goNext, 4000)
    return () => window.clearInterval(timer)
  }, [isPaused, goNext, total])

  function handleDragStart(clientX: number) {
    dragStart.current = clientX
    dragDelta.current = 0
  }

  function handleDragMove(clientX: number) {
    if (dragStart.current === null) return
    dragDelta.current = clientX - dragStart.current
  }

  function handleDragEnd() {
    if (dragStart.current === null) return
    const threshold = 50
    if (dragDelta.current > threshold) goPrev()
    else if (dragDelta.current < -threshold) goNext()
    dragStart.current = null
    dragDelta.current = 0
  }

  if (total === 0) return null

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative mx-auto h-[420px] w-full max-w-5xl [perspective:1200px]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,58,95,0.04), transparent)',
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => {
          if (dragStart.current !== null) handleDragMove(e.clientX)
        }}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => {
          if (dragStart.current !== null) handleDragEnd()
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div className="relative h-full w-full [transform-style:preserve-3d]">
          {articles.map((article, index) => {
            const offset = getWrappedOffset(index, activeIndex, total)
            if (Math.abs(offset) > 2) return null

            const style = getCardTransform(offset, isMobile)
            const isCenter = offset === 0

            return (
              <div
                key={article.id}
                className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  ...style,
                  transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (isCenter) return
                    setActiveIndex(index)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isCenter) setActiveIndex(index)
                  }}
                  className={`flex h-[360px] w-[320px] cursor-pointer flex-col rounded-3xl border border-[rgba(5,26,36,0.08)] bg-white p-8 shadow-[0_20px_60px_rgba(5,26,36,0.12)] ${
                    isCenter ? '' : 'brightness-[0.92]'
                  }`}
                >
                  <span className="mb-4 inline-block w-fit rounded-full bg-[rgba(5,26,36,0.06)] px-3 py-1 text-xs font-bold text-[rgba(5,26,36,0.5)]">
                    {getCategoryLabel(article.category)}
                  </span>

                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#051A24]">
                    {article.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[rgba(5,26,36,0.5)]">
                    {article.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {article.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[rgba(5,26,36,0.04)] px-2 py-0.5 text-xs text-[rgba(5,26,36,0.4)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {isCenter && (
                    <Link
                      href={`/articles/${article.slug}`}
                      className="mt-4 text-xs font-semibold text-[rgba(5,26,36,0.4)] transition-colors hover:text-[#051A24]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      อ่านเพิ่มเติม →
                    </Link>
                  )}
                </article>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label="บทความก่อนหน้า"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(5,26,36,0.1)] bg-white shadow-[0_4px_16px_rgba(5,26,36,0.08)] transition-colors hover:border-[rgba(5,26,36,0.2)]"
        >
          <ChevronLeft size={20} className="text-[#051A24]" />
        </button>

        <div className="flex items-center gap-2">
          {articles.map((article, index) => (
            <button
              key={article.id}
              type="button"
              aria-label={`ไปบทความ ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-6 bg-[#051A24]'
                  : 'w-2 bg-[rgba(5,26,36,0.2)] hover:bg-[rgba(5,26,36,0.35)]'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="บทความถัดไป"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(5,26,36,0.1)] bg-white shadow-[0_4px_16px_rgba(5,26,36,0.08)] transition-colors hover:border-[rgba(5,26,36,0.2)]"
        >
          <ChevronRight size={20} className="text-[#051A24]" />
        </button>
      </div>
    </div>
  )
}
