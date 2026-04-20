'use client'

import { useEffect, useState } from 'react'

interface Article {
  headline: string
  url: string
  published_at: string
}

interface NewsFeedProps {
  marketId: string
}

export function NewsFeed({ marketId }: NewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/news/${marketId}`)
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [marketId])

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return <p className="text-sm text-slate-500">No news articles found for this market.</p>
  }

  return (
    <div className="space-y-2">
      {articles.map((a, i) => (
        <a
          key={i}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-slate-800/60 border border-slate-700 rounded-lg hover:border-violet-500/50 transition-colors group"
        >
          <p className="text-sm text-slate-200 group-hover:text-white line-clamp-2">{a.headline}</p>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {new Date(a.published_at).toLocaleDateString()}
          </p>
        </a>
      ))}
    </div>
  )
}
