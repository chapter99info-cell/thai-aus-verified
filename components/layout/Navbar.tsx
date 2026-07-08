'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, UserCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

const MOBILE_MENU_LINKS = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/directory', label: 'ค้นหาช่าง' },
  { href: '/register/professional', label: 'ลงทะเบียน' },
  { href: '/pricing', label: 'สมัครโฆษณา' },
] as const

const MVP_LINKS = [
  { href: '/jobs', label: '🔍 หางาน' },
  { href: '/shops', label: '🏪 ร้านค้า' },
] as const

type NavItem = {
  type: 'link'
  href: string
  label: string
  external?: boolean
  gold?: boolean
}

const loggedOutTail: NavItem[] = [
  { type: 'link', href: '/directory', label: 'ค้นหาธุรกิจ' },
  { type: 'link', href: '/resources', label: 'ลิงก์มีประโยชน์' },
  { type: 'link', href: '/alerts', label: 'แจ้งเตือนภัย' },
  { type: 'link', href: '/terms', label: 'เกี่ยวกับเรา' },
  { type: 'link', href: '/pricing', label: 'ราคา' },
  { type: 'link', href: '/login', label: 'เข้าสู่ระบบ' },
]

const loggedInTail: NavItem[] = [
  { type: 'link', href: '/directory', label: 'ค้นหาธุรกิจ' },
  { type: 'link', href: '/resources', label: 'ลิงก์มีประโยชน์' },
  { type: 'link', href: '/alerts', label: 'แจ้งเตือนภัย' },
  { type: 'link', href: '/terms', label: 'เกี่ยวกับเรา' },
  { type: 'link', href: '/pricing', label: 'ราคา' },
]

function NavAnimatedLink({
  href,
  label,
  isActive,
  external,
  gold,
  onClick,
}: {
  href: string
  label: string
  isActive: boolean
  external?: boolean
  gold?: boolean
  onClick?: () => void
}) {
  const className = cn(
    gold
      ? 'inline-flex min-h-[44px] items-center rounded-full bg-[#C9A84C] px-4 py-2 text-base font-bold text-[#0D1B3E] hover:bg-[#D4A017]'
      : cn(
          'px-3 py-2 text-base font-medium text-white/80 transition-colors hover:text-[#C9A84C]',
          isActive && 'font-semibold text-[#C9A84C]'
        )
  )

  const content = <>{label}</>

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

function UserMenu({
  email,
  onSignOut,
}: {
  email: string
  onSignOut: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="เมนูผู้ใช้"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-[#C9A84C]"
      >
        <UserCircle className="h-6 w-6" aria-hidden />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl bg-white shadow-lg"
        >
          <p className="px-4 py-3 text-sm text-gray-500" role="presentation">
            👤 {email}
          </p>
          <div className="border-t border-gray-100" />
          <Link
            href="/dashboard"
            role="menuitem"
            className="flex items-center px-4 py-3 text-base text-[#0D1B3E] hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            📊 แดชบอร์ด
          </Link>
          <div className="border-t border-gray-100" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              onSignOut()
            }}
            className="flex w-full items-center px-4 py-3 text-left text-base text-red-500 hover:bg-red-50"
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  )
}

export const NAVBAR_VERSION = 'user-menu-v3-brand'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isVerifiedOwner, setIsVerifiedOwner] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function syncProfile(authUser: User | null) {
      if (!mounted) return

      setUser(authUser)

      if (!authUser) {
        setIsVerifiedOwner(false)
        return
      }

      const { data: provider } = await supabase
        .from('providers')
        .select('is_verified')
        .eq('id', authUser.id)
        .single()

      if (mounted) {
        setIsVerifiedOwner(provider?.is_verified === true)
      }
    }

    async function refreshSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      await syncProfile(session?.user ?? null)
    }

    void refreshSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncProfile(session?.user ?? null)
    })

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void refreshSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)

      if (!session?.user) {
        setIsVerifiedOwner(false)
        return
      }

      void supabase
        .from('providers')
        .select('is_verified')
        .eq('id', session.user.id)
        .single()
        .then(({ data: provider }) => {
          setIsVerifiedOwner(provider?.is_verified === true)
        })
    })
  }, [pathname])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsVerifiedOwner(false)
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const navItems = useMemo(() => {
    const mvpItems: NavItem[] = MVP_LINKS.map((link) => ({
      type: 'link' as const,
      href: link.href,
      label: link.label,
    }))

    if (isVerifiedOwner && user) {
      mvpItems.push({
        type: 'link',
        href: '/jobs/post',
        label: '📢 โพสต์งาน',
        gold: true,
      })
    }

    const tail = user ? loggedInTail : loggedOutTail
    return [...mvpItems, ...tail]
  }, [user, isVerifiedOwner])

  function renderNavItem(item: NavItem, mobile = false) {
    const closeMobile = () => mobile && setOpen(false)

    if (mobile) {
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex min-h-[52px] items-center border-b border-white/10 px-6 py-2 text-base font-medium',
            item.gold
              ? 'bg-[#C9A84C] text-[#0D1B3E] justify-center mx-4 my-1 rounded-full border-0 font-bold'
              : isActive(item.href)
                ? 'border-l-4 border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                : 'text-white/80'
          )}
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
        gold={item.gold}
      />
    )
  }

  return (
    <header ref={mobileMenuRef} className="fixed top-0 left-0 right-0 z-50 will-change-transform">
      <nav className="border-b border-[#C9A84C]/20 bg-[#0D1B3E] shadow-sm">
        <div className="mx-auto flex min-h-[72px] max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2">
            <img
              src={LOGO_URL}
              alt="Thai-Aus Verified"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-contain ring-2 ring-[#C9A84C]/30"
            />
            <span className="font-playfair text-xl font-bold text-[#C9A84C]">
              Thai-Aus Verified
            </span>
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            <div className="flex items-center gap-5">
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
            </div>
            {user && (
              <>
                <div className="h-8 w-px bg-[#C9A84C]/20" aria-hidden />
                <UserMenu email={user.email ?? ''} onSignOut={handleSignOut} />
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {user && <UserMenu email={user.email ?? ''} onSignOut={handleSignOut} />}
            <button
              type="button"
              className="rounded-lg p-2 text-white/90 hover:text-[#C9A84C]"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          'overflow-hidden border-[#C9A84C]/20 bg-[#0D1B3E] transition-all duration-300 ease-in-out md:hidden',
          open ? 'max-h-80 border-b opacity-100' : 'max-h-0 border-b-0 opacity-0'
        )}
      >
        <div className="flex flex-col py-2">
          {MOBILE_MENU_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex min-h-[52px] items-center px-6 py-2 text-base font-medium text-white transition-colors hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]',
                isActive(link.href) && 'border-l-4 border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
