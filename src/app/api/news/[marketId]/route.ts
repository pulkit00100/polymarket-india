import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fetchNewsByKeywords } from '@/lib/news'

export async function GET(req: NextRequest, { params }: { params: Promise<{ marketId: string }> }) {
  const { marketId } = await params
  const { data: market } = await db
    .from('markets')
    .select('news_keywords')
    .eq('id', marketId)
    .single()

  if (!market) return NextResponse.json({ error: 'Market not found' }, { status: 404 })

  // Return cached headlines from last 15 minutes
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const { data: cached } = await db
    .from('news_cache')
    .select('headline, url, published_at')
    .eq('market_id', marketId)
    .gte('fetched_at', since)
    .order('published_at', { ascending: false })
    .limit(10)

  if (cached && cached.length > 0) return NextResponse.json(cached)

  // Cache miss — fetch fresh from NewsAPI
  const articles = await fetchNewsByKeywords(market.news_keywords)

  if (articles.length > 0) {
    await db.from('news_cache').insert(
      articles.map((a) => ({ market_id: marketId, ...a }))
    )
  }

  return NextResponse.json(articles)
}
