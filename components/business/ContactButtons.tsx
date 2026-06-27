import { ensureHttpUrl, lineHref, telHref } from '@/lib/contact'
import type { ServiceProvider } from '@/types'

const buttonBase =
  'flex min-h-14 w-full items-center gap-3 rounded-xl p-4 text-base font-medium transition-colors'

interface ContactButtonsProps {
  business: Pick<
    ServiceProvider,
    | 'phone'
    | 'line_id'
    | 'facebook_url'
    | 'instagram_url'
    | 'website'
    | 'portfolio_url'
  >
}

export function ContactButtons({ business }: ContactButtonsProps) {
  const buttons = []

  if (business.phone?.trim()) {
    buttons.push(
      <a
        key="phone"
        href={telHref(business.phone)}
        className={`${buttonBase} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
      >
        📞 โทรเลย {business.phone}
      </a>
    )
  }

  if (business.line_id?.trim()) {
    buttons.push(
      <a
        key="line"
        href={lineHref(business.line_id)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
      >
        💬 ทักใน Line
      </a>
    )
  }

  if (business.facebook_url?.trim()) {
    buttons.push(
      <a
        key="facebook"
        href={ensureHttpUrl(business.facebook_url)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
      >
        👥 ทักใน Facebook
      </a>
    )
  }

  if (business.instagram_url?.trim()) {
    buttons.push(
      <a
        key="instagram"
        href={ensureHttpUrl(business.instagram_url)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100`}
      >
        📸 ดูใน Instagram
      </a>
    )
  }

  if (business.website?.trim()) {
    buttons.push(
      <a
        key="website"
        href={ensureHttpUrl(business.website)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100`}
      >
        🌐 เว็บไซต์
      </a>
    )
  }

  if (business.portfolio_url?.trim()) {
    buttons.push(
      <a
        key="portfolio"
        href={ensureHttpUrl(business.portfolio_url)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100`}
      >
        🎨 ดูผลงานทั้งหมด
      </a>
    )
  }

  if (buttons.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">ติดต่อธุรกิจ</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">{buttons}</div>
    </section>
  )
}
