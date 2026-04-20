import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Polymarket India — Predict. Profit.',
  description: "India's first prediction market platform. Bet on news events with virtual coins.",
  manifest: '/manifest.json',
  themeColor: '#09090b',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 bottom-nav-pad">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
