import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Polymarket India — Predict. Profit.',
  description: "India's first prediction market platform. Bet on news events with virtual coins.",
  manifest: '/manifest.json',
  themeColor: '#f59e0b',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PM India',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {/* md:pb-0 — remove bottom nav padding on desktop */}
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
