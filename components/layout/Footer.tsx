import Link from 'next/link'

const FOOTER_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4'

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#0D1B3E] text-white/50">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        src={FOOTER_VIDEO}
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[#0D1B3E]/80" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <img
                src="https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png"
                alt="Thai-Aus Verified"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-white/20 object-contain"
              />
              <span className="text-xl font-bold text-[#C9A84C]">Thai-Aus Verified</span>
            </div>
            <p className="mt-2 text-sm text-white/60">
              ชุมชนบริการสีขาว คนไทยในออสเตรเลีย
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-white/50">
            <Link href="/directory" className="hover:text-[#C9A84C]">
              ค้นหาธุรกิจ
            </Link>
            <Link href="/register" className="hover:text-[#C9A84C]">
              ลงทะเบียน
            </Link>
            <Link href="/alerts" className="hover:text-[#C9A84C]">
              แจ้งเตือนภัย
            </Link>
            <Link href="/terms" className="hover:text-[#C9A84C]">
              ข้อกำหนดและเงื่อนไข
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#C9A84C]">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="mailto:chapter99solutions@gmail.com" className="hover:text-[#C9A84C]">
              ติดต่อเรา
            </Link>
          </nav>

          <div className="text-sm text-white/50">
            <p>chapter99solutions@gmail.com</p>
            <p>0452044382</p>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © 2026 Thai-Aus Verified Community |{' '}
          <span className="text-[#C9A84C]">Powered by Chapter99 Solutions</span>
        </p>

        <div className="mt-4 flex justify-center pb-2">
          <Link
            href="/admin/login"
            className="text-white/20 opacity-30 transition-colors hover:text-white/40 hover:opacity-60"
            title=""
          >
            🔒
          </Link>
        </div>
      </div>
    </footer>
  )
}
