'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const CHAPTER99_URL = 'https://chapter99solutions.com.au'

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

type NavItem =
  | { type: 'link'; href: string; label: string; external?: boolean }
  | { type: 'chapter99' }
  | { type: 'signout' }

const loggedOutLinks: NavItem[] = [
  { type: 'link', href: '/directory', label: 'ค้นหาธุรกิจ' },
  { type: 'link', href: '/resources', label: 'ลิงก์มีประโยชน์' },
  { type: 'link', href: '/alerts', label: 'แจ้งเตือนภัย' },
  { type: 'link', href: '/terms', label: 'เกี่ยวกับเรา' },
  { type: 'link', href: '/pricing', label: 'ราคา' },
  { type: 'link', href: '/login', label: 'เข้าสู่ระบบ' },
]

const loggedInLinks: NavItem[] = [
  { type: 'link', href: '/directory', label: 'ค้นหาธุรกิจ' },
  { type: 'link', href: '/resources', label: 'ลิงก์มีประโยชน์' },
  { type: 'link', href: '/alerts', label: 'แจ้งเตือนภัย' },
  { type: 'link', href: '/terms', label: 'เกี่ยวกับเรา' },
  { type: 'chapter99' },
  { type: 'link', href: '/dashboard', label: 'แดชบอร์ด' },
  { type: 'link', href: '/pricing', label: 'ราคา' },
  { type: 'signout' },
]

function NavAnimatedLink({
  href,
  label,
  isActive,
  external,
  onClick,
}: {
  href: string
  label: string
  isActive: boolean
  external?: boolean
  onClick?: () => void
}) {
  const className = cn('nav-link', isActive && 'nav-link-active')

  const content = (
    <>
      {label}
      <span className="nav-link-dot" />
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {content}
    </Link>
  )
}

function Chapter99Link({ onClick }: { onClick?: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div className="nav-tooltip pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 whitespace-nowrap rounded-lg bg-[#1e3a5f] px-3 py-1.5 text-[11px] text-white shadow-lg">
          บริหารโดย Chapter99 Solutions 🇹🇭
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1e3a5f]" />
        </div>
      )}
      <a
        href={CHAPTER99_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link"
        onClick={onClick}
      >
        chapter99info
        <span className="nav-link-dot" />
      </a>
    </div>
  )
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [borderAnimated, setBorderAnimated] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setBorderAnimated(false), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const navItems = user ? loggedInLinks : loggedOutLinks

  function renderNavItem(item: NavItem, mobile = false) {
    const closeMobile = () => mobile && setOpen(false)

    if (item.type === 'chapter99') {
      return mobile ? (
        <a
          key="chapter99"
          href={CHAPTER99_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-[rgba(30,58,95,0.05)] px-6 py-3 text-sm text-[#1e3a5f] active:scale-95"
          onClick={closeMobile}
        >
          chapter99info
        </a>
      ) : (
        <Chapter99Link key="chapter99" />
      )
    }

    if (item.type === 'signout') {
      return (
        <button
          key="signout"
          type="button"
          onClick={() => {
            closeMobile()
            handleSignOut()
          }}
          className={cn(
            mobile
              ? 'border-b border-[rgba(30,58,95,0.05)] px-6 py-3 text-left text-sm text-[#1e3a5f] active:scale-95'
              : 'nav-link'
          )}
        >
          {mobile ? 'ออกจากระบบ' : (
            <>
              ออกจากระบบ
              <span className="nav-link-dot" />
            </>
          )}
        </button>
      )
    }

    if (mobile) {
      return (
        <Link
          key={item.href}
          href={item.href}
          className="border-b border-[rgba(30,58,95,0.05)] px-6 py-3 text-sm text-[#1e3a5f] active:scale-95"
          onClick={closeMobile}
        >
          {item.label}
        </Link>
      )
    }

    return (
      <NavAnimatedLink
        key={item.href}
        href={item.href}
        label={item.label}
        isActive={isActive(item.href)}
        external={item.external}
      />
    )
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-[60px] transition-[box-shadow,background-color] duration-300',
        borderAnimated ? 'nav-border-animate' : 'border-b border-[rgba(30,58,95,0.08)]',
        scrolled
          ? 'bg-[rgba(255,255,255,0.97)] shadow-[0_4px_20px_rgba(30,58,95,0.08)] backdrop-blur-[16px]'
          : 'bg-[rgba(255,255,255,0.92)] backdrop-blur-[16px]'
      )}
    >
      <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <img
            src={LOGO_URL}
            alt="Thai-Aus Verified"
            width={36}
            height={36}
            className="nav-logo-emoji h-9 w-9 rounded-full object-contain"
          />
          <span className="font-playfair text-[18px] font-bold text-[#1e3a5f] transition-colors duration-300 group-hover:text-[#3d6fa3]">
            Thai-Aus Verified
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => renderNavItem(item))}
          {!user && (
            <Link
              href="/register"
              className="nav-cta-btn inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-[13px] font-bold text-white"
            >
              <span className="text-[10px] opacity-70">✦</span>
              ลงทะเบียนธุรกิจ
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-[#1e3a5f] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          'border-b border-[rgba(30,58,95,0.08)] bg-white md:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <nav className="flex flex-col gap-1 py-4">
          {navItems.map((item) => renderNavItem(item, true))}
          {!user && (
            <Link
              href="/register"
              className="nav-cta-btn mx-6 mt-2 inline-flex items-center justify-center gap-1 rounded-full px-5 py-2.5 text-center text-[13px] font-bold text-white active:scale-95"
              onClick={() => setOpen(false)}
            >
              <span className="text-[10px] opacity-70">✦</span>
              ลงทะเบียนธุรกิจ
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
