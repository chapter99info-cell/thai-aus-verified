import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Playfair_Display, Sarabun } from 'next/font/google'
import { FloatingChat } from '@/components/FloatingChat'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
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
  title: 'Thai-Aus Verified Community | ชุมชนบริการสีขาว คนไทยในออสเตรเลีย',
  description:
    'ค้นหาธุรกิจไทยที่ผ่านการยืนยัน ABN ในออสเตรเลีย ปลอดภัย ไม่มีโกง',
  keywords: ['Thai business Australia', 'ABN verified', 'Thai community Sydney'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Thai-Aus Verified Community',
    description: 'ชุมชนบริการสีขาว คนไทยในออสเตรเลีย',
    url: 'https://thai-aus-verified.vercel.app',
    siteName: 'Thai-Aus Verified',
    locale: 'th_TH',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e3a5f',
}

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
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Thai-Aus" />
        <link rel="apple-touch-icon" href={LOGO_URL} />
      </head>
      <body
        className={`${sarabun.className} flex min-h-full flex-col bg-white text-[#0D212C] antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingChat />
      </body>
    </html>
  )
}
