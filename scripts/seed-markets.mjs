import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rqormtbyjjrcaozrchnd.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const db = createClient(SUPABASE_URL, SERVICE_KEY)

// Create a system user for seeded markets
const SYSTEM_EMAIL = 'system@polymarketindia.com'
let systemUserId

const { data: existing } = await db.from('users').select('id').eq('email', SYSTEM_EMAIL).single()
if (existing) {
  systemUserId = existing.id
} else {
  const { data: newUser, error } = await db
    .from('users')
    .insert({ email: SYSTEM_EMAIL, name: 'System', points: 0 })
    .select('id')
    .single()
  if (error) { console.error('Failed to create system user:', error.message); process.exit(1) }
  systemUserId = newUser.id
  console.log('Created system user:', systemUserId)
}

// Valid enum values: politics, sports, finance
const markets = [
  {
    title: 'Will India win the ICC Champions Trophy 2025?',
    description: 'India faces tough competition in the Champions Trophy. Will they clinch the title?',
    category: 'sports',
    resolve_at: '2025-03-10T00:00:00Z',
    news_keywords: ['India cricket Champions Trophy 2025'],
    yes_prob: 0.62,
  },
  {
    title: 'Will Virat Kohli retire from Test cricket before end of 2025?',
    description: 'Kohli has been out of form. Will 2025 be his last year in Test cricket?',
    category: 'sports',
    resolve_at: '2025-12-31T00:00:00Z',
    news_keywords: ['Virat Kohli retirement Test cricket 2025'],
    yes_prob: 0.22,
  },
  {
    title: 'Will the RBI cut interest rates before June 2025?',
    description: 'Inflation easing may push RBI to reduce the repo rate in the next monetary policy meeting.',
    category: 'finance',
    resolve_at: '2025-06-01T00:00:00Z',
    news_keywords: ['RBI interest rate cut repo 2025'],
    yes_prob: 0.41,
  },
  {
    title: 'Will Nifty 50 cross 25,000 before July 2025?',
    description: 'Indian equities have been volatile. Can the benchmark index breach the 25k mark?',
    category: 'finance',
    resolve_at: '2025-07-01T00:00:00Z',
    news_keywords: ['Nifty 50 25000 July 2025'],
    yes_prob: 0.55,
  },
  {
    title: 'Will India GDP growth exceed 7% in FY2025-26?',
    description: 'IMF and World Bank projections suggest India remains the fastest-growing major economy.',
    category: 'finance',
    resolve_at: '2026-04-01T00:00:00Z',
    news_keywords: ['India GDP growth FY2026'],
    yes_prob: 0.49,
  },
  {
    title: 'Will BJP retain power in Bihar elections 2025?',
    description: 'Bihar goes to the polls in late 2025. Will the NDA alliance hold its ground?',
    category: 'politics',
    resolve_at: '2025-11-30T00:00:00Z',
    news_keywords: ['Bihar elections 2025 BJP NDA'],
    yes_prob: 0.58,
  },
  {
    title: 'Will a new Opposition alliance replace INDIA bloc by mid-2025?',
    description: 'Several INDIA bloc parties have been fracturing. Will a new opposition front emerge?',
    category: 'politics',
    resolve_at: '2025-06-30T00:00:00Z',
    news_keywords: ['INDIA bloc opposition alliance 2025'],
    yes_prob: 0.28,
  },
  {
    title: 'Will UPI cross 20 billion transactions in a single month before December 2025?',
    description: 'UPI transaction volumes keep breaking records. Will it hit 20 billion in one month?',
    category: 'finance',
    resolve_at: '2025-12-01T00:00:00Z',
    news_keywords: ['UPI transactions record 2025'],
    yes_prob: 0.81,
  },
  {
    title: 'Will India win more than 10 gold medals at the 2026 Commonwealth Games?',
    description: 'India has been strengthening its Commonwealth Games squad. Can they surpass 10 golds?',
    category: 'sports',
    resolve_at: '2026-03-01T00:00:00Z',
    news_keywords: ['India Commonwealth Games 2026 gold medals'],
    yes_prob: 0.45,
  },
]

for (const m of markets) {
  const { yes_prob, ...rest } = m
  const { data, error } = await db
    .from('markets')
    .insert({ ...rest, status: 'open', created_by: systemUserId })
    .select('id')
    .single()

  if (error) { console.error('✗', m.title, '—', error.message); continue }

  const { error: e2 } = await db.from('market_state').insert({
    market_id: data.id,
    yes_probability: yes_prob,
    no_probability: 1 - yes_prob,
    yes_pool: Math.round(yes_prob * 10000),
    no_pool: Math.round((1 - yes_prob) * 10000),
  })

  if (e2) console.error('  market_state error:', e2.message)
  else console.log('✓', m.title)
}

console.log('\nSeeding complete.')
