import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
