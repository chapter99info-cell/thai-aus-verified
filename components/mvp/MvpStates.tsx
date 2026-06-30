import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

export function MvpErrorState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string
  message: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="rounded-2xl border-2 border-[#D4A017] bg-white p-6 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-[#D4A017]" aria-hidden />
      <h2 className="mt-3 text-[22px] font-bold text-[#0D1B3E]">{title}</h2>
      <p className="mt-2 text-base text-[#0D1B3E]">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#D4A017] px-6 text-base font-semibold text-[#0D1B3E] sm:w-auto"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export function MvpEmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-8 text-center">
      <div className="text-5xl">{icon}</div>
      <h2 className="mt-4 text-[22px] font-bold text-[#0D1B3E]">{title}</h2>
      <p className="mt-2 text-base text-[#0D1B3E]">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
