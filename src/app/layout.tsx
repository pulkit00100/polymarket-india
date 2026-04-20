import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Polymarket India — Predict. Profit.',
  description: "India's first prediction market platform. Bet on news events with virtual coins.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0F172A] text-slate-100 flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
