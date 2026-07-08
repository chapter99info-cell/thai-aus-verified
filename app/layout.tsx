import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Playfair_Display, Sarabun } from 'next/font/google'
import { FloatingChat } from '@/components/FloatingChat'
import { Footer } from '@/components/layout/Footer'
import { Navbar, NAVBAR_VERSION } from '@/components/layout/Navbar'
import './globals.css'

const sarabun = Sarabun({
  variable: '--font-sarabun',
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['700', '800'],
  style: ['normal', 'italic'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

export const metadata: Metadata = {
  title: 'Thai-Aus Verified Community | ชุมชนคนไทยในออสเตรเลีย',
  description:
    'Digital Yellow Pages สำหรับธุรกิจไทยในออสเตรเลีย ทุกธุรกิจต้องยืนยัน ABN ก่อนแสดงผล ปลอดภัย โปร่งใส ไม่มีสแกมเมอร์',
  keywords:
    'Thai Australia, ABN verified, ช่างไทย, Thai business Australia, คนไทยออสเตรเลีย',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Thai-Aus Verified Community',
    description: 'ชุมชนบริการสีขาว คนไทยในออสเตรเลีย',
    url: 'https://thai-ausverified.com.au',
    siteName: 'Thai-Aus Verified Community',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thai-Aus Verified Community',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0D1B3E',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} ${playfair.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href={LOGO_URL} />
        <meta name="theme-color" content="#0D1B3E" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Thai-Aus" />
        <link rel="apple-touch-icon" href={LOGO_URL} />
      </head>
      <body
        className={`${sarabun.className} flex min-h-full flex-col bg-[#F5F5F0] text-[#0D1B3E] antialiased`}
      >
        <Navbar key={NAVBAR_VERSION} />
        <main className="flex-1 pt-[72px]">{children}</main>
        <Footer />
        <FloatingChat />
      </body>
    </html>
  )
}
