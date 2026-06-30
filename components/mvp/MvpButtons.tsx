import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function GoldButton({
  href,
  onClick,
  type = 'button',
  disabled,
  children,
  className,
}: {
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  children: ReactNode
  className?: string
}) {
  const classes = cn(
    'inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-6 text-base font-semibold text-[#0D1B3E] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40',
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}

export function NavyButton({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0D1B3E] px-6 text-base font-semibold text-white transition-opacity hover:opacity-90',
        className
      )}
    >
      {children}
    </Link>
  )
}
