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
  { href: '/alerts', label: 'แจ้งเตือนภัย' },
]

export function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [isVerifiedBusiness, setIsVerifiedBusiness] = useState(false)

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
          setIsVerifiedBusiness(profile.role === 'verified_business')
        }
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
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-[#1e3a5f]"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <span className="text-sm text-slate-600">
                สวัสดี {fullName || user.email?.split('@')[0]}
              </span>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#1e3a5f] hover:underline"
              >
                แดชบอร์ด
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-[#1e3a5f]"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d5282]"
              >
                ลงทะเบียนธุรกิจ
              </Link>
            </>
          )}
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
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm text-[#1e3a5f]"
                onClick={() => setOpen(false)}
              >
                แดชบอร์ด
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleSignOut()
                  setOpen(false)
                }}
                className="rounded-lg px-3 py-2 text-left text-sm text-slate-600"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm text-slate-700"
                onClick={() => setOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="mt-2 rounded-lg bg-[#1e3a5f] px-3 py-2 text-center text-sm font-medium text-white"
                onClick={() => setOpen(false)}
              >
                ลงทะเบียนธุรกิจ
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
