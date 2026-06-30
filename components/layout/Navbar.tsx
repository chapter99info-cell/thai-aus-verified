'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, UserCircle, X } from 'lucide-react'
import { isVerifiedOwnerRole } from '@/lib/job-board'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

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
      ? 'inline-flex min-h-[44px] items-center rounded-full bg-[#D4A017] px-4 py-2 text-base font-semibold text-[#0D1B3E]'
      : cn(
          'nav-link px-3 py-2 !text-base !font-medium',
          isActive &&
            'text-[#D4A017] underline decoration-[#D4A017] decoration-2 underline-offset-4'
        )
  )

  const content = (
    <>
      {label}
      {!gold && <span className="nav-link-dot" />}
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
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#0D1B3E] transition-colors hover:bg-[#0D1B3E]/10"
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

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isVerifiedOwner, setIsVerifiedOwner] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)

      if (!authUser) {
        setIsVerifiedOwner(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      setIsVerifiedOwner(isVerifiedOwnerRole(profile?.role))
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

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
            'flex min-h-[52px] items-center border-b border-[#0D1B3E]/10 px-6 py-2 text-base font-medium',
            item.gold
              ? 'bg-[#D4A017] text-[#0D1B3E] justify-center mx-4 my-1 rounded-full border-0'
              : isActive(item.href)
                ? 'border-l-4 border-[#D4A017] bg-[#D4A017]/5 text-[#D4A017]'
                : 'text-[#0D1B3E]'
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
    <header className="fixed top-0 left-0 right-0 z-50 will-change-transform">
      <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex min-h-[72px] max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2">
            <img
              src={LOGO_URL}
              alt="Thai-Aus Verified"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-contain"
            />
            <span className="font-playfair text-xl font-bold text-[#1e3a5f]">
              Thai-Aus Verified
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
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
                <div className="h-8 w-px bg-[#0D1B3E]/15" aria-hidden />
                <UserMenu email={user.email ?? ''} onSignOut={handleSignOut} />
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {user && <UserMenu email={user.email ?? ''} onSignOut={handleSignOut} />}
            <button
              type="button"
              className="rounded-lg p-2 text-[#1e3a5f]"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          'border-b border-slate-200 bg-white lg:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="flex flex-col py-2">
          {navItems.map((item) => renderNavItem(item, true))}
          {!user && (
            <Link
              href="/register"
              className="nav-cta-btn mx-6 mt-2 inline-flex min-h-[52px] items-center justify-center gap-1 rounded-full px-5 py-2.5 text-center text-base font-bold text-white"
              onClick={() => setOpen(false)}
            >
              <span className="text-[10px] opacity-70">✦</span>
              ลงทะเบียนธุรกิจ
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
