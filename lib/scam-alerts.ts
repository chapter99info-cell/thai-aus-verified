export type ScamAlertType =
  | 'money'
  | 'housing'
  | 'job'
  | 'fake_product'
  | 'online'
  | 'other'

export type ScamAlertSeverity = 'warning' | 'danger' | 'critical'

export const SCAM_ALERT_TYPES: { value: ScamAlertType; label: string }[] = [
  { value: 'money', label: '💰 โกงเงิน / ไม่จ่ายเงิน' },
  { value: 'housing', label: '🏠 หลอกเรื่องที่พัก' },
  { value: 'job', label: '💼 หลอกหางาน' },
  { value: 'fake_product', label: '🛍️ ขายสินค้าปลอม' },
  { value: 'online', label: '📱 หลอกออนไลน์' },
  { value: 'other', label: '⚠️ อื่นๆ' },
]

export const SCAM_ALERT_STATES = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'ACT',
  'NT',
  'ไม่ระบุ',
] as const

export const SCAM_ALERT_SEVERITIES: {
  value: ScamAlertSeverity
  label: string
  dotClass: string
  badgeClass: string
}[] = [
  {
    value: 'warning',
    label: '🟡 ระวัง',
    dotClass: 'bg-yellow-400',
    badgeClass: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'danger',
    label: '🟠 อันตราย',
    dotClass: 'bg-orange-500',
    badgeClass: 'bg-orange-100 text-orange-800',
  },
  {
    value: 'critical',
    label: '🔴 อันตรายมาก',
    dotClass: 'bg-red-600',
    badgeClass: 'bg-red-100 text-red-800',
  },
]

export function getAlertTypeLabel(type?: string): string {
  return SCAM_ALERT_TYPES.find((t) => t.value === type)?.label ?? type ?? '⚠️ อื่นๆ'
}

export function getAlertTypeBadgeClass(type?: string): string {
  switch (type) {
    case 'money':
      return 'bg-amber-100 text-amber-800'
    case 'housing':
      return 'bg-blue-100 text-blue-800'
    case 'job':
      return 'bg-purple-100 text-purple-800'
    case 'fake_product':
      return 'bg-pink-100 text-pink-800'
    case 'online':
      return 'bg-cyan-100 text-cyan-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function getSeverityMeta(severity?: string) {
  return (
    SCAM_ALERT_SEVERITIES.find((s) => s.value === severity) ?? SCAM_ALERT_SEVERITIES[0]
  )
}
