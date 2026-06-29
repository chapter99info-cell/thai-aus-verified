import { ensureHttpUrl, lineHref, telHref, whatsappHref } from '@/lib/contact'
import { SocialLinkPills } from '@/components/business/SocialLinkPills'
import type { ServiceProvider } from '@/types'

const buttonBase =
  'flex min-h-14 w-full items-center gap-3 rounded-xl p-4 text-base font-medium transition-colors'

interface ContactButtonsProps {
  business: Pick<
    ServiceProvider,
    | 'phone'
    | 'line_id'
    | 'whatsapp'
    | 'facebook_url'
    | 'instagram_url'
    | 'youtube_url'
    | 'tiktok_url'
    | 'google_maps_url'
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

  if (business.whatsapp?.trim()) {
    buttons.push(
      <a
        key="whatsapp"
        href={whatsappHref(business.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
      >
        WhatsApp
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

  if (buttons.length === 0 && !hasSocialLinks(business)) return null

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">ติดต่อธุรกิจ</h2>
      {buttons.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">{buttons}</div>
      )}
      <SocialLinkPills business={business} className={buttons.length > 0 ? 'mt-2' : 'mt-4'} />
    </section>
  )
}

function hasSocialLinks(
  business: Pick<
    ServiceProvider,
    'facebook_url' | 'instagram_url' | 'youtube_url' | 'tiktok_url' | 'google_maps_url'
  >
) {
  return !!(
    business.facebook_url?.trim() ||
    business.instagram_url?.trim() ||
    business.youtube_url?.trim() ||
    business.tiktok_url?.trim() ||
    business.google_maps_url?.trim()
  )
}
