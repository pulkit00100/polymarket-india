import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { fetchNewsByKeywords } from '@/lib/news'

// Called by Vercel cron every day at 9am
export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: markets } = await db
    .from('markets')
    .select('id, title, news_keywords')
    .eq('status', 'open')
    .not('news_keywords', 'eq', '{}')

  if (!markets) return NextResponse.json({ notified: 0 })

  let notified = 0

  for (const market of markets) {
    const articles = await fetchNewsByKeywords(market.news_keywords)
    if (articles.length === 0) continue

    // Skip articles already in cache (already notified)
    const { data: alreadySent } = await db
      .from('news_cache')
      .select('url')
      .eq('market_id', market.id)
      .in('url', articles.map((a) => a.url))

    const sentUrls = new Set((alreadySent ?? []).map((r) => r.url))
    const newArticles = articles.filter((a) => !sentUrls.has(a.url))
    if (newArticles.length === 0) continue

    // Get unique emails of users who bet on this market
    const { data: bettors } = await db
      .from('bets')
      .select('users!user_id(email, name)')
      .eq('market_id', market.id)

    const emails = [...new Set((bettors ?? []).map((b: any) => b.users.email))]
    if (emails.length === 0) continue

    const latest = newArticles[0]

    await resend.emails.send({
      from: 'Polymarket India <noreply@polymarketindia.com>',
      to: emails,
      subject: `Breaking: News on "${market.title}"`,
      html: `
        <h2>News update on a market you're in</h2>
        <p><strong>${market.title}</strong></p>
        <p>${latest.headline}</p>
        <a href="${latest.url}">Read full story</a>
        <br/><br/>
        <a href="${process.env.NEXTAUTH_URL}/markets/${market.id}">View market & place bet →</a>
      `,
    })

    notified++
  }

  return NextResponse.json({ notified })
}
