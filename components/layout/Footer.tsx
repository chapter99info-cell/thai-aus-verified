import Link from 'next/link'

const FOOTER_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4'

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#1e3a5f] text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        src={FOOTER_VIDEO}
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[#1e3a5f]/80" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <img
                src="https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png"
                alt="Thai-Aus Verified"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-contain"
                style={{ border: '2px solid rgba(255,255,255,0.2)' }}
              />
              <span className="text-xl font-bold text-white">Thai-Aus Verified</span>
            </div>
            <p className="mt-2 text-sm text-white/90">
              ชุมชนบริการสีขาว คนไทยในออสเตรเลีย
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-white/90">
            <Link href="/directory" className="hover:text-white">
              ค้นหาธุรกิจ
            </Link>
            <Link href="/register" className="hover:text-white">
              ลงทะเบียน
            </Link>
            <Link href="/alerts" className="hover:text-white">
              แจ้งเตือนภัย
            </Link>
            <Link href="/terms" className="hover:text-white">
              ข้อกำหนดและเงื่อนไข
            </Link>
            <Link href="/privacy-policy" className="hover:text-white">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="mailto:chapter99solutions@gmail.com" className="hover:text-white">
              ติดต่อเรา
            </Link>
          </nav>

          <div className="text-sm text-white/90">
            <p>chapter99solutions@gmail.com</p>
            <p>0452044382</p>
          </div>
        </div>

        <p className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/70">
          © 2026 Thai-Aus Verified Community | Powered by Chapter99 Solutions
        </p>
      </div>
    </footer>
  )
}
