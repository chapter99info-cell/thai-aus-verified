export const ADMIN_COOKIE = 'admin_auth'
export const ADMIN_TOKEN_HEX_LENGTH = 64

export function hasAdminCookieValue(value: string | undefined): boolean {
  return (
    typeof value === 'string' &&
    value.length === ADMIN_TOKEN_HEX_LENGTH &&
    /^[a-f0-9]+$/.test(value)
  )
}
