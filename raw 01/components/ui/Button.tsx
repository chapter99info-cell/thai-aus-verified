import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        variant === 'primary' && 'bg-[#1e3a5f] text-white hover:bg-[#2d5282]',
        variant === 'secondary' &&
          'border border-[#1e3a5f] text-[#1e3a5f] hover:bg-slate-100',
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'
