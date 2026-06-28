import Link from 'next/link'

const FOOTER_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4'

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#122540] text-white">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-center"
          src={FOOTER_VIDEO}
        />
      </div>

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(18, 37, 64, 0.82) 0%, rgba(18, 37, 64, 0.88) 60%, rgba(18, 37, 64, 0.95) 100%)',
        }}
      />

      <div className="relative z-[2] mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <img
                src="https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png"
                alt="Thai-Aus Verified Logo"
                width={48}
                height={48}
                className="rounded-full border-2 border-white object-cover"
              />
              <span className="text-xl font-bold text-white">Thai-Aus Verified</span>
            </div>
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

          <div className="text-sm text-white/80">
            <p>chapter99solutions@gmail.com</p>
            <p>0452044382</p>
          </div>
        </div>

        <p className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/60">
          © 2026 Thai-Aus Verified Community | Powered by Chapter99 Solutions
        </p>
      </div>
    </footer>
  )
}
