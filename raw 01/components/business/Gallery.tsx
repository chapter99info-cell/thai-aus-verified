import Image from 'next/image'
import { ensureHttpUrl } from '@/lib/contact'

interface GalleryProps {
  businessName: string
  galleryImages: string[]
  portfolioUrl?: string | null
}

export function Gallery({ businessName, galleryImages, portfolioUrl }: GalleryProps) {
  const gallery = galleryImages.filter(Boolean)
  const hasPortfolio = !!portfolioUrl?.trim()

  if (gallery.length === 0 && !hasPortfolio) return null

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900">แกลเลอรี</h2>
      {gallery.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-square overflow-hidden rounded-xl border border-slate-200"
            >
              <Image
                src={src}
                alt={`รูปภาพธุรกิจ ${businessName} ภาพที่ ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
      {hasPortfolio && (
        <a
          href={ensureHttpUrl(portfolioUrl!)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-14 items-center rounded-xl bg-purple-50 px-5 py-3 text-base font-medium text-purple-700 hover:bg-purple-100"
        >
          ดูผลงานเพิ่มเติม →
        </a>
      )}
    </section>
  )
}
