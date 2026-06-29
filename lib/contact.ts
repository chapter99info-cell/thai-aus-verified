export function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '')
  return `tel:${cleaned}`
}

export function lineHref(lineId: string) {
  const id = lineId.replace(/^@/, '').trim()
  return `https://line.me/ti/p/~${encodeURIComponent(id)}`
}

export function ensureHttpUrl(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function extractUsername(url: string): string {
  if (!url) return ''
  const parts = url.replace(/\/$/, '').split('/')
  return parts[parts.length - 1] || parts[parts.length - 2] || url
}

export function messengerHref(facebookUrl: string) {
  const trimmed = facebookUrl.trim()
  if (!trimmed) return ''
  const slug = extractUsername(trimmed)
  if (!slug || slug === 'www.facebook.com' || slug === 'facebook.com') return ensureHttpUrl(trimmed)
  return `https://m.me/${encodeURIComponent(slug)}`
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const au = digits.startsWith('61')
    ? digits
    : digits.startsWith('0')
      ? `61${digits.slice(1)}`
      : `61${digits}`
  return `https://wa.me/${au}`
}

export function instagramHref(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://instagram.com/${trimmed.replace(/^@/, '')}`
}

export function tiktokHref(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://tiktok.com/@${trimmed.replace(/^@/, '')}`
}

export function hasContactChannel(provider: {
  phone?: string | null
  line_id?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  whatsapp?: string | null
  website?: string | null
  portfolio_url?: string | null
}) {
  return !!(
    provider.phone?.trim() ||
    provider.line_id?.trim() ||
    provider.facebook_url?.trim() ||
    provider.instagram_url?.trim() ||
    provider.tiktok_url?.trim() ||
    provider.whatsapp?.trim() ||
    provider.website?.trim() ||
    provider.portfolio_url?.trim()
  )
}
