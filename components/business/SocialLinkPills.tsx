import { ensureHttpUrl } from '@/lib/contact'
import type { ServiceProvider } from '@/types'

type SocialBusiness = Pick<
  ServiceProvider,
  | 'facebook_url'
  | 'instagram_url'
  | 'youtube_url'
  | 'tiktok_url'
  | 'google_maps_url'
>

export function SocialLinkPills({
  business,
  className = 'mt-2',
}: {
  business: SocialBusiness
  className?: string
}) {
  const hasSocial =
    business.facebook_url?.trim() ||
    business.instagram_url?.trim() ||
    business.youtube_url?.trim() ||
    business.tiktok_url?.trim() ||
    business.google_maps_url?.trim()

  if (!hasSocial) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {business.facebook_url?.trim() && (
        <a
          href={ensureHttpUrl(business.facebook_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
        >
          <span>📘</span> Facebook
        </a>
      )}
      {business.instagram_url?.trim() && (
        <a
          href={ensureHttpUrl(business.instagram_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 text-xs text-white hover:opacity-90"
        >
          <span>📸</span> Instagram
        </a>
      )}
      {business.tiktok_url?.trim() && (
        <a
          href={ensureHttpUrl(business.tiktok_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-full bg-black px-2 py-1 text-xs text-white hover:bg-gray-800"
        >
          <span>🎵</span> TikTok
        </a>
      )}
      {business.youtube_url?.trim() && (
        <a
          href={ensureHttpUrl(business.youtube_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
        >
          <span>▶️</span> YouTube
        </a>
      )}
      {business.google_maps_url?.trim() && (
        <a
          href={ensureHttpUrl(business.google_maps_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
        >
          <span>📍</span> Google Maps
        </a>
      )}
    </div>
  )
}
