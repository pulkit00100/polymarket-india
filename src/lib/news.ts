interface NewsArticle {
  headline: string
  url: string
  published_at: string
}

export async function fetchNewsByKeywords(keywords: string[]): Promise<NewsArticle[]> {
  if (keywords.length === 0) return []

  const query = keywords.join(' OR ')
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`

  const res = await fetch(url, { next: { revalidate: 900 } }) // 15-min cache
  if (!res.ok) return []

  const data = await res.json()
  return (data.articles ?? []).map((a: any) => ({
    headline: a.title,
    url: a.url,
    published_at: a.publishedAt,
  }))
}
