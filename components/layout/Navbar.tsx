'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const publicLinks = [
  { href: '/directory', label: 'ค้นหาธุรกิจ' },
  { href: '/pricing', label: 'ราคา' },
  { href: '/alerts', label: 'แจ้งเตือนภัย' },
  { href: '/terms', label: 'เกี่ยวกับเรา' },
]

export function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setFullName(profile.full_name)
        }

        const { data: provider } = await supabase
          .from('service_providers')
          .select('business_name')
          .eq('profile_id', authUser.id)
          .maybeSingle()

        setBusinessName(provider?.business_name ?? '')
      }
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
    router.push('/')
    router.refresh()
  }

  const registerBtnClass =
    'btn-navy-primary rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90'

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(5,26,36,0.08)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-playfair text-[20px] font-bold text-[#051A24]">
          Thai-Aus Verified
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[rgba(5,26,36,0.45)] transition-colors hover:text-[#051A24]"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span className="text-sm text-[rgba(5,26,36,0.45)]">
                {businessName || fullName || user.email?.split('@')[0]}
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-[rgba(5,26,36,0.45)] hover:text-[#051A24]"
              >
                แดชบอร์ด
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-[rgba(5,26,36,0.45)] hover:text-[#051A24]"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[rgba(5,26,36,0.45)] hover:text-[#051A24]"
              >
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className={registerBtnClass}>
                ลงทะเบียนธุรกิจ
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-[#051A24] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          'border-t border-[rgba(5,26,36,0.08)] bg-white/95 md:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-[#051A24] hover:bg-[#f9fafb]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm" onClick={() => setOpen(false)}>
                แดชบอร์ด
              </Link>
              <button type="button" onClick={handleSignOut} className="rounded-lg px-3 py-2 text-left text-sm">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm" onClick={() => setOpen(false)}>
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className={`${registerBtnClass} mt-2 text-center`} onClick={() => setOpen(false)}>
                ลงทะเบียนธุรกิจ
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
