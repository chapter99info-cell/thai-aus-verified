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

export function hasContactChannel(provider: {
  phone?: string | null
  line_id?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  website?: string | null
  portfolio_url?: string | null
}) {
  return !!(
    provider.phone?.trim() ||
    provider.line_id?.trim() ||
    provider.facebook_url?.trim() ||
    provider.instagram_url?.trim() ||
    provider.website?.trim() ||
    provider.portfolio_url?.trim()
  )
}
