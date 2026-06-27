'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/directory', label: 'ค้นหาธุรกิจ' },
  { href: '/alerts', label: 'แจ้งเตือนภัย' },
  { href: '/login', label: 'เข้าสู่ระบบ' },
  { href: '/register', label: 'ลงทะเบียน' },
]

interface NavbarProps {
  isVerifiedBusiness?: boolean
}

export function Navbar({ isVerifiedBusiness = false }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#1e3a5f] sm:text-xl">Thai-Aus Verified</span>
          {isVerifiedBusiness && (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Verified
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-[#1e3a5f]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d5282]"
          >
            ลงทะเบียนธุรกิจ
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          'border-t border-slate-200 bg-white md:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="mt-2 rounded-lg bg-[#1e3a5f] px-3 py-2 text-center text-sm font-medium text-white"
            onClick={() => setOpen(false)}
          >
            ลงทะเบียนธุรกิจ
          </Link>
        </nav>
      </div>
    </header>
  )
}
