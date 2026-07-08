interface PremiumBadgeProps {
  className?: string
}

export function PremiumBadge({ className = '' }: PremiumBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 ${className}`}
    >
      ⭐ Premium Verified
    </span>
  )
}

interface VerifiedBadgeProps {
  className?: string
}

export function VerifiedBadge({ className = '' }: VerifiedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ${className}`}
    >
      ✅ ยืนยันแล้ว - Verified
    </span>
  )
}
