import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto bg-[#1e3a5f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="text-xl font-bold">Thai-Aus Verified</p>
            <p className="mt-2 text-sm text-white/80">
              ชุมชนบริการสีขาว คนไทยในออสเตรเลีย
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-white/80">
            <Link href="/directory" className="hover:text-white">
              ค้นหาธุรกิจ
            </Link>
            <Link href="/register" className="hover:text-white">
              ลงทะเบียน
            </Link>
            <Link href="/alerts" className="hover:text-white">
              แจ้งเตือนภัย
            </Link>
            <Link href="mailto:chapter99solutions@gmail.com" className="hover:text-white">
              ติดต่อเรา
            </Link>
          </nav>

          <div className="text-sm text-white/80">
            <p>chapter99solutions@gmail.com</p>
            <p>0452044382</p>
          </div>
        </div>

        <p className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/60">
          © 2025 Thai-Aus Verified Community | Powered by Chapter99 Solutions
        </p>
      </div>
    </footer>
  )
}
