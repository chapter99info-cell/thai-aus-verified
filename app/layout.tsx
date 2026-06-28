import type { Metadata } from 'next'
import { Geist_Mono, Playfair_Display, Sarabun } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Thai-Aus Verified Community | ชุมชนบริการสีขาว คนไทยในออสเตรเลีย',
  description:
    'ค้นหาธุรกิจไทยที่ผ่านการยืนยัน ABN ในออสเตรเลีย ปลอดภัย ไม่มีโกง',
  keywords: ['Thai business Australia', 'ABN verified', 'Thai community Sydney'],
  openGraph: {
    title: 'Thai-Aus Verified Community',
    description: 'ชุมชนบริการสีขาว คนไทยในออสเตรเลีย',
    url: 'https://thai-aus-verified.vercel.app',
    siteName: 'Thai-Aus Verified',
    locale: 'th_TH',
    type: 'website',
  },
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
      <body
        className={`${sarabun.className} flex min-h-full flex-col bg-white text-[#0D212C] antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
